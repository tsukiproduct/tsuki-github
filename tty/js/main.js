/**
 * main.js — エントリーポイント・ゲーム初期化
 *
 * 全モジュールを初期化し、イベントハンドラを設定する。
 * スクリーン管理・ゲームループも担当。
 */

window.TTY = window.TTY || {};

// ============================================================
// ゲーム初期化
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // URLパラメータチェック（デバッグモード）
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1') {
    document.getElementById('debug-panel')?.classList.remove('hidden');
    _setupDebugMode();
  }

  // セーブデータ読み込み
  const hasSave = TTY.loadState();

  if (hasSave && TTY.STATE.gamePhase === 'main') {
    // セーブデータから復元
    _restoreGame();
  } else if (hasSave && TTY.STATE.gamePhase === 'ending') {
    // エンディング状態の復元
    TTY.renderEnding(TTY.STATE.endingId);
  } else {
    // 新規ゲーム
    _showTitleScreen();
  }

  // 全体イベントリスナー設定
  _setupGlobalEvents();
  _setupMobileEvents();
  _setupDrawer();
  _setupDMPanel();
  _setupModals();
});

// ============================================================
// タイトル画面
// ============================================================

function _showTitleScreen() {
  _setScreen('screen-title');
  const registerBtn = document.getElementById('btn-register');
  if (registerBtn) {
    registerBtn.addEventListener('click', _onRegister);
  }

  // Enter キーでも登録
  ['input-name','input-handle','input-bio'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') _onRegister();
    });
  });
}

function _onRegister() {
  // ?.value のみ optional chain — .trim() は確実にstringに対して呼ぶ
  const nameEl   = document.getElementById('input-name');
  const handleEl = document.getElementById('input-handle');
  const bioEl    = document.getElementById('input-bio');

  const name   = nameEl   ? (nameEl.value   || '').trim() : '';
  const handle = handleEl ? (handleEl.value || '').trim() : '';
  const bio    = bioEl    ? (bioEl.value    || '').trim() : '';

  if (!name || !handle) {
    const btn = document.getElementById('btn-register');
    if (btn) {
      btn.classList.add('modal-shake');
      setTimeout(() => btn.classList.remove('modal-shake'), 400);
    }
    alert('お名前とハンドルネームを入力してください');
    return;
  }

  // ハンドルのサニタイズ：スペース除去のみ、空になっても handleをそのまま使う
  const sanitizedHandle = handle.replace(/\s+/g, '_').slice(0, 20) || 'player';

  // プレイヤー情報保存
  const S = TTY.STATE;
  S.playerName       = name.slice(0, 20);
  S.playerHandle     = sanitizedHandle;
  S.playerBio        = bio.slice(0, 100);
  S.playerAvatarChar = _getAvatarChar(name);
  S.gamePhase        = 'main';
  S.gameStartTimestamp  = Date.now();
  S.lastSaveTimestamp   = Date.now();
  S.lastActiveTimestamp = Date.now();
  S.gameDay = 1;

  try { TTY.saveState(); } catch(e) { console.warn('[TTY] save error', e); }

  _startMainGame(true); // 初回登録
}

/** 名前の最初の文字をアバターに使う */
function _getAvatarChar(name) {
  const cleaned = name.replace(/\s/g, '');
  return cleaned.charAt(0) || '?';
}

// ============================================================
// メインゲーム開始
// ============================================================

function _startMainGame(isNewGame = false) {
  _setScreen('screen-main');

  // UIを初期化（各レンダー関数を個別にtry-catchして、1つが失敗しても続行）
  try { TTY.updateProfileUI(); }     catch(e) { console.error('[TTY] updateProfileUI:', e); }
  try { TTY.renderTimeline(); }      catch(e) { console.error('[TTY] renderTimeline:', e); }
  try { TTY.renderSuggestedResidents(); } catch(e) { console.error('[TTY] renderSuggestedResidents:', e); }
  try { TTY.renderTrending(); }      catch(e) { console.error('[TTY] renderTrending:', e); }
  try { TTY.renderDrawerFollowing(); } catch(e) { console.error('[TTY] renderDrawerFollowing:', e); }
  try { TTY.updateHeaderDay(); }     catch(e) { console.error('[TTY] updateHeaderDay:', e); }

  // ウェルカム通知（初回登録時のみ）
  if (isNewGame) {
    setTimeout(() => {
      TTY.showToast('石方市へようこそ！', 'TTYを楽しんでください😊', '恵', 'normal');
      TTY.addNotification('🏠', `${TTY.STATE.playerName}さん、石方市民ネットワークへようこそ！`);
    }, 2000);

    // 佐藤恵からの最初のDM通知（5秒後）
    setTimeout(() => {
      TTY.STATE.unreadDMCount++;
      TTY.updateDMBadge(TTY.STATE.unreadDMCount);
      TTY.showToast('佐藤 恵', '石方市へようこそ！何かあれば連絡くださいね😊', '恵', 'normal');
    }, 5000);
  }

  // 感染済み状態の復元
  if (TTY.STATE.infected) {
    _restoreInfectedState();
  }

  // メタ演出開始
  TTY.TabHorror.start();

  // ゲームデイループ（30秒ごとに処理）
  setInterval(() => {
    TTY.tickGameDay();
    _periodicCheck();
  }, 30000);
}

/** セーブデータからゲームを復元 */
function _restoreGame() {
  _startMainGame();
}

/** 感染済み状態を復元 */
function _restoreInfectedState() {
  const phase = TTY.STATE.infectionPhase;

  // フェーズクラス適用
  document.body.classList.add('phase-' + phase);

  // UIを感染状態に更新
  TTY.animateInfectionBar(TTY.STATE.infectionLevel);
  TTY.updateHeaderDay();
  TTY.updateMobileInfectionBar(phase);
  TTY.renderTrending();

  if (phase >= 1) {
    TTY.TabHorror.startLoop();
    TTY.STATE.phantomInputActive = true;
    TTY.PhantomInput.start();
  }
  if (phase >= 2) {
    TTY.showCountdownBadge(TTY.STATE.gameDaysUntilDeath);
  }
  if (phase >= 3) {
    TTY.ScrollHijack.start();
    TTY.CursorFlicker.start();
  }
}

// ============================================================
// 定期チェック（30秒ごと）
// ============================================================

function _periodicCheck() {
  const S = TTY.STATE;
  S.lastActiveTimestamp = Date.now();

  // エンディング条件チェック
  const endId = TTY.checkEndingConditions();
  if (endId) {
    document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: endId } }));
    return;
  }

  // カウントダウン更新
  if (S.infected) {
    TTY.showCountdownBadge(S.gameDaysUntilDeath);
    TTY.updateMobileInfectionBar(S.infectionPhase);
  }

  TTY.saveState();
}

// ============================================================
// イベントハンドラ設定
// ============================================================

function _setupGlobalEvents() {
  // 投稿フォーム
  const postInput = document.getElementById('post-input');
  const charCount = document.getElementById('char-count');
  const submitBtn = document.getElementById('btn-post-submit');

  if (postInput) {
    postInput.addEventListener('input', () => {
      const len = postInput.value.length;
      if (charCount) charCount.textContent = `${len}/140`;
    });
    postInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) _submitPost();
    });
  }
  if (submitBtn) submitBtn.addEventListener('click', _submitPost);

  // スタンプボタン（PC）
  document.querySelectorAll('#stamp-row .stamp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stamp = btn.dataset.stamp;
      const input = document.getElementById('post-input');
      if (input) input.value += stamp;
      TTY.InfectionMonitor.onStampAction(stamp);
    });
  });

  // タイムラインのクリックイベント（委譲）
  const container = document.getElementById('posts-container');
  if (container) {
    container.addEventListener('click', e => {
      const likeBtn = e.target.closest('[data-action="like"]');
      if (likeBtn) {
        const postId = likeBtn.dataset.postId;
        const residentId = likeBtn.dataset.residentId;
        TTY.handleLike(postId, residentId);
        _checkPostClue(postId);
        return;
      }

      const shareBtn = e.target.closest('[data-action="share"]');
      if (shareBtn) {
        _handleShare(shareBtn.dataset.postId);
        return;
      }

      const avatar = e.target.closest('.post-avatar[data-resident-id]');
      const authorName = e.target.closest('.post-author-name[data-resident-id]');
      const residentEl = avatar || authorName;
      if (residentEl && residentEl.dataset.residentId) {
        TTY.openResidentProfile(residentEl.dataset.residentId);
        return;
      }
    });
  }

  // 提案住民のフォローボタン（委譲）
  const suggestedContainer = document.getElementById('suggested-residents');
  if (suggestedContainer) {
    suggestedContainer.addEventListener('click', e => {
      const btn = e.target.closest('.btn-follow-sm');
      if (btn) {
        const residentId = btn.dataset.residentId;
        const nowFollowing = TTY.handleFollow(residentId);
        btn.textContent = nowFollowing ? 'フォロー中' : 'フォロー';
        btn.classList.toggle('following', nowFollowing);
        if (nowFollowing) btn.classList.add('just-followed');
        setTimeout(() => btn.classList.remove('just-followed'), 300);
      }
    });
  }

  // サイドナビ
  document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      _navigateTo(screen);
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ナビ: DM
  document.getElementById('nav-dm')?.addEventListener('click', () => TTY.openDM());

  // エンディングボタン
  document.getElementById('btn-replay')?.addEventListener('click', () => {
    TTY.resetState();
    location.reload();
  });
  document.getElementById('btn-share-ending')?.addEventListener('click', () => {
    _shareToExternal();
  });
}

/** 投稿を送信する */
function _submitPost() {
  const input = document.getElementById('post-input') || document.getElementById('post-input-mobile');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  // 禁止ワードチェック（感染前）
  TTY.InfectionMonitor.onPostSubmit(text);

  // 投稿をタイムラインに追加
  const post = {
    id: 'player_' + Date.now(),
    authorId: '__player__',
    day: TTY.STATE.gameDay,
    time: _getTimeOfDay(),
    content: text,
    likes: 0, comments: 0, tags: [],
    phase: 0, isCursed: false,
  };
  TTY.insertPostTop(post);
  TTY.STATE.postCount++;
  TTY.updateStats();
  TTY.saveState();

  input.value = '';
  const charCount = document.getElementById('char-count') || document.getElementById('char-count-mobile');
  if (charCount) charCount.textContent = '0/140';

  // モバイルモーダルを閉じる
  TTY.closeModal('modal-post');
}

function _getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 6) return 'night';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

/** シェア処理 */
function _handleShare(postId) {
  TTY.showToast('シェアしますか？', 'このリンクを外部SNSにシェアする', '↗', 'normal');
  // シェアボタンが押されたらEnding D の条件フラグ
  if (TTY.STATE.infected) {
    TTY.STATE.sharedToExternal = true;
    TTY.saveState();
    // Ending D チェック
    setTimeout(() => {
      const endId = TTY.checkEndingConditions();
      if (endId === 'D') {
        document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: 'D' } }));
      }
    }, 2000);
  }
}

/** エンディングシェア */
function _shareToExternal() {
  const endingId = TTY.STATE.endingId;
  const ending = TTY.ENDINGS[endingId];
  const text = ending ? `「${ending.title}」を迎えました — 呪いのSNS TTY` : '呪いのSNS TTYをプレイしました';
  TTY.showToast('シェア', text, '📡', 'normal');
  TTY.STATE.sharedToExternal = true;
  TTY.saveState();
}

/** 投稿関連の手がかりチェック */
function _checkPostClue(postId) {
  const post = TTY.POSTS.find(p => p.id === postId);
  if (!post || !post.clueId) return;
  if (!TTY.STATE.likedPosts.includes(postId)) return;
  TTY.showClueModal(post.clueId);
}

/** ナビゲーション */
function _navigateTo(screen) {
  if (screen === 'notifications') {
    document.getElementById('notifications-panel')?.classList.remove('hidden');
    TTY.STATE.unreadNotifCount = 0;
    TTY.updateNotifBadge();
    TTY.saveState();
  } else if (screen === 'dm') {
    TTY.openDM();
  } else if (screen === 'feed') {
    document.getElementById('notifications-panel')?.classList.add('hidden');
    TTY.closeDM();
  }
}

// ============================================================
// モバイルイベント
// ============================================================

function _setupMobileEvents() {
  // ボトムナビ
  document.querySelectorAll('.bottom-nav-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      _navigateTo(screen);
      document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 投稿ボタン（モバイル）
  document.getElementById('bnav-post-btn')?.addEventListener('click', () => {
    TTY.openModal('modal-post');
    // スタンプ行を複製
    const mobileStampRow = document.getElementById('stamp-row-mobile');
    if (mobileStampRow && mobileStampRow.children.length === 0) {
      document.querySelectorAll('#stamp-row .stamp-btn').forEach(btn => {
        const clone = btn.cloneNode(true);
        clone.addEventListener('click', () => {
          const stamp = clone.dataset.stamp;
          const input = document.getElementById('post-input-mobile');
          if (input) input.value += stamp;
          TTY.InfectionMonitor.onStampAction(stamp);
        });
        mobileStampRow.appendChild(clone);
      });
    }
  });

  // メニューボタン（モバイル）
  document.getElementById('bnav-menu-btn')?.addEventListener('click', _openDrawer);

  // モバイル投稿送信
  document.getElementById('btn-post-submit-mobile')?.addEventListener('click', _submitPost);

  // モバイル投稿モーダルの文字数カウント
  const mobileInput = document.getElementById('post-input-mobile');
  const mobileCount = document.getElementById('char-count-mobile');
  if (mobileInput && mobileCount) {
    mobileInput.addEventListener('input', () => {
      mobileCount.textContent = `${mobileInput.value.length}/140`;
    });
  }

  // モバイル投稿モーダルを閉じる
  document.getElementById('btn-post-modal-close')?.addEventListener('click', () => {
    TTY.closeModal('modal-post');
  });

  // iOS Safari キーボード対応
  if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', () => {
      const modal = document.getElementById('modal-post');
      if (modal && !modal.classList.contains('hidden')) {
        const vh = window.visualViewport.height;
        modal.querySelector('.modal-content').style.height = vh + 'px';
      }
    });
  }
}

// ============================================================
// ドロワー
// ============================================================

function _setupDrawer() {
  document.getElementById('btn-drawer-open')?.addEventListener('click', _openDrawer);
  document.getElementById('btn-drawer-close')?.addEventListener('click', _closeDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', _closeDrawer);

  // スワイプで閉じる
  const drawer = document.getElementById('drawer');
  if (drawer) {
    let startX = 0;
    drawer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    drawer.addEventListener('touchend', e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (dx > 80) _closeDrawer(); // 80px以上左スワイプで閉じる
    }, { passive: true });
  }

  // ドロワー内ナビ
  document.querySelectorAll('.drawer-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      if (screen) { _navigateTo(screen); _closeDrawer(); }
    });
  });
}

function _openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function _closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================================
// DMパネル
// ============================================================

function _setupDMPanel() {
  // 戻るボタン
  document.getElementById('btn-dm-back')?.addEventListener('click', TTY.closeDM);

  // DM送信
  const dmInput = document.getElementById('dm-input');
  const dmSend = document.getElementById('btn-dm-send');
  if (dmInput) {
    dmInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') _onDMSend();
    });
  }
  if (dmSend) dmSend.addEventListener('click', _onDMSend);
}

function _onDMSend() {
  const input = document.getElementById('dm-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  TTY.sendDM(text);
}

// ============================================================
// モーダル設定
// ============================================================

function _setupModals() {
  // 感染警告を閉じる
  document.getElementById('btn-modal-infection-close')?.addEventListener('click', () => {
    TTY.closeModal('modal-infection');
  });

  // プロフィールモーダルを閉じる
  document.getElementById('btn-profile-modal-close')?.addEventListener('click', () => {
    TTY.closeModal('modal-profile');
  });

  // 手がかりモーダルを閉じる
  document.getElementById('btn-clue-close')?.addEventListener('click', () => {
    TTY.closeModal('modal-clue');
    // 全手がかり揃ったか確認
    if (TTY.STATE.discoveredClues.length >= 10) {
      TTY.showToast('真相解明', '全ての断片が揃いました。九十九の遺言を読みましたか？', '🕯', 'warning');
    }
  });

  // モーダル外クリックで閉じる
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // 通知パネルを閉じる
  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      document.getElementById(`${panel}-panel`)?.classList.add('hidden');
    });
  });
}

// ============================================================
// スクリーン管理
// ============================================================

function _setScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

// ============================================================
// デバッグモード
// ============================================================

function _setupDebugMode() {
  window.DEBUG = {
    setPhase(phase) {
      TTY.forcePhase(phase);
    },
    triggerEnding(id) {
      document.dispatchEvent(new CustomEvent('tty:endingTriggered', { detail: { endingId: id } }));
    },
    logState() {
      console.log('[TTY STATE]', JSON.parse(JSON.stringify(TTY.STATE)));
    },
    resetGame() {
      TTY.resetState();
      location.reload();
    },
    addAllClues() {
      Object.keys(TTY.CLUES).forEach(id => TTY.addClue(id));
      TTY.showToast('Debug', '全手がかり追加済み', '🔧', 'normal');
    },
  };
  console.log('[TTY] Debug mode enabled. window.DEBUG is available.');
}
