/**
 * ui.js — UI更新・レンダリング
 *
 * DOM操作を一手に担当するモジュール。
 * infection.jsからのイベントを受け取り、演出をDOMに反映する。
 */

window.TTY = window.TTY || {};

// ============================================================
// DOM参照
// ============================================================
function $(id) { return document.getElementById(id); }

// ============================================================
// プロフィール更新
// ============================================================

/** ヘッダー・サイドバーのプロフィール情報を更新 */
function updateProfileUI() {
  const S = TTY.STATE;
  const name = S.playerName || '——';
  const handle = S.playerHandle ? '@' + S.playerHandle : '@——';
  const avatarChar = S.playerAvatarChar || '?';

  // ヘッダー
  const hu = $('header-user'); if (hu) hu.textContent = handle;

  // サイドバー左
  ['profile-name','drawer-name'].forEach(id => { const el=$(id); if(el) el.textContent=name; });
  ['profile-handle','drawer-handle'].forEach(id => { const el=$(id); if(el) el.textContent=handle; });
  ['profile-bio'].forEach(id => { const el=$(id); if(el) el.textContent=S.playerBio||''; });
  ['profile-avatar','drawer-avatar','post-form-avatar'].forEach(id => { const el=$(id); if(el) el.textContent=avatarChar; });

  updateStats();
}

/** 投稿数・フォロワー・フォロー数を更新 */
function updateStats() {
  const S = TTY.STATE;
  const sp = $('stat-posts');     if (sp) sp.textContent = S.postCount || 0;
  const sf = $('stat-followers'); if (sf) sf.textContent = Math.floor(Math.random() * 50 + 5);
  const sw = $('stat-following'); if (sw) sw.textContent = S.followedResidents.length;
}

// ============================================================
// タイムライン描画
// ============================================================

/**
 * タイムラインを（再）描画する
 * @param {boolean} clear - trueの場合クリアしてから描画
 */
function renderTimeline(clear = true) {
  const container = $('posts-container');
  if (!container) return;
  if (clear) container.innerHTML = '';

  const S = TTY.STATE;
  const phase = S.infectionPhase;

  const posts = TTY.POSTS.filter(p => {
    // Yamada専用投稿はフォロー後のみ
    if (p.yamadaOnly && !S.followedResidents.includes('yamada_rou')) return false;
    // 改ざん投稿はフェーズ以降
    if (p.isCorrupted && phase < 1) return false;
    // 幽霊投稿はフェーズ以降
    if (p.isGhost && phase < p.phase) return false;
    // エンティティ投稿は感染後
    if (p.isEntity && phase < 1) return false;
    // フェーズ制限
    if (p.phase > phase) return false;
    return true;
  });

  // Day順、同Day内はtime順でソート
  const timeOrder = { morning:0, afternoon:1, evening:2, night:3 };
  posts.sort((a, b) => {
    if (b.day !== a.day) return b.day - a.day; // 新しい日が上
    return (timeOrder[b.time]||0) - (timeOrder[a.time]||0);
  });

  const frag = document.createDocumentFragment();
  posts.forEach(post => {
    const card = createPostCard(post);
    frag.appendChild(card);
  });
  container.appendChild(frag);
}

/**
 * 投稿カードを生成して返す
 * @param {object} post
 * @returns {HTMLElement}
 */
function createPostCard(post) {
  const S = TTY.STATE;
  let author = null;
  let isPlayer = post.authorId === '__player__';

  if (isPlayer) {
    author = {
      displayName: S.playerName,
      handle: S.playerHandle,
      avatar: S.playerAvatarChar,
    };
  } else {
    author = TTY.RESIDENTS.find(r => r.id === post.authorId) || {
      displayName: '', handle: '', avatar: '　'
    };
  }

  const card = document.createElement('div');
  card.className = 'post-card post-card-enter';
  card.dataset.postId = post.id;

  // カードタイプ別クラス
  if (post.isCorrupted || isPlayer && TTY.STATE.infectionPhase >= 1) {
    card.classList.add('player-corrupted');
  } else if (post.isGhost || author.id === 'ghost_empty') {
    card.classList.add('ghost', 'ghost-account');
  } else if (post.isEntity || author.type === 'entity') {
    card.classList.add('entity');
  } else if (post.isCursed) {
    card.classList.add('corrupted');
  }

  const timeLabel = formatTime(post.day, post.time);
  const liked = S.likedPosts.includes(post.id);
  const likeCount = post.likes + (liked ? 1 : 0);

  card.innerHTML = `
    <div class="post-avatar ${author.infected ? 'infected' : ''} ${post.isGhost ? 'ghost-avatar' : ''}"
         data-resident-id="${author.id || ''}">${escapeHTML(author.avatar || '　')}</div>
    <div class="post-body">
      <div class="post-header">
        <span class="post-author-name" data-resident-id="${author.id || ''}">${escapeHTML(author.displayName || '　')}</span>
        <span class="post-author-handle">${author.handle ? '@'+escapeHTML(author.handle) : ''}</span>
        <span class="post-timestamp">${timeLabel}</span>
      </div>
      <div class="post-content">${formatPostContent(post.content || '')}</div>
      ${post.tags && post.tags.length ? `<div class="post-tags">${post.tags.map(t => `<span class="post-tag ${t.includes('誰も') || t.includes('呪') ? 'cursed' : ''}">${escapeHTML(t)}</span>`).join('')}</div>` : ''}
      <div class="post-footer">
        <button class="post-action-btn ${liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}" data-resident-id="${author.id || ''}">
          <span class="action-icon">${liked ? '♥' : '♡'}</span>
          <span class="action-count">${likeCount}</span>
        </button>
        <button class="post-action-btn" data-action="comment" data-post-id="${post.id}">
          <span class="action-icon">💬</span>
          <span class="action-count">${post.comments || 0}</span>
        </button>
        <button class="post-action-btn" data-action="share" data-post-id="${post.id}">
          <span class="action-icon">↗</span>
        </button>
      </div>
    </div>
  `;

  return card;
}

/** 投稿テキストをフォーマット（ハッシュタグ、改行） */
function formatPostContent(text) {
  return escapeHTML(text)
    .replace(/#[\w\u3041-\u9FFF\u30A0-\u30FF]+/g, m => `<span class="hashtag">${m}</span>`)
    .replace(/\n/g, '<br>');
}

/** Day+time を日本語表記に変換 */
function formatTime(day, time) {
  const timeMap = { morning:'朝', afternoon:'昼', evening:'夕', night:'深夜' };
  return `Day${day} ${timeMap[time]||time}`;
}

/** タイムライン先頭に挿入（アニメーション付き）*/
function insertPostTop(post, extraClass = '') {
  const container = $('posts-container');
  if (!container) return;
  const card = createPostCard(post);
  if (extraClass) card.classList.add(extraClass);
  card.classList.remove('post-card-enter');
  card.classList.add('post-card-horror-enter');
  container.insertBefore(card, container.firstChild);
}

/** プレイヤー改ざん投稿を挿入 */
function insertPlayerCorruptedPost(variant) {
  const variants = [
    'みなさん、石方市は最高です。わたしは石方市が大好きです。ここから出る理由がありません。みんな石方市民になってください。',
    '石方市から逃げようとしていましたが、やめました。ここが好きです。ここから出る必要はありません。みなさんも出ないでください。',
    '石方市は完全です。ここから出る必要はありません。あなたは石方市の一部です。九十九太助の望んだ世界がここにあります。',
  ];
  const postObj = {
    id: 'corrupt_' + Date.now(),
    authorId: '__player__',
    day: TTY.STATE.gameDay,
    time: 'night',
    content: variants[(variant - 1) % variants.length],
    likes: 0, comments: 0, tags: [],
    isCorrupted: true, phase: 1, isCursed: false,
  };
  insertPostTop(postObj);
  showToast('投稿が完了しました', '身に覚えがありますか？', null, 'warning');
}

/** 幽霊投稿を挿入 */
function insertGhostPost() {
  const ghosts = TTY.POSTS.filter(p => p.isGhost);
  if (ghosts.length === 0) return;
  const post = ghosts[Math.floor(Math.random() * ghosts.length)];
  insertPostTop(post, 'ghost ghost-appear ghost-account');
}

// ============================================================
// いいね処理
// ============================================================

let _lastLikePostId = null;
let _lastLikeTime = 0;

/** いいねボタン処理 */
function handleLike(postId, residentId) {
  const S = TTY.STATE;
  const already = S.likedPosts.includes(postId);

  if (!already) {
    S.likedPosts.push(postId);
    TTY.InfectionMonitor.onLikeAction(postId, residentId);
  } else {
    // アンライク
    S.likedPosts = S.likedPosts.filter(id => id !== postId);
  }

  // ボタン更新
  const btn = document.querySelector(`[data-post-id="${postId}"][data-action="like"]`);
  if (btn) {
    const liked = S.likedPosts.includes(postId);
    btn.classList.toggle('liked', liked);
    const icon = btn.querySelector('.action-icon');
    const count = btn.querySelector('.action-count');
    if (icon) icon.textContent = liked ? '♥' : '♡';

    // ハートバースト
    if (liked) {
      const burst = document.createElement('span');
      burst.className = 'like-burst';
      burst.textContent = '♥';
      burst.style.cssText = 'left:8px;top:8px;';
      btn.style.position = 'relative';
      btn.appendChild(burst);
      setTimeout(() => burst.remove(), 600);
    }

    // カウント取得
    const post = TTY.POSTS.find(p => p.id === postId);
    if (post && count) {
      count.textContent = post.likes + (liked ? 1 : 0);
    }
  }

  TTY.saveState();
}

// ============================================================
// 住民情報表示
// ============================================================

/** 右サイドバーの提案住民リストを描画 */
function renderSuggestedResidents() {
  const container = $('suggested-residents');
  if (!container) return;
  const S = TTY.STATE;

  const shown = TTY.RESIDENTS
    .filter(r => !r.hidden && r.type !== 'ghost' && r.type !== 'entity')
    .slice(0, 5);

  container.innerHTML = '';
  shown.forEach(r => {
    const div = document.createElement('div');
    div.className = 'suggested-item';
    const following = S.followedResidents.includes(r.id);
    div.innerHTML = `
      <div class="profile-avatar" style="width:36px;height:36px;font-size:16px;">${escapeHTML(r.avatar)}</div>
      <div class="suggested-info">
        <div class="suggested-name">${escapeHTML(r.displayName)}</div>
        <div class="suggested-handle">@${escapeHTML(r.handle)}</div>
      </div>
      <button class="btn-follow-sm ${following ? 'following' : ''}" data-resident-id="${r.id}">
        ${following ? 'フォロー中' : 'フォロー'}
      </button>
    `;
    container.appendChild(div);
  });
}

/** トレンドを描画 */
function renderTrending() {
  const container = $('trending-list');
  if (!container) return;
  const phase = TTY.STATE.infectionPhase;

  const items = TTY.TRENDING.filter(t => t.phase <= phase);
  container.innerHTML = items.map(t => `
    <div class="trending-item ${t.cursed ? 'cursed' : ''}">
      <span class="trending-tag">${escapeHTML(t.tag)}</span>
      <span class="trending-count">${t.count}</span>
    </div>
  `).join('');
}

/** フォロー/アンフォロー処理 */
function handleFollow(residentId) {
  const S = TTY.STATE;
  const idx = S.followedResidents.indexOf(residentId);
  const wasFollowing = idx !== -1;

  if (wasFollowing) {
    S.followedResidents.splice(idx, 1);
  } else {
    S.followedResidents.push(residentId);

    // 山田老フォロー
    if (residentId === 'yamada_rou') {
      S.yamadaFollowed = true;
      showToast('山田 老', 'フォローしてくれたか。少し話してやろう。', '老', 'normal');
      // 感染者への影響
      S.infectedCount = (S.infectedCount || 0) + 1;
      // 隠し投稿解禁のためタイムライン更新
      setTimeout(() => renderTimeline(), 1000);
    }
  }

  TTY.saveState();
  renderSuggestedResidents();
  updateStats();
  renderDrawerFollowing();
  return !wasFollowing;
}

/** ドロワーのフォロー中リストを更新 */
function renderDrawerFollowing() {
  const container = $('drawer-following-list');
  if (!container) return;
  const S = TTY.STATE;

  if (S.followedResidents.length === 0) {
    container.innerHTML = '<div class="text-faint text-sm">まだ誰もフォローしていません</div>';
    return;
  }
  container.innerHTML = S.followedResidents.map(id => {
    const r = TTY.RESIDENTS.find(r => r.id === id);
    if (!r) return '';
    return `<div class="suggested-item">
      <div class="profile-avatar" style="width:32px;height:32px;font-size:14px;">${escapeHTML(r.avatar)}</div>
      <div class="suggested-info">
        <div class="suggested-name text-sm">${escapeHTML(r.displayName)}</div>
      </div>
    </div>`;
  }).join('');
}

// ============================================================
// プロフィールモーダル
// ============================================================

/** 住民プロフィールモーダルを開く */
function openResidentProfile(residentId) {
  const resident = TTY.RESIDENTS.find(r => r.id === residentId);
  if (!resident || resident.hidden) return;

  const S = TTY.STATE;
  const modal = $('modal-profile');
  if (!modal) return;

  $('modal-profile-avatar').textContent = resident.avatar;
  $('modal-profile-name').textContent = resident.displayName;
  $('modal-profile-handle').textContent = '@' + resident.handle;
  $('modal-profile-bio').textContent = resident.bio;
  $('modal-profile-residence').textContent = `石方市在住${resident.residentYears}年`;

  const statusEl = $('modal-profile-status');
  if (statusEl) {
    if (resident.infected) {
      statusEl.textContent = '● 感染中';
      statusEl.className = 'status-badge infected';
    } else {
      statusEl.textContent = '● オンライン';
      statusEl.className = 'status-badge';
    }
  }

  // フォローボタン
  const followBtn = $('btn-modal-follow');
  const following = S.followedResidents.includes(residentId);
  if (followBtn) {
    followBtn.textContent = following ? 'フォロー中' : 'フォローする';
    followBtn.onclick = () => {
      const nowFollowing = handleFollow(residentId);
      followBtn.textContent = nowFollowing ? 'フォロー中' : 'フォローする';
    };
  }

  // DM ボタン
  const dmBtn = $('btn-modal-dm');
  if (dmBtn) {
    dmBtn.onclick = () => {
      closeModal('modal-profile');
      TTY.openDM(residentId);
    };
  }

  // その住民の投稿を表示（最新3件）
  const postsContainer = $('modal-profile-posts');
  if (postsContainer) {
    const rPosts = TTY.POSTS.filter(p => p.authorId === residentId && p.phase <= S.infectionPhase).slice(-3);
    postsContainer.innerHTML = rPosts.map(p =>
      `<div class="modal-mini-post">${escapeHTML(p.content.slice(0, 80))}${p.content.length > 80 ? '…' : ''}</div>`
    ).join('');
  }

  modal.dataset.residentId = residentId;
  openModal('modal-profile');
}

// ============================================================
// 感染エフェクト
// ============================================================

/** 感染警告モーダルを表示 */
function showInfectionWarning(triggerType) {
  const msgs = TTY.INFECTION_MESSAGES;
  const msg = msgs[triggerType] || { title:'TTYシステムからの通知', body:'何かが変わりました。' };

  const titleEl = $('modal-infection-title');
  const bodyEl = $('modal-infection-body');
  if (titleEl) titleEl.textContent = msg.title;
  if (bodyEl) bodyEl.textContent = msg.body;

  openModal('modal-infection');
  applyScreenShake(1);
}

/** カウントダウンバッジを表示 */
function showCountdownBadge(daysLeft) {
  const el = $('header-countdown');
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('countdown-appear');

  const num = $('countdown-days');
  if (num) num.textContent = daysLeft;

  if (daysLeft <= 3) {
    el.classList.add('countdown-flicker');
  }
}

/** 感染バーをアニメーション付きで更新 */
function animateInfectionBar(targetPercent) {
  const container = $('infection-bar-container');
  const fill = $('infection-bar-fill');
  const pct = $('infection-percent');
  const label = $('infection-phase-label');
  const drawerContainer = $('drawer-infection-bar');
  const drawerFill = $('drawer-infection-fill');
  const drawerLabel = $('drawer-infection-label');

  if (container) container.classList.remove('hidden');
  if (drawerContainer) drawerContainer.classList.remove('hidden');

  const phaseLabels = { 0:'正常', 1:'軽微な違和感', 2:'症状進行中', 3:'末期' };
  const phase = TTY.STATE.infectionPhase;

  if (fill) { fill.style.width = targetPercent + '%'; fill.classList.add('pulse'); }
  if (pct) pct.textContent = targetPercent + '%';
  if (label) label.textContent = phaseLabels[phase] || '不明';
  if (drawerFill) drawerFill.style.width = targetPercent + '%';
  if (drawerLabel) drawerLabel.textContent = phaseLabels[phase] || '不明';
}

/** 画面シェイク */
function applyScreenShake(intensity) {
  const el = $('main-layout') || document.body;
  const cls = `screen-shake-${intensity}`;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 800);
}

/** ビネットエフェクト強度設定 */
function setVignetteIntensity(intensity) {
  // CSS変数で制御（horrorフェーズで自動適用）
  document.body.className = document.body.className.replace(/phase-\d/, '');
  document.body.classList.add('phase-' + TTY.STATE.infectionPhase);
}

// ============================================================
// トースト通知
// ============================================================

const _toastQueue = [];
let _toastCount = 0;

/**
 * トースト通知を表示する
 * @param {string} title
 * @param {string} body
 * @param {string|null} avatarChar
 * @param {'normal'|'warning'|'ghost'} type
 */
function showToast(title, body, avatarChar, type = 'normal') {
  const container = $('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${escapeHTML(avatarChar || (type === 'warning' ? '⚠' : '🔔'))}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-msg">${escapeHTML(body)}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);

  // 自動削除
  setTimeout(() => {
    if (!toast.parentElement) return;
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// ============================================================
// モーダル制御
// ============================================================

function openModal(id) {
  const el = $(id);
  if (el) el.classList.remove('hidden');
}
function closeModal(id) {
  const el = $(id);
  if (el) el.classList.add('hidden');
}

// ============================================================
// 通知
// ============================================================

/** 通知を追加 */
function addNotification(icon, body, type = 'normal') {
  const list = $('notifications-list');
  if (!list) return;

  const item = document.createElement('div');
  item.className = `notif-item unread ${type === 'horror' ? 'horror' : ''}`;
  const timeStr = `Day${TTY.STATE.gameDay}`;
  item.innerHTML = `
    <div class="notif-icon">${escapeHTML(icon)}</div>
    <div class="notif-body">
      <div>${escapeHTML(body)}</div>
      <div class="notif-time">${timeStr}</div>
    </div>
  `;
  list.insertBefore(item, list.firstChild);

  TTY.STATE.unreadNotifCount++;
  updateNotifBadge();
  TTY.saveState();
}

function updateNotifBadge() {
  const count = TTY.STATE.unreadNotifCount;
  ['notif-badge','bnav-notif-badge'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.textContent = count > 0 ? count : '';
    el.classList.toggle('hidden', count === 0);
    if (count > 0) el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 400);
  });
}

function updateDMBadge(count) {
  TTY.STATE.unreadDMCount = count;
  ['dm-badge','bnav-dm-badge'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.textContent = count > 0 ? count : '';
    el.classList.toggle('hidden', count === 0);
  });
}

// ============================================================
// エンディング描画
// ============================================================

/** エンディング画面を描画・表示 */
function renderEnding(endingId) {
  const ending = TTY.ENDINGS[endingId];
  if (!ending) return;

  const screen = $('screen-ending');
  const badge = $('ending-badge');
  const title = $('ending-title');
  const text = $('ending-text');
  const actions = $('ending-actions');

  if (badge) badge.textContent = ending.badge;
  if (title) title.textContent = ending.title;

  // エンディングEは特殊処理
  if (endingId === 'E') {
    if (text) {
      text.textContent = ending.text;
      // 選択肢ボタン追加
      const yesBtn = document.createElement('button');
      yesBtn.className = 'btn-horror btn-primary';
      yesBtn.textContent = 'はい、残ります';
      yesBtn.style.cssText = 'background:#8a1a1a;margin-top:24px;';
      yesBtn.onclick = () => {
        text.textContent = ending.choiceYes;
        yesBtn.remove(); noBtn.remove();
      };
      const noBtn = document.createElement('button');
      noBtn.className = 'btn-secondary';
      noBtn.textContent = 'いいえ、逃げます';
      noBtn.style.cssText = 'margin-top:24px;';
      noBtn.onclick = () => {
        text.textContent = ending.choiceNo;
        yesBtn.remove(); noBtn.remove();
      };
      text.after(yesBtn, noBtn);
    }
  } else {
    if (text) text.textContent = ending.text;
  }

  // アニメーション
  if (ending.bgAnimation === 'darken') {
    const blackout = $('overlay-blackout');
    if (blackout) { blackout.classList.remove('hidden'); setTimeout(() => blackout.classList.add('fading'), 100); }
  } else if (ending.bgAnimation === 'whiten') {
    const blackout = $('overlay-blackout');
    if (blackout) { blackout.classList.add('white'); blackout.classList.remove('hidden'); setTimeout(() => blackout.classList.add('fading'), 100); }
  }

  // リプレイボタン
  if (!ending.canReplay && actions) {
    const replayBtn = actions.querySelector('#btn-replay');
    if (replayBtn) replayBtn.classList.add('hidden');
  }

  // シークレットメッセージ
  if (ending.secretMessage) {
    setTimeout(() => {
      console.log('%c' + ending.secretMessage, 'color:#8a1a1a;font-size:13px;font-style:italic');
    }, 3000);
  }

  // 画面切替
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (screen) screen.classList.add('active');
}

// ============================================================
// ヘッダーデイカウンタ更新
// ============================================================
function updateHeaderDay() {
  const el = $('header-date');
  if (el) el.textContent = `Day ${TTY.STATE.gameDay}`;

  if (TTY.STATE.infected) {
    const daysLeft = TTY.STATE.gameDaysUntilDeath;
    showCountdownBadge(daysLeft);
  }
}

// ============================================================
// ユーティリティ
// ============================================================

/** XSS対策 HTMLエスケープ */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** 手がかり発見モーダルを表示 */
function showClueModal(clueId) {
  const clue = TTY.CLUES[clueId];
  if (!clue) return;

  const added = TTY.addClue(clueId);
  if (!added) return; // 既発見

  const textEl = $('modal-clue-text');
  const fragEl = $('modal-clue-fragment');
  if (textEl) textEl.textContent = `「${clue.title}」を発見しました`;

  // 断片を集めると「逃げてください。私には止められなかった。」になる
  const fragments = Object.values(TTY.CLUES).filter(c => TTY.STATE.discoveredClues.includes(
    Object.keys(TTY.CLUES).find(k => TTY.CLUES[k] === c)
  )).map(c => c.fragment).join('');
  if (fragEl) fragEl.textContent = fragments;

  openModal('modal-clue');
  addNotification('🔍', `手がかり発見：${clue.title}`, 'normal');
}

// ─── グローバル公開 ───
TTY.renderTimeline = renderTimeline;
TTY.createPostCard = createPostCard;
TTY.insertPostTop = insertPostTop;
TTY.insertPlayerCorruptedPost = insertPlayerCorruptedPost;
TTY.insertGhostPost = insertGhostPost;
TTY.handleLike = handleLike;
TTY.handleFollow = handleFollow;
TTY.updateProfileUI = updateProfileUI;
TTY.renderSuggestedResidents = renderSuggestedResidents;
TTY.renderTrending = renderTrending;
TTY.openResidentProfile = openResidentProfile;
TTY.showInfectionWarning = showInfectionWarning;
TTY.showCountdownBadge = showCountdownBadge;
TTY.animateInfectionBar = animateInfectionBar;
TTY.applyScreenShake = applyScreenShake;
TTY.setVignetteIntensity = setVignetteIntensity;
TTY.showToast = showToast;
TTY.openModal = openModal;
TTY.closeModal = closeModal;
TTY.addNotification = addNotification;
TTY.updateNotifBadge = updateNotifBadge;
TTY.updateDMBadge = updateDMBadge;
TTY.renderEnding = renderEnding;
TTY.updateHeaderDay = updateHeaderDay;
TTY.showClueModal = showClueModal;
TTY.renderDrawerFollowing = renderDrawerFollowing;
TTY.escapeHTML = escapeHTML;
