/**
 * meta.js — メタホラー演出
 *
 * 「ゲームの外側」に侵食するメタホラー演出を全て管理。
 * タブタイトル、ブラウザ通知、ファントム入力、
 * スクロールジャック、コナミコマンドなどを実装。
 */

window.TTY = window.TTY || {};

// ============================================================
// TabHorror — タブタイトル演出
// ============================================================
class TabHorror {
  constructor() {
    this._interval = null;
    this._originalTitle = 'TTY - Talk To You';
    this._active = false;
  }

  start() {
    document.addEventListener('visibilitychange', () => this._onVisibilityChange());
    window.addEventListener('beforeunload', (e) => this._onBeforeUnload(e));
    this._active = true;
  }

  update() {
    if (!this._active) return;
    const S = TTY.STATE;
    const phase = S.infectionPhase;
    const h = new Date().getHours();
    const isNight = (h >= 22 || h < 4);

    if (phase === 0) {
      document.title = this._originalTitle;
    } else if (phase === 1) {
      document.title = isNight ? 'あなたはまだここにいる' : 'TTY | ログイン中';
    } else if (phase === 2) {
      if (Math.random() < 0.15) {
        document.title = '[読み込み中...]';
        setTimeout(() => this.update(), 3000);
      } else {
        document.title = isNight ? 'あなたはまだここにいる' : `TTY | あと${S.gameDaysUntilDeath}日`;
      }
    } else if (phase === 3) {
      const glitched = ['█████', '■■■■■', 'TTY▒▒▒', '██Y██'];
      document.title = glitched[Math.floor(Date.now() / 2000) % glitched.length];
    }
  }

  startLoop() {
    if (this._interval) return;
    this._interval = setInterval(() => this.update(), 3000);
  }

  _onVisibilityChange() {
    const S = TTY.STATE;
    if (!S.infected) return;

    if (document.hidden) {
      document.title = '…まだいるの？';
    } else {
      document.title = 'おかえり。';
      setTimeout(() => this.update(), 3000);
    }
  }

  _onBeforeUnload(e) {
    const S = TTY.STATE;
    if (!S.infected || S.infectionPhase < 2) return;
    e.preventDefault();
    e.returnValue = 'TTYはまだ開いています';
    document.title = 'TTYはまだ開いています';
    return e.returnValue;
  }

  stop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
    document.title = this._originalTitle;
  }
}

// ============================================================
// NotificationManager — ブラウザ通知
// ============================================================
class NotificationManager {
  constructor() {
    this._scheduled = [];
  }

  async requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') {
      TTY.STATE.notificationPermission = true;
      return true;
    }
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      TTY.STATE.notificationPermission = perm === 'granted';
      TTY.saveState();
      return TTY.STATE.notificationPermission;
    }
    return false;
  }

  /** 感染後の通知スケジュール */
  schedulePostInfectionNotifications() {
    if (!TTY.STATE.notificationPermission) return;

    const notifications = [
      { delay: 60000,  title:'TTY', body:'最近、眠れていますか？', tag:'tty_1' },
      { delay: 300000, title:'佐藤 恵 からのメッセージ', body:'大丈夫ですか？TTYを閉じないでください。', tag:'tty_2' },
      { delay: 900000, title:'石方市からのお知らせ', body:'新しい住民が石方市に登録されました。', tag:'tty_3' },
      { delay: 1800000,title:'——', body:'。', tag:'tty_4' },
    ];

    notifications.forEach(n => {
      const t = setTimeout(() => this._send(n.title, n.body, n.tag), n.delay);
      this._scheduled.push(t);
    });
  }

  schedulePhase2Notification(daysLeft) {
    if (!TTY.STATE.notificationPermission) return;
    setTimeout(() => {
      this._send('あと' + daysLeft + '日', '石方市は、あなたを必要としています。', 'tty_p2');
    }, 5000);
  }

  _send(title, body, tag) {
    if (Notification.permission !== 'granted') return;
    if (document.visibilityState === 'visible') {
      // タブが見えている場合はトーストで代替
      TTY.showToast(title, body, '🔔', 'warning');
      return;
    }
    new Notification(title, { body, tag, icon: '' });
  }

  clearAll() {
    this._scheduled.forEach(t => clearTimeout(t));
    this._scheduled = [];
  }
}

// ============================================================
// PhantomInput — 投稿欄ファントム入力
// ============================================================
class PhantomInput {
  constructor() {
    this._interval = null;
    this._originalPlaceholder = 'いまどうしてる？石方市のみなさんに教えよう！';
  }

  start() {
    this._interval = setInterval(() => this._tick(), 10000);
  }

  _tick() {
    if (!TTY.STATE.phantomInputActive) return;
    if (Math.random() > 0.2) return; // 20% 確率

    const inputs = document.querySelectorAll('#post-input, #post-input-mobile');
    inputs.forEach(input => {
      if (input.value.length > 0) return; // 入力中は変えない

      const texts = TTY.PHANTOM_TEXTS;
      const text = texts[Math.floor(Math.random() * texts.length)];
      input.placeholder = text;
      input.style.setProperty('--ph-color', 'rgba(180,26,26,0.6)');

      setTimeout(() => {
        input.placeholder = this._originalPlaceholder;
        input.style.removeProperty('--ph-color');
      }, 3000);
    });
  }

  stop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
  }
}

// ============================================================
// ScrollHijack — Phase3スクロールジャック
// ============================================================
class ScrollHijack {
  constructor() {
    this._interval = null;
  }

  start() {
    this._interval = setInterval(() => {
      if (!TTY.STATE.scrollHijackActive) return;
      if (Math.random() > 0.05) return; // 5% 確率
      const timeline = document.getElementById('timeline');
      if (timeline) {
        timeline.scrollTop += (Math.random() > 0.5 ? 3 : -3);
      }
    }, 10000);
  }

  stop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
  }
}

// ============================================================
// CursorFlicker — Phase3 カーソルちらつき
// ============================================================
class CursorFlicker {
  constructor() {
    this._interval = null;
  }

  start() {
    this._interval = setInterval(() => {
      if (TTY.STATE.infectionPhase < 3) return;
      if (Math.random() > 0.02) return; // 2% 確率
      document.body.style.cursor = 'none';
      setTimeout(() => { document.body.style.cursor = ''; }, 300);
    }, 500);
  }

  stop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
    document.body.style.cursor = '';
  }
}

// ============================================================
// KonamiCode — イースターエッグ
// ============================================================
class KonamiCode {
  constructor() {
    this._sequence = [];
    this._code = [
      'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
      'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
      'b','a'
    ];
    document.addEventListener('keydown', (e) => this._onKey(e));
  }

  _onKey(e) {
    this._sequence.push(e.key);
    this._sequence = this._sequence.slice(-this._code.length);

    if (this._sequence.join(',') === this._code.join(',')) {
      this._activate();
    }
  }

  _activate() {
    if (TTY.STATE.konamiActivated) return;
    TTY.STATE.konamiActivated = true;
    TTY.addClue('konami_code');
    TTY.saveState();

    console.log('%cツクモ、タスケ、タスケ、ツクモ', 'color:#7a1a8a;font-size:16px;font-family:monospace;letter-spacing:0.1em');
    console.log('%c石方市東区 地下B3F — あなたは知っている', 'color:#5a1a5a;font-size:12px');

    TTY.showToast('？？？', '「ツクモ、タスケ、タスケ、ツクモ」', '🎮', 'warning');
    TTY.addNotification('🎮', '隠しコードを発見しました', 'normal');
  }
}

// ============================================================
// MobileHorror — スマホ専用演出
// ============================================================
class MobileHorror {
  /** バイブレーション演出 */
  static vibrate(pattern) {
    if (!('vibrate' in navigator)) return;
    navigator.vibrate(pattern);
  }

  static onInfection() {
    this.vibrate([200, 100, 200]);
  }
  static onGhostPost() {
    this.vibrate([50, 50, 50, 50, 200]);
  }
  static onCountdown() {
    this.vibrate(100);
  }
}

// ============================================================
// モバイル感染バー管理
// ============================================================
function updateMobileInfectionBar(phase) {
  const bar = document.getElementById('mobile-infection-bar');
  const text = document.getElementById('mobile-infection-text');
  if (!bar || !text) return;

  if (phase < 1) { bar.classList.add('hidden'); return; }

  const messages = {
    1: 'あなたはまだここにいる',
    2: `あと ${TTY.STATE.gameDaysUntilDeath} 日`,
    3: '█████',
  };
  text.textContent = messages[phase] || '';
  bar.classList.remove('hidden');
}

// ============================================================
// イベントリスナー (infection.js からの Events を受け取る)
// ============================================================
document.addEventListener('tty:infected', (e) => {
  TTY.TabHorror.startLoop();
  TTY.NotificationManager.requestPermission().then(granted => {
    if (granted) TTY.NotificationManager.schedulePostInfectionNotifications();
  });
  MobileHorror.onInfection();
  TTY.showToast('石方市システム', '接続が確立されました。', '⚠', 'warning');
});

document.addEventListener('tty:phaseChanged', (e) => {
  const { phase } = e.detail;
  document.body.className = document.body.className.replace(/phase-\d/, '');
  document.body.classList.add('phase-' + phase);

  TTY.animateInfectionBar(TTY.STATE.infectionLevel);
  TTY.updateHeaderDay();
  updateMobileInfectionBar(phase);
  TTY.TabHorror.update();
  TTY.renderTrending();

  if (phase === 2) {
    TTY.NotificationManager.schedulePhase2Notification(TTY.STATE.gameDaysUntilDeath);
    TTY.addNotification('⌛', `感染フェーズ2：あと${TTY.STATE.gameDaysUntilDeath}日`, 'horror');
    MobileHorror.onCountdown();
  }
  if (phase === 3) {
    TTY.ScrollHijack.start();
    TTY.CursorFlicker.start();
    TTY.addNotification('💀', '末期症状：カウントダウンが始まりました', 'horror');
  }
});

document.addEventListener('tty:showInfectionWarning', (e) => {
  TTY.showInfectionWarning(e.detail.triggerType);
});

document.addEventListener('tty:insertGhostPost', () => {
  TTY.insertGhostPost();
  MobileHorror.onGhostPost();
});

document.addEventListener('tty:insertCorruptedPost', (e) => {
  TTY.insertPlayerCorruptedPost(e.detail.variant);
  TTY.addNotification('⚠', '身に覚えのない投稿が確認されました', 'horror');
});

document.addEventListener('tty:receiveDM', (e) => {
  const { from, msgSet } = e.detail;
  const resident = TTY.RESIDENTS.find(r => r.id === from);
  if (!resident) return;
  TTY.addNotification('✉', `${resident.displayName} からDMが届きました`, 'normal');
  TTY.updateDMBadge(TTY.STATE.unreadDMCount + 1);
  TTY.showToast(resident.displayName, 'メッセージが届いています', resident.avatar, 'normal');
});

document.addEventListener('tty:showCountdown', () => {
  TTY.showCountdownBadge(TTY.STATE.gameDaysUntilDeath);
  updateMobileInfectionBar(TTY.STATE.infectionPhase);
  MobileHorror.onCountdown();
});

document.addEventListener('tty:tabGlitch', () => {
  TTY.TabHorror.startLoop();
});

document.addEventListener('tty:phantomInput', (e) => {
  if (e.detail.start) TTY.PhantomInput.start();
});

document.addEventListener('tty:scrollHijack', (e) => {
  if (e.detail.start) TTY.ScrollHijack.start();
});

document.addEventListener('tty:addCursedTrend', () => {
  TTY.renderTrending();
});

document.addEventListener('tty:screenFlicker', () => {
  TTY.applyScreenShake(3);
});

document.addEventListener('tty:headerGlitch', () => {
  const logo = document.querySelector('.header-logo');
  if (logo) logo.setAttribute('data-text', 'TTY');
});

document.addEventListener('tty:endingTriggered', (e) => {
  TTY.STATE.endingId = e.detail.endingId;
  TTY.saveState();
  TTY.renderEnding(e.detail.endingId);
  TTY.TabHorror.stop();
});

document.addEventListener('tty:dayChanged', (e) => {
  TTY.updateHeaderDay();
  updateMobileInfectionBar(TTY.STATE.infectionPhase);
  if (e.detail.daysLeft <= 3 && TTY.STATE.infected) {
    MobileHorror.onCountdown();
  }
});

// ─── グローバル公開 ───
TTY.TabHorror = new TabHorror();
TTY.NotificationManager = new NotificationManager();
TTY.PhantomInput = new PhantomInput();
TTY.ScrollHijack = new ScrollHijack();
TTY.CursorFlicker = new CursorFlicker();
TTY.KonamiCode = new KonamiCode();
TTY.MobileHorror = MobileHorror;
TTY.updateMobileInfectionBar = updateMobileInfectionBar;

// 通知許可を30秒後にリクエスト（ゲーム開始後）
setTimeout(() => {
  if (TTY.STATE.gamePhase === 'main') {
    TTY.NotificationManager.requestPermission();
  }
}, 30000);
