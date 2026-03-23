// ===== GAME STATE =====
const G = {
  day: 1,
  maxDay: 7,
  following: new Set(),
  hiddenUnlocked: false,
  choiceMade: false,
};

// ===== ENDINGS =====
const ENDINGS = {
  bad: {
    title: '石方に囚われた',
    color: '#8b0000',
    tag: 'BAD END',
    text: `あなたは待ち続けた。\n\n気づけば、石方市から出ることを考えなくなっていた。\n\nある深夜、台所に立っている自分に気づく。\n何時間そこにいたのかわからない。\n\n石方市は、また一人の住民を得た。`,
  },
  semi_bad: {
    title: '旧国道にて',
    color: '#7a3000',
    tag: 'BAD END',
    text: `あなたは逃げようとした。\n\n旧国道の橋を渡ろうとした時、足が止まった。\n背後から声がした。\n\n「どこへ行くの？😊」\n\n振り返ると、佐藤恵が立っていた。\n目が、笑っていなかった。\n\n木村修のお寺に寄れば...\nあるいは結果は違ったかもしれない。`,
  },
  escape: {
    title: '脱出',
    color: '#1d9bf0',
    tag: 'ESCAPE END',
    text: `木村修の寺で守りを授かったあなたは、旧国道の橋を渡り切った。\n\n橋の向こうで、石方市の霧が晴れていくのを感じた。\n\n振り返ると、霧の中に無数の人影が見えた気がした。\n\nでも、もう戻らない。\n\n脱出成功。`,
  },
  true: {
    title: '真実の脱出',
    color: '#00b060',
    tag: 'TRUE END',
    text: `九十九太助の呪いの正体を知ったあなたは、\n木村修の守りと山田老の言葉と小川友子の記録を胸に\n石方市を後にした。\n\n橋を渡る前、山田老が手紙を渡してくれた。\n「九十九はただ、帰れなかっただけじゃ」\n\n石方市の呪いは今も続いている。\nだが、あなたは自由だ。`,
  },
};

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  initStartScreen();
});

function initStartScreen() {
  const saved = localStorage.getItem('ishikata_sns_v1');
  const btns = document.getElementById('start-btns');
  btns.innerHTML = '';

  if (saved) {
    const b1 = document.createElement('button');
    b1.className = 'start-btn';
    b1.textContent = '▶ つづきから';
    b1.onclick = continueGame;
    btns.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'start-btn secondary';
    b2.textContent = '★ はじめから';
    b2.onclick = newGame;
    btns.appendChild(b2);
  } else {
    const b = document.createElement('button');
    b.className = 'start-btn';
    b.textContent = '▶ はじめる';
    b.onclick = newGame;
    btns.appendChild(b);
  }
}

function continueGame() {
  try {
    const saved = JSON.parse(localStorage.getItem('ishikata_sns_v1'));
    G.day = saved.day || 1;
    G.following = new Set(saved.following || []);
    G.hiddenUnlocked = saved.hiddenUnlocked || false;
    G.choiceMade = saved.choiceMade || false;
  } catch (e) {
    // fallback
  }
  launchGame();
}

function newGame() {
  G.day = 1;
  G.following = new Set();
  G.hiddenUnlocked = false;
  G.choiceMade = false;
  launchGame();
}

function launchGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  renderAll();
}

// ===== SAVE =====
function saveGame() {
  localStorage.setItem('ishikata_sns_v1', JSON.stringify({
    day: G.day,
    following: [...G.following],
    hiddenUnlocked: G.hiddenUnlocked,
    choiceMade: G.choiceMade,
  }));
}

// ===== RENDER ALL =====
function renderAll() {
  updateDayPanel();
  renderFeed();
  renderSidebar();
}

// ===== DAY PANEL =====
function updateDayPanel() {
  document.getElementById('day-number').textContent = `Day ${G.day}`;
  document.getElementById('day-badge').textContent = `Day ${G.day}`;
  document.getElementById('follow-count').textContent = G.following.size;

  const btn = document.getElementById('day-next-btn');
  if (G.day >= G.maxDay || G.choiceMade) {
    btn.textContent = '───';
    btn.disabled = true;
  } else {
    btn.textContent = '次の日へ →';
    btn.disabled = false;
  }
}

// ===== NEXT DAY =====
function nextDay() {
  if (G.day >= G.maxDay || G.choiceMade) return;
  G.day++;
  saveGame();
  renderAll();

  // Scroll new posts into view
  setTimeout(() => {
    const feed = document.getElementById('post-list');
    const seps = feed.querySelectorAll('.day-separator');
    if (seps.length > 0) {
      seps[seps.length - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 80);
}

// ===== FEED RENDERING =====
function renderFeed() {
  const list = document.getElementById('post-list');
  list.innerHTML = '';

  for (let d = 1; d <= G.day; d++) {
    if (d > 1) {
      const sep = document.createElement('div');
      sep.className = 'day-separator';
      sep.textContent = `── Day ${d} ──`;
      list.appendChild(sep);
    }

    const dayPosts = getPosts(d);
    dayPosts.forEach(post => {
      const resident = getResident(post.authorId);
      if (!resident) return;
      list.appendChild(buildPostCard(post, resident, false));
    });
  }

  // Hidden posts (山田老 フォロー後)
  if (G.hiddenUnlocked && G.day >= 4) {
    const sep = document.createElement('div');
    sep.className = 'day-separator';
    sep.textContent = '── 解放された投稿 ──';
    list.appendChild(sep);

    HIDDEN_POSTS.forEach(post => {
      const resident = getResident(post.authorId);
      if (!resident) return;
      const card = buildPostCard(post, resident, true);
      card.classList.add('hidden-post');
      list.appendChild(card);
    });
  }

  // Choice banner at end of Day 7
  if (G.day >= G.maxDay && !G.choiceMade) {
    list.appendChild(buildChoiceBanner());
  }
}

function getPosts(day) {
  const base = POSTS[day] || [];
  return base;
}

function getResident(id) {
  return RESIDENTS.find(r => r.id === id) || null;
}

function buildPostCard(post, resident, isHidden) {
  const div = document.createElement('div');
  div.className = 'post-card';
  if (resident.isGhost) div.classList.add('ghost-post');
  if (resident.infected && !resident.isGhost) {
    div.dataset.infected = resident.infectionStage;
  }

  const avatarClass = `avatar-${resident.avatarStyle || 'neutral'}`;
  const name = resident.name || '？？？';
  const handle = resident.handle || '@???';

  const hiddenBadge = isHidden
    ? `<div class="hidden-badge">🔓 フォロー解放</div>`
    : '';

  div.innerHTML = `
    <div class="post-avatar ${avatarClass}" onclick="openProfile('${resident.id}')">${resident.avatarChar}</div>
    <div class="post-body">
      ${hiddenBadge}
      <div class="post-header">
        <span class="post-name" onclick="openProfile('${resident.id}')">${escapeHtml(name)}</span>
        <span class="post-handle">${escapeHtml(handle)}</span>
        <span class="post-time">· ${escapeHtml(post.time)}</span>
      </div>
      <div class="post-content">${escapeHtml(post.content)}</div>
      <div class="post-actions">
        <span class="post-action-btn">💬 ${post.likes > 0 ? Math.floor(post.likes / 10) : 0}</span>
        <span class="post-action-btn">🔁 ${post.reposts}</span>
        <span class="post-action-btn">♡ ${post.likes}</span>
      </div>
    </div>
  `;
  return div;
}

function buildChoiceBanner() {
  const div = document.createElement('div');
  div.id = 'choice-banner';
  div.className = 'visible';
  div.innerHTML = `
    <div class="choice-question">あなたはどうする？</div>
    <div class="choice-sub">
      渡辺太郎の発見、木村修の警告、幽霊アカウントの叫び。<br>
      石方市を去るか——それとも、もう少し様子を見るか。
    </div>
    <div class="choice-btns">
      <button class="choice-btn escape" onclick="makeChoice('escape')">石方市を去る</button>
      <button class="choice-btn stay" onclick="makeChoice('stay')">もう少し様子を見る</button>
    </div>
  `;
  return div;
}

// ===== SIDEBAR =====
function renderSidebar() {
  renderTrends();
  renderSuggestions();
}

function renderTrends() {
  const trends = [
    { tag: '#石方市', count: '1,204', label: 'トレンド' },
    { tag: '#石方市移住', count: '89', label: 'トレンド — 生活' },
  ];
  if (G.day >= 3) trends.push({ tag: '#深夜', count: '456', label: 'トレンド — 怪談' });
  if (G.day >= 4) trends.push({ tag: '#不思議な体験', count: '234', label: 'トレンド' });
  if (G.day >= 5) trends.push({ tag: '#体調不良', count: '178', label: 'トレンド — 健康' });
  if (G.day >= 5) trends.push({ tag: '#九十九太助', count: '7', label: 'トレンド' });
  if (G.day >= 6) trends.push({ tag: '#石方SNSの呪い', count: '31', label: 'トレンド — 怖い' });

  const el = document.getElementById('trend-list');
  el.innerHTML = '';
  trends.slice(0, 5).forEach(t => {
    const item = document.createElement('div');
    item.className = 'trend-item';
    item.innerHTML = `
      <div class="trend-label">${t.label}</div>
      <div class="trend-tag">${t.tag}</div>
      <div class="trend-count">${t.count} 件の投稿</div>
    `;
    el.appendChild(item);
  });
}

function renderSuggestions() {
  const pool = RESIDENTS.filter(r => !r.isGhost && !G.following.has(r.id));
  const suggestions = pool.slice(0, 4);

  const el = document.getElementById('suggest-list');
  el.innerHTML = '';

  suggestions.forEach(r => {
    const item = document.createElement('div');
    item.className = 'suggest-item';
    item.innerHTML = `
      <div class="post-avatar avatar-${r.avatarStyle}" style="width:38px;height:38px;font-size:15px;flex-shrink:0"
           onclick="openProfile('${r.id}')">${r.avatarChar}</div>
      <div class="suggest-info">
        <div class="suggest-name" onclick="openProfile('${r.id}')">${escapeHtml(r.name)}</div>
        <div class="suggest-handle">${escapeHtml(r.handle)}</div>
      </div>
      <button class="follow-btn" data-rid="${r.id}" onclick="quickFollow('${r.id}', this)">
        フォローする
      </button>
    `;
    el.appendChild(item);
  });

  if (suggestions.length === 0) {
    el.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:8px 0">全員フォロー中</div>';
  }
}

function updateAllFollowButtons() {
  // Update sidebar suggestion buttons
  document.querySelectorAll('.follow-btn[data-rid]').forEach(btn => {
    const id = btn.dataset.rid;
    if (G.following.has(id)) {
      btn.textContent = 'フォロー中';
      btn.className = 'follow-btn following';
    } else {
      btn.textContent = 'フォローする';
      btn.className = 'follow-btn';
    }
  });
  updateDayPanel();
}

function quickFollow(residentId, btn) {
  if (G.following.has(residentId)) {
    G.following.delete(residentId);
    btn.textContent = 'フォローする';
    btn.className = 'follow-btn';
  } else {
    G.following.add(residentId);
    btn.textContent = 'フォロー中';
    btn.className = 'follow-btn following';
    handleFollowSpecial(residentId);
  }
  updateDayPanel();
  renderSuggestions();
  saveGame();
}

function handleFollowSpecial(residentId) {
  if (residentId === 'yamada_rou' && !G.hiddenUnlocked && G.day >= 4) {
    G.hiddenUnlocked = true;
    renderFeed(); // Show hidden posts
  }
}

// ===== PROFILE MODAL =====
function openProfile(residentId) {
  const resident = getResident(residentId);
  if (!resident) return;

  const modal = document.getElementById('profile-modal');
  const isFollowing = G.following.has(residentId);

  // Banner style
  const banner = modal.querySelector('.profile-header-banner');
  if (resident.isGhost) {
    banner.className = 'profile-header-banner ghost-banner';
  } else if (resident.infected) {
    banner.className = 'profile-header-banner horror';
  } else {
    banner.className = 'profile-header-banner';
  }

  // Avatar
  const avatarEl = modal.querySelector('.profile-avatar-large');
  avatarEl.className = `profile-avatar-large avatar-${resident.avatarStyle || 'neutral'}`;
  avatarEl.textContent = resident.avatarChar;

  // Follow button
  const followBtn = document.getElementById('modal-follow-btn');
  followBtn.textContent = isFollowing ? 'フォロー中' : 'フォローする';
  followBtn.className = isFollowing ? 'following' : '';
  followBtn.onclick = () => toggleFollowFromModal(residentId, followBtn);

  // Ghost: hide follow
  followBtn.style.display = resident.isGhost ? 'none' : '';

  // Info
  modal.querySelector('.profile-name').textContent = resident.name || '？？？';
  modal.querySelector('.profile-handle').textContent = resident.handle || '@???';
  modal.querySelector('.profile-bio').textContent = resident.bio || '';

  modal.querySelector('.stat-followers').textContent =
    resident.followersCount.toLocaleString();
  modal.querySelector('.stat-following').textContent =
    resident.followingCount.toLocaleString();

  // Posts
  const postsEl = modal.querySelector('.profile-posts');
  postsEl.innerHTML = '';

  const authorPosts = [];
  for (let d = 1; d <= G.day; d++) {
    (POSTS[d] || []).forEach(p => {
      if (p.authorId === residentId) authorPosts.push({ ...p, day: d });
    });
  }

  if (authorPosts.length === 0) {
    postsEl.innerHTML = '<div class="profile-post-item profile-no-posts">投稿はありません</div>';
  } else {
    [...authorPosts].reverse().forEach(p => {
      const item = document.createElement('div');
      item.className = 'profile-post-item' + (resident.isGhost ? ' ghost-item' : '');
      item.innerHTML = `
        <div class="post-time-small">Day ${p.day} · ${p.time}</div>
        ${escapeHtml(p.content)}
      `;
      postsEl.appendChild(item);
    });
  }

  modal.classList.add('visible');
}

function closeProfile() {
  document.getElementById('profile-modal').classList.remove('visible');
}

function toggleFollowFromModal(residentId, btn) {
  if (G.following.has(residentId)) {
    G.following.delete(residentId);
    btn.textContent = 'フォローする';
    btn.className = '';
  } else {
    G.following.add(residentId);
    btn.textContent = 'フォロー中';
    btn.className = 'following';
    handleFollowSpecial(residentId);
  }
  updateAllFollowButtons();
  saveGame();
}

// ===== ENDING =====
function makeChoice(choice) {
  G.choiceMade = true;
  saveGame();

  // Remove choice banner
  const banner = document.getElementById('choice-banner');
  if (banner) banner.remove();
  updateDayPanel();

  let endingKey;
  if (choice === 'stay') {
    endingKey = 'bad';
  } else {
    const hasKimura = G.following.has('kimura_osamu');
    const hasYamada = G.following.has('yamada_rou');
    const hasOgawa  = G.following.has('ogawa_tomoko');

    if (hasKimura && hasYamada && hasOgawa) {
      endingKey = 'true';
    } else if (hasKimura) {
      endingKey = 'escape';
    } else {
      endingKey = 'semi_bad';
    }
  }

  // Short delay for dramatic effect
  setTimeout(() => showEnding(endingKey), 600);
}

function showEnding(key) {
  const e = ENDINGS[key];
  const screen = document.getElementById('ending-screen');
  screen.innerHTML = `
    <div class="ending-title" style="color:${e.color}">${e.title}</div>
    <div class="ending-text">${escapeHtml(e.text).replace(/\n/g, '<br>')}</div>
    <button class="ending-replay-btn" onclick="resetGame()">もう一度プレイする</button>
    <div class="ending-tag">${e.tag} — 石方SNS</div>
  `;
  screen.classList.add('visible');
}

function resetGame() {
  localStorage.removeItem('ishikata_sns_v1');
  location.reload();
}

// ===== UTIL =====
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
