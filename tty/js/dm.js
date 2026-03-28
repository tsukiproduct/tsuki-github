/**
 * dm.js — DMシステム
 *
 * 住民との直接メッセージシステムを実装。
 * 会話ツリー管理、感染後のホラー演出DMを含む。
 */

window.TTY = window.TTY || {};

// ============================================================
// DM システム
// ============================================================

let _currentDMPartner = null;
let _dmAutoReplyTimers = [];

/**
 * DM パネルを開く
 * @param {string} residentId - 会話相手の住民ID（省略時は住民リストを表示）
 */
function openDM(residentId) {
  const panel = document.getElementById('dm-panel');
  if (!panel) return;

  panel.classList.remove('hidden');

  if (residentId) {
    _openConversation(residentId);
  } else {
    _showResidentList();
  }
}

/** 住民リストを表示 */
function _showResidentList() {
  const list = document.getElementById('dm-resident-list');
  const items = document.getElementById('dm-resident-items');
  const header = document.getElementById('dm-header');
  if (!list || !items) return;

  list.classList.remove('hidden');
  document.getElementById('dm-messages').parentElement.style.display = 'none';

  const dmContainer = document.querySelector('.dm-input-wrap');
  if (dmContainer) dmContainer.style.display = 'none';

  // ヘッダー更新
  const nameEl = document.getElementById('dm-partner-name');
  const handleEl = document.getElementById('dm-partner-handle');
  if (nameEl) nameEl.textContent = 'ダイレクトメッセージ';
  if (handleEl) handleEl.textContent = '';

  const residents = TTY.RESIDENTS.filter(r =>
    !r.hidden || TTY.STATE.followedResidents.includes(r.id)
  ).filter(r => r.type !== 'entity');

  items.innerHTML = '';
  residents.forEach(r => {
    const item = document.createElement('div');
    item.className = 'dm-resident-item';
    const hasUnread = (TTY.STATE.dmHistories[r.id] || []).length > 0;
    item.innerHTML = `
      <div class="profile-avatar" style="width:40px;height:40px;font-size:18px;">${TTY.escapeHTML(r.avatar)}</div>
      <div>
        <div class="dm-resident-name">${TTY.escapeHTML(r.displayName)}</div>
        <div class="dm-resident-bio">${TTY.escapeHTML(r.bio.slice(0, 40))}…</div>
      </div>
      ${hasUnread ? '<span class="badge">●</span>' : ''}
    `;
    item.addEventListener('click', () => _openConversation(r.id));
    items.appendChild(item);
  });
}

/** 特定住民との会話を開く */
function _openConversation(residentId) {
  const resident = TTY.RESIDENTS.find(r => r.id === residentId);
  if (!resident) return;

  _currentDMPartner = residentId;
  TTY.STATE.dmWith = residentId;

  // リスト非表示
  const list = document.getElementById('dm-resident-list');
  if (list) list.classList.add('hidden');

  // メッセージ・入力欄表示
  const msgArea = document.getElementById('dm-messages');
  if (msgArea && msgArea.parentElement) {
    msgArea.parentElement.style.display = '';
  }
  const dmInput = document.querySelector('.dm-input-wrap');
  if (dmInput) dmInput.style.display = '';

  // ヘッダー更新
  const nameEl = document.getElementById('dm-partner-name');
  const handleEl = document.getElementById('dm-partner-handle');
  const statusEl = document.getElementById('dm-partner-status');
  if (nameEl) nameEl.textContent = resident.displayName;
  if (handleEl) handleEl.textContent = '@' + resident.handle;
  if (statusEl) {
    statusEl.textContent = resident.infected ? '感染中' : 'オンライン';
    statusEl.style.color = resident.infected ? 'var(--clr-horror-bright)' : '#4caf50';
  }

  // 会話履歴を描画
  _renderMessages(residentId);

  // 未読リセット
  TTY.STATE.unreadDMCount = Math.max(0, TTY.STATE.unreadDMCount - 1);
  TTY.updateDMBadge(TTY.STATE.unreadDMCount);
  TTY.saveState();

  // 自動返信スケジュール（初回のみ）
  _scheduleAutoReply(residentId);
}

/** 会話履歴を描画 */
function _renderMessages(residentId) {
  const container = document.getElementById('dm-messages');
  if (!container) return;
  container.innerHTML = '';

  const history = TTY.STATE.dmHistories[residentId] || [];

  // 会話履歴がない場合はイントロを表示
  if (history.length === 0) {
    const convData = TTY.DM_CONVERSATIONS[residentId];
    if (convData && convData.intro) {
      convData.intro.forEach(msg => {
        _addMessageBubble(container, msg.text, 'recv', residentId);
      });
    }
    return;
  }

  history.forEach(msg => {
    _addMessageBubble(container, msg.text, msg.role, residentId, msg.isHorror);
  });

  // スクロール最下部
  container.scrollTop = container.scrollHeight;
}

/**
 * メッセージバブルをDOMに追加
 */
function _addMessageBubble(container, text, role, residentId, isHorror = false) {
  const div = document.createElement('div');
  div.className = `dm-msg ${role} ${isHorror ? 'horror' : ''}`;

  const time = new Date().toLocaleTimeString('ja-JP', { hour:'2-digit', minute:'2-digit' });

  div.innerHTML = `
    <div class="dm-bubble">${TTY.escapeHTML(text)}</div>
    <div class="dm-time">${time}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

/**
 * メッセージを送信する
 * @param {string} text
 */
function sendDM(text) {
  if (!text.trim() || !_currentDMPartner) return;
  const residentId = _currentDMPartner;

  // プレイヤーのメッセージを追加
  const container = document.getElementById('dm-messages');
  if (container) _addMessageBubble(container, text, 'sent', residentId);

  // 履歴に保存
  if (!TTY.STATE.dmHistories[residentId]) TTY.STATE.dmHistories[residentId] = [];
  TTY.STATE.dmHistories[residentId].push({ role:'sent', text, time: Date.now() });

  // 感染トリガーチェック
  TTY.InfectionMonitor.onDMSend();

  // 入力欄クリア
  const input = document.getElementById('dm-input');
  if (input) input.value = '';

  TTY.saveState();

  // 自動返信
  setTimeout(() => _autoReply(residentId, text), 1500 + Math.random() * 2000);
}

/**
 * 自動返信ロジック
 */
function _autoReply(residentId, playerText) {
  const S = TTY.STATE;
  const phase = S.infectionPhase;
  const convData = TTY.DM_CONVERSATIONS[residentId];
  if (!convData) return;

  let replyText = null;
  let isHorror = false;

  if (residentId === 'yamada_rou') {
    if (S.followedResidents.includes('yamada_rou') && convData.after_follow) {
      const msgs = convData.after_follow;
      const sent = (S.dmHistories[residentId] || []).filter(m => m.role === 'recv').length;
      if (sent < msgs.length) replyText = msgs[sent].text;
      // 手がかり解禁チェック
      if (S.signatureFound && convData.clue_found) {
        replyText = convData.clue_found[0].text;
      }
    } else if (convData.intro) {
      replyText = '…フォローしてくれれば、話してやろう。';
    }
  } else if (residentId === 'takahashi_rei') {
    if (phase >= 2 && convData.phase2) {
      const msgs = convData.phase2;
      const sent = (S.dmHistories[residentId] || []).filter(m => m.role === 'recv' && m.isHorror).length;
      if (sent < msgs.length) { replyText = msgs[sent].text; isHorror = true; }
    } else if (phase >= 1 && convData.phase1) {
      const msgs = convData.phase1;
      const sent = (S.dmHistories[residentId] || []).filter(m => m.role === 'recv').length;
      if (sent < msgs.length) replyText = msgs[sent].text;
    } else {
      replyText = '笑 よろしくです〜！';
    }
  } else if (residentId === 'sato_megumi') {
    if (phase >= 2 && convData.phase2) {
      replyText = convData.phase2[0].text;
      isHorror = false;
    } else if (phase >= 1 && convData.post_infection) {
      const msgs = convData.post_infection;
      const sent = (S.dmHistories[residentId] || []).filter(m => m.role === 'recv').length;
      replyText = msgs[sent % msgs.length].text;
    } else if (convData.intro) {
      replyText = convData.intro[0].text;
    }
  } else {
    // その他の住民への汎用返信
    const genericReplies = [
      'ありがとうございます😊',
      'そうですね〜',
      'わかります！石方市って不思議な魅力がありますよね。',
      '最近少し体調が悪くて…でも大丈夫です。',
      'TTYのおかげで皆さんと繋がれて嬉しいです。',
    ];
    if (phase >= 2) {
      const horrorReplies = [
        '…逃げて',
        'ここから出て',
        'TTYを閉じて',
        '聞こえてますか',
        '。',
      ];
      replyText = Math.random() < 0.3
        ? horrorReplies[Math.floor(Math.random() * horrorReplies.length)]
        : genericReplies[Math.floor(Math.random() * genericReplies.length)];
      isHorror = Math.random() < 0.3;
    } else {
      replyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }
  }

  if (!replyText) return;

  const container = document.getElementById('dm-messages');
  if (container && _currentDMPartner === residentId) {
    _addMessageBubble(container, replyText, 'recv', residentId, isHorror);
  }

  // 履歴に保存
  if (!S.dmHistories[residentId]) S.dmHistories[residentId] = [];
  S.dmHistories[residentId].push({ role:'recv', text: replyText, isHorror, time: Date.now() });
  TTY.saveState();

  // サイン発見チェック（山田老の返信）
  if (residentId === 'yamada_rou' && replyText.includes('署名')) {
    TTY.STATE.signatureFound = true;
    TTY.showClueModal('clue_tsukumo_final');
  }

  // 手がかりチェック
  if (replyText.includes('九十九太助') && !S.discoveredClues.includes('clue_tsukumo')) {
    TTY.showClueModal('clue_tsukumo');
  }
}

/** 自動返信スケジュール（初訪問時） */
function _scheduleAutoReply(residentId) {
  // 重複防止
  if ((TTY.STATE.dmHistories[residentId] || []).length > 0) return;

  const t = setTimeout(() => {
    if (_currentDMPartner !== residentId) return;
    const convData = TTY.DM_CONVERSATIONS[residentId];
    if (!convData || !convData.intro) return;

    const container = document.getElementById('dm-messages');
    if (!container) return;

    // イントロメッセージを順番に表示
    convData.intro.forEach((msg, i) => {
      setTimeout(() => {
        if (!container.parentElement) return;
        _addMessageBubble(container, msg.text, 'recv', residentId);
        if (!TTY.STATE.dmHistories[residentId]) TTY.STATE.dmHistories[residentId] = [];
        TTY.STATE.dmHistories[residentId].push({ role:'recv', text:msg.text, time:Date.now() });
        TTY.saveState();
      }, i * 1500);
    });
  }, 500);
  _dmAutoReplyTimers.push(t);
}

/** DMパネルを閉じる */
function closeDM() {
  const panel = document.getElementById('dm-panel');
  if (panel) panel.classList.add('hidden');
  _currentDMPartner = null;
  TTY.STATE.dmWith = '';
  TTY.saveState();
}

// ─── グローバル公開 ───
TTY.openDM = openDM;
TTY.sendDM = sendDM;
TTY.closeDM = closeDM;
