/**
 * state.js — ゲームステート管理モジュール
 *
 * 全ゲーム状態の定義・保存・読込・リセットを担当。
 * 感染トリガー判定とエンディング条件チェックも実装。
 * 他モジュールは window.TTY.STATE を読み書きする。
 */

window.TTY = window.TTY || {};

const STORAGE_KEY = 'tty_game_state';

/** 感染トリガーとなる呪いスタンプ */
const CURSED_STAMPS = ['🌙', '⛩', '💀', '🕯', '🪦'];

/** 投稿禁止ワード */
const FORBIDDEN_WORDS = [
  '呪い', '呪われ', '呪う',
  '九十九', '太助',
  '石送り', 'いしおくり',
  '感染', '移した', '移る',
  '死ぬ', '死にたい', '死にました',
  '逃げ', '逃げる', '逃げたい',
  '助けて', '助けてください',
  'サーバー', 'システム停止',
  'TSUKUMO', 'tsukumo',
  'TTYの正体',
];

/** 初期ゲームステート */
function createInitialState() {
  return {
    // ─── プレイヤー情報 ───
    playerName: '',
    playerHandle: '',
    playerBio: '',
    playerAvatarChar: '?',

    // ─── 時間管理 ───
    gameDay: 1,
    gameDaysUntilDeath: 9,
    gameStartTimestamp: 0,
    lastSaveTimestamp: 0,
    lastActiveTimestamp: 0,

    // ─── 感染管理 ───
    infectionLevel: 0,       // 0〜100
    infected: false,
    infectionTrigger: null,  // どのトリガーで感染したか
    infectionPhase: 0,       // 0/1/2/3
    infectionTimestamp: 0,   // 感染した時刻
    warningShown: false,
    corruptedPostShown: false,

    // ─── 行動ログ（感染トリガー判定用）───
    likeCounts: {},             // { postId: count }
    residentLikeCounts: {},     // { residentId: count }
    stampsUsed: {},             // { stamp: count }
    lateNightDMSent: false,
    forbiddenWordsPosted: [],
    postCount: 0,
    consecutiveLikePostId: null,
    consecutiveLikeCount: 0,
    consecutiveLikeTimestamp: 0,

    // ─── SNS行動 ───
    followedResidents: [],
    likedPosts: [],
    seenPosts: [],
    dmCount: 0,
    dmWith: '',
    dmHistories: {},            // { residentId: [{role, text, time}] }
    sharedToExternal: false,

    // ─── 解禁状態 ───
    discoveredClues: [],
    unlockedEndings: [],
    revealedTruth: false,
    yamadaFollowed: false,
    signatureFound: false,
    hiddenPostsUnlocked: [],
    infectedCount: 0,           // プレイヤーが感染させた人数

    // ─── 通知 ───
    notifications: [],
    unreadNotifCount: 0,
    unreadDMCount: 0,

    // ─── メタ演出 ───
    notificationPermission: false,
    phantomInputActive: false,
    tabGlitchActive: false,
    scrollHijackActive: false,

    // ─── 進行フラグ ───
    gamePhase: 'title',   // 'title' | 'main' | 'ending'
    endingId: null,
    konamiActivated: false,
  };
}

/** 現在のゲームステート */
TTY.STATE = createInitialState();
TTY.CURSED_STAMPS = CURSED_STAMPS;
TTY.FORBIDDEN_WORDS = FORBIDDEN_WORDS;

/**
 * ステートをlocalStorageに保存する
 */
function saveState() {
  TTY.STATE.lastSaveTimestamp = Date.now();
  TTY.STATE.lastActiveTimestamp = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TTY.STATE));
  } catch (e) {
    console.warn('[TTY] save failed:', e);
  }
}

/**
 * localStorageからステートを読み込む
 * @returns {boolean} セーブデータが存在した場合 true
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    // 初期値を基底として、保存済みデータをマージ
    TTY.STATE = Object.assign(createInitialState(), saved);
    return true;
  } catch (e) {
    console.warn('[TTY] load failed:', e);
    return false;
  }
}

/**
 * ゲームステートを初期化する（デバッグ・リセット用）
 */
function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  TTY.STATE = createInitialState();
}

// ============================================================
// 感染トリガーチェック
// ============================================================

/**
 * 特定住民への連続いいね（3回以上）チェック
 * @param {string} residentId
 * @returns {boolean}
 */
function checkLikeTrigger(residentId) {
  const count = TTY.STATE.residentLikeCounts[residentId] || 0;
  return count >= 3;
}

/**
 * 呪いスタンプ使用チェック（2回以上）
 * @returns {boolean}
 */
function checkStampTrigger() {
  let total = 0;
  for (const stamp of CURSED_STAMPS) {
    total += TTY.STATE.stampsUsed[stamp] || 0;
  }
  return total >= 2;
}

/**
 * 投稿テキストの禁止ワードチェック
 * @param {string} text
 * @returns {string|null} 検出されたワード、なければ null
 */
function checkWordTrigger(text) {
  for (const word of FORBIDDEN_WORDS) {
    if (text.includes(word)) return word;
  }
  return null;
}

/**
 * 深夜DM送信チェック（22時〜4時）
 * @returns {boolean}
 */
function checkLateDMTrigger() {
  const h = new Date().getHours();
  return (h >= 22 || h < 4);
}

/**
 * 同一投稿への3連続いいねチェック
 * @param {string} postId
 * @returns {boolean}
 */
function checkConsecutiveLikesTrigger(postId) {
  const S = TTY.STATE;
  const now = Date.now();
  if (S.consecutiveLikePostId === postId && (now - S.consecutiveLikeTimestamp) < 2000) {
    S.consecutiveLikeCount++;
  } else {
    S.consecutiveLikePostId = postId;
    S.consecutiveLikeCount = 1;
  }
  S.consecutiveLikeTimestamp = now;
  return S.consecutiveLikeCount >= 3;
}

/**
 * 全感染トリガーをまとめてチェックする
 * @param {object} opts - { residentId?, postId?, text?, isDMSend? }
 * @returns {{ triggered: boolean, type: string|null }}
 */
function checkInfectionTriggers(opts = {}) {
  if (TTY.STATE.infected) return { triggered: false, type: null };

  if (opts.residentId && checkLikeTrigger(opts.residentId)) {
    return { triggered: true, type: 'like_triple' };
  }
  if (checkStampTrigger()) {
    return { triggered: true, type: 'cursed_stamp' };
  }
  if (opts.text) {
    const word = checkWordTrigger(opts.text);
    if (word) return { triggered: true, type: 'forbidden_word' };
  }
  if (opts.isDMSend && checkLateDMTrigger()) {
    return { triggered: true, type: 'late_night_dm' };
  }
  if (opts.postId && checkConsecutiveLikesTrigger(opts.postId)) {
    return { triggered: true, type: 'consecutive_like' };
  }
  return { triggered: false, type: null };
}

// ============================================================
// 感染進行
// ============================================================

/**
 * 感染フェーズを次へ進める
 * @param {number} phase - 目標フェーズ (1〜3)
 */
function advanceInfectionPhase(phase) {
  if (phase <= TTY.STATE.infectionPhase) return;
  TTY.STATE.infectionPhase = phase;

  const phaseInfection = { 1: 25, 2: 60, 3: 90 };
  TTY.STATE.infectionLevel = phaseInfection[phase] || TTY.STATE.infectionLevel;

  // 残り日数更新
  if (phase === 1) TTY.STATE.gameDaysUntilDeath = 9;
  if (phase === 2) TTY.STATE.gameDaysUntilDeath = Math.min(TTY.STATE.gameDaysUntilDeath, 5);
  if (phase === 3) TTY.STATE.gameDaysUntilDeath = Math.min(TTY.STATE.gameDaysUntilDeath, 2);

  saveState();
  document.dispatchEvent(new CustomEvent('tty:phaseChanged', { detail: { phase } }));
}

/**
 * ゲームデイを進める
 */
function advanceGameDay() {
  TTY.STATE.gameDay++;
  if (TTY.STATE.infected && TTY.STATE.gameDaysUntilDeath > 0) {
    TTY.STATE.gameDaysUntilDeath--;
  }
  saveState();
  document.dispatchEvent(new CustomEvent('tty:dayChanged', { detail: { day: TTY.STATE.gameDay, daysLeft: TTY.STATE.gameDaysUntilDeath } }));
}

/**
 * 残り日数を返す
 * @returns {number}
 */
function calculateDaysLeft() {
  return TTY.STATE.gameDaysUntilDeath;
}

/**
 * 死期（カウントダウンゼロ）に達したか判定
 * @returns {boolean}
 */
function isDeadlineReached() {
  return TTY.STATE.infected && TTY.STATE.gameDaysUntilDeath <= 0;
}

// ============================================================
// エンディング条件チェック
// ============================================================

/** Ending A: 解呪ルート */
function checkEndingA() {
  const S = TTY.STATE;
  return S.discoveredClues.length >= 7 &&
    S.followedResidents.includes('yamada_rou') &&
    S.signatureFound;
}
/** Ending B: 感染拡大ルート */
function checkEndingB() { return TTY.STATE.infectedCount >= 9; }
/** Ending C: 受け入れルート（カウントダウンゼロ）*/
function checkEndingC() { return isDeadlineReached(); }
/** Ending D: 外部拡散ルート */
function checkEndingD() { return TTY.STATE.sharedToExternal === true; }
/** Ending E: 真エンディング */
function checkEndingE() {
  return TTY.STATE.discoveredClues.length >= 10 && TTY.STATE.revealedTruth;
}
/** Ending F: 放棄エンド (72時間未起動) */
function checkEndingF() {
  const S = TTY.STATE;
  if (!S.infected) return false;
  const elapsed = Date.now() - (S.lastActiveTimestamp || S.lastSaveTimestamp);
  return elapsed > 1000 * 60 * 60 * 72;
}

/**
 * 全エンディング条件をチェックし、解禁されたIDを返す
 * @returns {string|null} エンディングID ('A'〜'F') または null
 */
function checkEndingConditions() {
  if (checkEndingF()) return 'F';
  if (checkEndingE()) return 'E';
  if (checkEndingD()) return 'D';
  if (checkEndingB()) return 'B';
  if (checkEndingC()) return 'C';
  if (checkEndingA()) return 'A';
  return null;
}

/**
 * 手がかりを追加する
 * @param {string} clueId
 * @returns {boolean} 新規発見の場合 true
 */
function addClue(clueId) {
  if (TTY.STATE.discoveredClues.includes(clueId)) return false;
  TTY.STATE.discoveredClues.push(clueId);

  // 全断片（10件）揃ったら真相フラグ立て
  if (TTY.STATE.discoveredClues.length >= 10) {
    TTY.STATE.revealedTruth = true;
  }
  saveState();
  return true;
}

// ─── グローバル公開 ───
TTY.saveState = saveState;
TTY.loadState = loadState;
TTY.resetState = resetState;
TTY.checkInfectionTriggers = checkInfectionTriggers;
TTY.advanceInfectionPhase = advanceInfectionPhase;
TTY.advanceGameDay = advanceGameDay;
TTY.calculateDaysLeft = calculateDaysLeft;
TTY.isDeadlineReached = isDeadlineReached;
TTY.checkEndingConditions = checkEndingConditions;
TTY.addClue = addClue;

console.log('%c......', 'color:#1a0a1a;font-size:48px');
console.log('%cあなたは、ここを見ているのですか。', 'color:#8a2a2a;font-size:14px');
console.log('%cTTYの内部構造を解析しようとしても、無駄です。', 'color:#5a1a1a;font-size:12px');
console.log('%c......', 'color:#1a0a1a;font-size:48px');
setTimeout(() => {
  console.log('%c九十九太助は、ここに眠っています。', 'color:#3a0a3a;font-size:11px;font-style:italic');
}, 10000);
