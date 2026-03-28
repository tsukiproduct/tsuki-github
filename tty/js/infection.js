/**
 * infection.js — 感染ロジック・フェーズ管理
 *
 * 感染の発生・進行・演出をすべて管理するモジュール。
 * UIへの操作は CustomEvent 経由で ui.js に委譲する。
 */

window.TTY = window.TTY || {};

// ============================================================
// InfectionMonitor — 感染トリガー監視
// ============================================================
class InfectionMonitor {
  constructor() {
    this._timers = [];
  }

  /**
   * いいね操作時に呼ぶ
   * @param {string} postId
   * @param {string} residentId
   */
  onLikeAction(postId, residentId) {
    if (TTY.STATE.infected) return;

    // いいね数カウント
    TTY.STATE.likeCounts[postId] = (TTY.STATE.likeCounts[postId] || 0) + 1;
    TTY.STATE.residentLikeCounts[residentId] = (TTY.STATE.residentLikeCounts[residentId] || 0) + 1;

    // 連続いいねチェック
    const result1 = TTY.checkInfectionTriggers({ postId, residentId });
    if (result1.triggered) {
      this.triggerInfection(result1.type);
    }
    TTY.saveState();
  }

  /**
   * スタンプ使用時に呼ぶ
   * @param {string} stamp
   */
  onStampAction(stamp) {
    if (TTY.STATE.infected) return;
    TTY.STATE.stampsUsed[stamp] = (TTY.STATE.stampsUsed[stamp] || 0) + 1;

    const result = TTY.checkInfectionTriggers({});
    if (result.triggered) {
      this.triggerInfection(result.type);
    }
    TTY.saveState();
  }

  /**
   * 投稿送信時に呼ぶ
   * @param {string} text
   */
  onPostSubmit(text) {
    TTY.STATE.postCount++;
    if (TTY.STATE.infected) return;

    const result = TTY.checkInfectionTriggers({ text });
    if (result.triggered) {
      this.triggerInfection(result.type);
    }
    TTY.saveState();
  }

  /**
   * DM送信時に呼ぶ
   */
  onDMSend() {
    TTY.STATE.dmCount++;
    if (TTY.STATE.infected) return;

    const result = TTY.checkInfectionTriggers({ isDMSend: true });
    if (result.triggered) {
      this.triggerInfection(result.type);
    }
    if (TTY.STATE.lateNightDMSent === false) {
      const h = new Date().getHours();
      if (h >= 22 || h < 4) TTY.STATE.lateNightDMSent = true;
    }
    TTY.saveState();
  }

  /**
   * 感染を発動する
   * @param {string} triggerType
   */
  triggerInfection(triggerType) {
    if (TTY.STATE.infected) return;

    TTY.STATE.infected = true;
    TTY.STATE.infectionTrigger = triggerType;
    TTY.STATE.infectionTimestamp = Date.now();
    TTY.saveState();

    // Phase 1 へ
    TTY.advanceInfectionPhase(1);

    // 感染発動イベント
    document.dispatchEvent(new CustomEvent('tty:infected', { detail: { triggerType } }));

    // Phase1 エフェクト スケジュール
    this.schedulePhase1Effects();
  }

  // ============================================================
  // フェーズ別演出スケジューラー
  // ============================================================

  /** Phase1 演出スケジュール */
  schedulePhase1Effects() {
    this._after(0,    () => this._showInfectionWarning());
    this._after(3000, () => this._insertGhostPost());
    this._after(10000,() => this._insertCorruptedPost(1));
    this._after(20000,() => this._sendSatoDM());
    this._after(60000,() => this._startTabGlitch());
    this._after(90000,() => this._schedulePhase2());
  }

  /** Phase2 演出スケジュール */
  schedulePhase2Effects() {
    TTY.advanceInfectionPhase(2);
    this._after(0,    () => this._showCountdown());
    this._after(0,    () => this._startVignette(2));
    this._after(5000, () => this._startHeaderGlitch());
    this._after(30000,() => this._startPhantomInput());
    this._after(40000,() => this._addCursedTrend());
    this._after(120000,()=> this._schedulePhase3());
  }

  /** Phase3 演出スケジュール */
  schedulePhase3Effects() {
    TTY.advanceInfectionPhase(3);
    this._after(0,    () => this._startScreenFlicker());
    this._after(0,    () => this._startScrollHijack());
    this._after(2000, () => this._insertCorruptedPost(2));
    this._startDeadlineLoop();
  }

  // ── 内部演出メソッド ──

  _showInfectionWarning() {
    document.dispatchEvent(new CustomEvent('tty:showInfectionWarning', {
      detail: { triggerType: TTY.STATE.infectionTrigger }
    }));
  }
  _insertGhostPost() {
    document.dispatchEvent(new CustomEvent('tty:insertGhostPost'));
  }
  _insertCorruptedPost(variant) {
    document.dispatchEvent(new CustomEvent('tty:insertCorruptedPost', { detail: { variant } }));
  }
  _sendSatoDM() {
    document.dispatchEvent(new CustomEvent('tty:receiveDM', {
      detail: { from:'sato_megumi', msgIndex: 0, msgSet:'post_infection' }
    }));
  }
  _startTabGlitch() {
    TTY.STATE.tabGlitchActive = true;
    document.dispatchEvent(new CustomEvent('tty:tabGlitch'));
  }
  _showCountdown() {
    document.dispatchEvent(new CustomEvent('tty:showCountdown'));
  }
  _startVignette(intensity) {
    document.dispatchEvent(new CustomEvent('tty:startVignette', { detail: { intensity } }));
  }
  _startHeaderGlitch() {
    document.dispatchEvent(new CustomEvent('tty:headerGlitch'));
  }
  _startPhantomInput() {
    TTY.STATE.phantomInputActive = true;
    document.dispatchEvent(new CustomEvent('tty:phantomInput', { detail: { start: true } }));
  }
  _addCursedTrend() {
    document.dispatchEvent(new CustomEvent('tty:addCursedTrend'));
  }
  _startScreenFlicker() {
    document.dispatchEvent(new CustomEvent('tty:screenFlicker', { detail: { intensity: 3 } }));
  }
  _startScrollHijack() {
    TTY.STATE.scrollHijackActive = true;
    document.dispatchEvent(new CustomEvent('tty:scrollHijack', { detail: { start: true } }));
  }

  /** Phase2 への遷移スケジュール */
  _schedulePhase2() {
    if (TTY.STATE.infectionPhase >= 2) return;
    this.schedulePhase2Effects();
  }

  /** Phase3 への遷移スケジュール */
  _schedulePhase3() {
    if (TTY.STATE.infectionPhase >= 3) return;
    this.schedulePhase3Effects();
  }

  /** ゲームオーバー判定ループ */
  _startDeadlineLoop() {
    const loop = setInterval(() => {
      if (TTY.isDeadlineReached()) {
        clearInterval(loop);
        this._triggerEndingC();
      }
      // エンディング条件を定期チェック
      const endId = TTY.checkEndingConditions();
      if (endId && endId !== 'C' && endId !== 'F') {
        clearInterval(loop);
        document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: endId } }));
      }
    }, 30000); // 30秒ごとチェック
    this._timers.push(loop);
  }

  /** Ending C 発動 */
  _triggerEndingC() {
    document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: 'C' } }));
  }

  /** タイムアウト ヘルパー */
  _after(ms, fn) {
    const t = setTimeout(fn, ms);
    this._timers.push(t);
  }

  /** 全タイマーをクリアする */
  clearAll() {
    this._timers.forEach(t => clearTimeout(t));
    this._timers = [];
  }
}

// ============================================================
// ゲームデイ管理
// ============================================================

/** ゲームデイを進める（プレイヤー操作ごとに呼ぶ）*/
function tickGameDay() {
  // 1回のアクションが実時間 2分に相当 = 1デイ10分想定 (5アクション)
  // 実際には「投稿」「DM」「フォロー」でデイが進む
  const now = Date.now();
  const dayMs = 1000 * 60 * 2; // 2分 = 1デイ進む閾値
  const elapsed = now - (TTY.STATE.lastSaveTimestamp || now);

  if (elapsed > dayMs) {
    TTY.advanceGameDay();
  }
}

/**
 * 強制的に指定フェーズへ移行（デバッグ用）
 * @param {number} phase
 */
function forcePhase(phase) {
  const monitor = TTY.InfectionMonitor;
  if (!TTY.STATE.infected) {
    TTY.STATE.infected = true;
    TTY.STATE.infectionTrigger = 'debug';
    TTY.STATE.infectionTimestamp = Date.now();
  }
  if (phase >= 1) monitor.schedulePhase1Effects();
  if (phase >= 2) setTimeout(() => monitor.schedulePhase2Effects(), 500);
  if (phase >= 3) setTimeout(() => monitor.schedulePhase3Effects(), 1000);
}

// ─── グローバル公開 ───
TTY.InfectionMonitor = new InfectionMonitor();
TTY.tickGameDay = tickGameDay;
TTY.forcePhase = forcePhase;

// 放棄エンディング(F)チェック（ゲーム起動時）
document.addEventListener('DOMContentLoaded', () => {
  const S = TTY.STATE;
  if (S.infected && S.lastActiveTimestamp > 0) {
    const elapsed = Date.now() - S.lastActiveTimestamp;
    if (elapsed > 1000 * 60 * 60 * 72) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: 'F' } }));
      }, 2000);
    }
  }
});
