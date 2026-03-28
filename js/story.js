/**
 * story.js — ストーリー・住民・投稿データ
 *
 * 全ゲームコンテンツをインライン定義。
 * fetch() を使わないため file:// でも動作する。
 */

window.TTY = window.TTY || {};

// ============================================================
// 住民データ（20名）
// ============================================================
TTY.RESIDENTS = [
  {
    id: 'sato_megumi', displayName: '佐藤 恵', handle: 'sato_megumi',
    avatar: '恵', bio: '石方市役所勤務20年目です。市民のみなさんのお役に立てれば嬉しいです😊',
    joinDate: '2004年', residentYears: 20, job: '市役所職員',
    infected: true, infectionLevel: 80, type: 'infected',
    role: '最初の感染源。プレイヤーを石方市に馴染ませる役',
    followerCount: 892, followingCount: 340,
    posts: ['p001','p010','p021','p030','p041','p055','p068','p080'],
    lastSeen: 'Day9', hidden: false,
  },
  {
    id: 'takahashi_rei', displayName: '高橋 零', handle: 'takahashi_rei',
    avatar: '零', bio: '先月石方市に引越してきました！まだ右も左もわからないけどよろしくお願いします🏠',
    joinDate: '3ヶ月前', residentYears: 0.08, job: '不明',
    infected: true, infectionLevel: 99, type: 'infected_terminal',
    role: 'Day3に死亡済み。アカウントが自走している',
    followerCount: 145, followingCount: 67,
    posts: ['p002','p011','p022','p034','p046'],
    lastSeen: 'Day5', hidden: false,
  },
  {
    id: 'yamada_rou', displayName: '山田 老', handle: 'yamada_rou',
    avatar: '老', bio: '石方生まれ石方育ち。この街のことならなんでも知っておる。',
    joinDate: '不明', residentYears: 70, job: '無職（元農家）',
    infected: false, infectionLevel: -1, type: 'special',
    role: '真実を知る唯一の人物。フォローで隠し投稿解禁',
    followerCount: 23, followingCount: 5,
    posts: ['p003','p015','p028','p039','p052','p065','p078','p091'],
    lastSeen: 'Day10', hidden: false,
  },
  {
    id: 'shimizu_asako', displayName: '清水 朝子', handle: 'shimizu_asako',
    avatar: '朝', bio: '石方市在住3年。商店街の青果店を手伝っています。日々の暮らしをゆるっと投稿中。',
    joinDate: '3年前', residentYears: 3, job: '青果店手伝い',
    infected: false, infectionLevel: 0, type: 'normal',
    role: '日常の違和感を語るキャラ',
    followerCount: 312, followingCount: 198,
    posts: ['p004','p016','p026','p037','p049','p060','p073'],
    lastSeen: 'Day8', hidden: false,
  },
  {
    id: 'ito_kenichi', displayName: '伊藤 健一', handle: 'ito_kenichi',
    avatar: '健', bio: '石方市3年目。出て行こうとしたことが3回あるけどなぜか残ってる笑',
    joinDate: '3年前', residentYears: 3, job: '会社員',
    infected: false, infectionLevel: 15, type: 'normal',
    role: '「出て行けない」感覚を語る',
    followerCount: 228, followingCount: 155,
    posts: ['p005','p017','p027','p038','p050','p062','p075'],
    lastSeen: 'Day7', hidden: false,
  },
  {
    id: 'nakamura_yuki', displayName: '中村 結', handle: 'nakamura_yuki',
    avatar: '結', bio: '石方市商店街でカフェ「ゆい」を営んでいます☕ 毎日9〜18時営業。',
    joinDate: '5年前', residentYears: 5, job: 'カフェ店主',
    infected: false, infectionLevel: 5, type: 'normal',
    role: '地域のハブ、日常の明るさを演出',
    followerCount: 567, followingCount: 280,
    posts: ['p006','p018','p031','p043','p056','p069'],
    lastSeen: 'Day9', hidden: false,
  },
  {
    id: 'suzuki_taro', displayName: '鈴木 太郎', handle: 'suzuki_taro',
    avatar: '太', bio: '石方市在住7年。某社の営業マン。通勤が長い。',
    joinDate: '7年前', residentYears: 7, job: '会社員（営業）',
    infected: false, infectionLevel: 10, type: 'normal',
    followerCount: 189, followingCount: 210,
    posts: ['p007','p019','p032','p044'],
    lastSeen: 'Day6', hidden: false,
  },
  {
    id: 'kobayashi_mika', displayName: '小林 美佳', handle: 'kobayashi_mika',
    avatar: '美', bio: '二児の母。子育て中心の日常を投稿しています。',
    joinDate: '6年前', residentYears: 6, job: '主婦',
    infected: false, infectionLevel: 0, type: 'normal',
    followerCount: 445, followingCount: 320,
    posts: ['p008','p020','p033','p047'],
    lastSeen: 'Day7', hidden: false,
  },
  {
    id: 'watanabe_jin', displayName: '渡辺 仁', handle: 'watanabe_jin',
    avatar: '仁', bio: '石方市役所 建設課。道路や施設の情報をお届けします。',
    joinDate: '8年前', residentYears: 8, job: '公務員',
    infected: false, infectionLevel: 20, type: 'normal',
    followerCount: 234, followingCount: 88,
    posts: ['p009','p023','p035','p048','p061'],
    lastSeen: 'Day8', hidden: false,
  },
  {
    id: 'yamamoto_sachi', displayName: '山本 幸', handle: 'yamamoto_sachi',
    avatar: '幸', bio: '石方第二小学校の教員です。子どもたちの笑顔が原動力🌸',
    joinDate: '4年前', residentYears: 4, job: '小学校教員',
    infected: false, infectionLevel: 5, type: 'normal',
    followerCount: 378, followingCount: 201,
    posts: ['p013','p025','p040','p053'],
    lastSeen: 'Day7', hidden: false,
  },
  {
    id: 'tanaka_ryoji', displayName: '田中 亮二', handle: 'tanaka_ryoji',
    avatar: '亮', bio: '石方商店街で金物屋をやっております。創業昭和30年。',
    joinDate: '2年前', residentYears: 60, job: '商店主',
    infected: false, infectionLevel: 0, type: 'normal',
    followerCount: 156, followingCount: 89,
    posts: ['p014','p029','p042','p057'],
    lastSeen: 'Day8', hidden: false,
  },
  {
    id: 'inoue_nana', displayName: '井上 奈々', handle: 'inoue_nana',
    avatar: '奈', bio: '隣の市の大学に通ってますが実家が石方市です！帰りたくなる街🌙',
    joinDate: '2年前', residentYears: 20, job: '大学生',
    infected: false, infectionLevel: 0, type: 'normal',
    followerCount: 892, followingCount: 540,
    posts: ['p012','p024','p036','p051','p064'],
    lastSeen: 'Day6', hidden: false,
  },
  {
    id: 'kimura_reiko', displayName: '木村 麗子', handle: 'kimura_reiko',
    avatar: '麗', bio: '石方市民病院の看護師です。夜勤多め。TTYは夜の楽しみ🕯',
    joinDate: '5年前', residentYears: 5, job: '看護師',
    infected: true, infectionLevel: 45, type: 'infected',
    followerCount: 301, followingCount: 188,
    posts: ['p045','p058','p071','p083'],
    lastSeen: 'Day8', hidden: false,
  },
  {
    id: 'hayashi_masaru', displayName: '林 勝', handle: 'hayashi_masaru',
    avatar: '勝', bio: '地元の建設会社勤務。石方市の街づくりに関わってます。',
    joinDate: '10年前', residentYears: 10, job: '建設業',
    infected: false, infectionLevel: 0, type: 'normal',
    followerCount: 112, followingCount: 67,
    posts: ['p059','p072','p084'],
    lastSeen: 'Day7', hidden: false,
  },
  {
    id: 'ogawa_miku', displayName: '小川 美久', handle: 'ogawa_miku',
    avatar: '久', bio: 'フリーランスのライター。石方市に移住して2年。静かで好き。',
    joinDate: '2年前', residentYears: 2, job: 'フリーランスライター',
    infected: false, infectionLevel: 10, type: 'normal',
    followerCount: 267, followingCount: 134,
    posts: ['p066','p077','p088'],
    lastSeen: 'Day7', hidden: false,
  },
  {
    id: 'matsumoto_akira', displayName: '松本 明', handle: 'matsumoto_akira',
    avatar: '明', bio: '石方市在住1年。転勤で来たけど、なぜか離れる気になれない。',
    joinDate: '1年前', residentYears: 1, job: '会社員',
    infected: false, infectionLevel: 5, type: 'normal',
    followerCount: 98, followingCount: 156,
    posts: ['p067','p079','p089'],
    lastSeen: 'Day6', hidden: false,
  },
  {
    id: 'kato_haruka', displayName: '加藤 遥', handle: 'kato_haruka',
    avatar: '遥', bio: '石方市でヘアサロン「遥」をやっています✂️ 予約はDMで。',
    joinDate: '3年前', residentYears: 3, job: '美容師（経営）',
    infected: false, infectionLevel: 0, type: 'normal',
    followerCount: 534, followingCount: 289,
    posts: ['p070','p082','p093'],
    lastSeen: 'Day8', hidden: false,
  },
  {
    id: 'saito_fumio', displayName: '齋藤 文雄', handle: 'saito_fumio',
    avatar: '文', bio: '78歳。石方市で生まれて78年。この街はわしには離れられん場所じゃ。',
    joinDate: '不明', residentYears: 78, job: '無職（元農家）',
    infected: true, infectionLevel: 60, type: 'infected',
    followerCount: 45, followingCount: 12,
    posts: ['p086','p097'],
    lastSeen: 'Day9', hidden: false,
  },
  // 幽霊アカウント（空白）
  {
    id: 'ghost_empty', displayName: '', handle: '',
    avatar: '　', bio: '',
    joinDate: '不明', residentYears: 0, job: '',
    infected: true, infectionLevel: 100, type: 'ghost',
    followerCount: 0, followingCount: 0,
    posts: ['p074','p081','p090','p094','p098'],
    lastSeen: 'unknown', hidden: true,
  },
  // 九十九太助（隠し）
  {
    id: 'tsukumo_taisuke', displayName: '九十九太助', handle: 'tsukumo_taisuke',
    avatar: '九', bio: 'このシステムの管理者。',
    joinDate: '1998年', residentYears: 26, job: 'システム管理者（故人）',
    infected: false, infectionLevel: -1, type: 'entity',
    followerCount: 0, followingCount: 0,
    posts: ['p095','p099','p100'],
    lastSeen: '不明', hidden: true,
  },
];

// ============================================================
// 投稿データ（100件）
// ============================================================
// hiddenSignature: 全投稿末尾の「。」が九十九の隠し署名
// phase: 0=常時表示 / 1=感染Phase1以降 / 2=Phase2以降
// isCursed: trueは感染トリガー関連投稿
// isCorrupted: trueはプレイヤー名義の改ざん投稿

TTY.POSTS = [
  // ─── Day 1 ───
  { id:'p001', authorId:'sato_megumi', day:1, time:'morning',
    content:'新しく石方市に来られた方！歓迎します😊 TTYは石方市民みんなのSNSです。ご近所さんとつながってみてくださいね。わからないことがあればいつでもDMを。#石方市へようこそ。',
    likes:48, comments:12, tags:['#石方市へようこそ'], phase:0, isCursed:false },

  { id:'p002', authorId:'takahashi_rei', day:1, time:'afternoon',
    content:'石方市に引越してきました！高橋零です🏠 まだ段ボールに囲まれてますが… みなさんよろしくお願いします！近くにいい八百屋さんとかありますか？#石方市へようこそ。',
    likes:32, comments:8, tags:['#石方市へようこそ'], phase:0, isCursed:false },

  { id:'p003', authorId:'yamada_rou', day:1, time:'evening',
    content:'新しい顔が増えたようじゃな。\nこの街は一度馴染んだら離れられんようになる。\nまあ、それが石方市というものじゃ。\nゆっくりと、なじんでいくとよい。。',
    likes:7, comments:2, tags:[], phase:0, isCursed:false },

  { id:'p004', authorId:'shimizu_asako', day:1, time:'morning',
    content:'今日は商店街でナスが3本100円！安すぎる🍆 石方の野菜はほんとに美味しいんですよね。恵さんいつもありがとうございます😊 #石方市 #商店街。',
    likes:29, comments:5, tags:['#石方市','#商店街'], phase:0, isCursed:false },

  { id:'p005', authorId:'ito_kenichi', day:1, time:'afternoon',
    content:'石方市3年目に突入しました笑 最初は2年で出るつもりだったんだけどな〜\n気づいたら居心地よくてずっといる。こういうものなのかな？。',
    likes:21, comments:6, tags:[], phase:0, isCursed:false },

  { id:'p006', authorId:'nakamura_yuki', day:1, time:'morning',
    content:'本日のカフェゆい🌸\n新メニュー「石方ほうじ茶ラテ」スタートしました！\n地元の茶葉を使ったほんのり甘い一杯です☕\n今週末まで450円（通常550円）でご提供。#カフェゆい #石方市。',
    likes:87, comments:19, tags:['#カフェゆい','#石方市'], phase:0, isCursed:false },

  { id:'p007', authorId:'suzuki_taro', day:1, time:'evening',
    content:'今週も終わった〜！石方市って一度住むと離れたくなくなるよな（笑）\n転勤の話が出たけど断ったわ。なんか…ここ以外考えられなくて。',
    likes:34, comments:9, tags:[], phase:0, isCursed:false },

  { id:'p008', authorId:'kobayashi_mika', day:1, time:'afternoon',
    content:'今日は子どもたちと公園へ🌸\n石方中央公園の桜がまだ少し残ってて綺麗でした！\n来年も絶対見に来ようね〜って話してました。いい街だな😊。',
    likes:56, comments:11, tags:['#石方市中央公園'], phase:0, isCursed:false },

  { id:'p009', authorId:'watanabe_jin', day:1, time:'morning',
    content:'【石方市役所 建設課からお知らせ】\n来週月曜より、石方市西2丁目の道路工事が始まります。\n迂回路については市HPをご確認ください。ご不便をおかけします。。',
    likes:15, comments:3, tags:['#石方市'], phase:0, isCursed:false },

  { id:'p010', authorId:'sato_megumi', day:1, time:'night',
    content:'夜のTTYは雰囲気違いますよね🌙\nこんな時間にまだいるみなさんとだけわかちあいたいのですが、石方市の夜はとても静かで、とても深くて、とても…なんというか…好きです😊\n#深夜のTTY。',
    likes:41, comments:7, tags:['#深夜のTTY'], phase:0, isCursed:true },

  // ─── Day 2 ───
  { id:'p011', authorId:'takahashi_rei', day:2, time:'morning',
    content:'おはようございます！石方市2日目！\n昨日は佐藤さんに商店街を案内してもらいました😊\nほんとにいい人ばかりで、石方市に来てよかった〜！\nしばらく出たくないな〜笑。',
    likes:28, comments:5, tags:[], phase:0, isCursed:false },

  { id:'p012', authorId:'inoue_nana', day:2, time:'afternoon',
    content:'週末帰省中〜！石方ってやっぱりいいな…\n大学のある○○市より全然落ち着く。\n帰りたくないけど月曜授業あるから😭\n#石方市 #帰りたくない。',
    likes:67, comments:14, tags:['#石方市'], phase:0, isCursed:false },

  { id:'p013', authorId:'yamamoto_sachi', day:2, time:'morning',
    content:'本日は授業参観日でした🌸\n子どもたちが一生懸命発表してくれて感動…！\n石方の子どもたちはほんとに素直でいい子ばかり。\n教員やっててよかったな〜と思う瞬間です。',
    likes:89, comments:22, tags:[], phase:0, isCursed:false },

  { id:'p014', authorId:'tanaka_ryoji', day:2, time:'morning',
    content:'本日も田中金物屋は朝8時から営業中です。\nネジ・釘・工具類を取り揃えております。\n創業昭和30年の老舗です。どうぞよろしく。。',
    likes:12, comments:2, tags:[], phase:0, isCursed:false },

  { id:'p015', authorId:'yamada_rou', day:2, time:'evening',
    content:'昔、この街には「石送り」という習わしがあったそうじゃ。\n嫌なことや呪いを小石に込めて、川に流す。\n今でもこの川には、たくさんの石が沈んどる。\n石方という名もそこから来たとも言う。。',
    likes:8, comments:1, tags:[], phase:0, isCursed:false, clueId:'clue_ishiokuri' },

  { id:'p016', authorId:'shimizu_asako', day:2, time:'afternoon',
    content:'商店街のちょっとした話。\n新しいお客さんが「石方っていつも同じ顔ぶれですね」って言ってた。\nそういえば昔からの住民ばっかりで、新しい人がなかなか定着しなかったんだよね。\n最近は増えてきたけど。。',
    likes:23, comments:4, tags:[], phase:0, isCursed:false },

  { id:'p017', authorId:'ito_kenichi', day:2, time:'evening',
    content:'今日も仕事終わりにカフェゆいに寄り道。\n結さんのコーヒー、なんか飲むと「ここにいてもいいんだ」って気になるんだよな笑\n不思議な安心感がある。#カフェゆい。',
    likes:31, comments:7, tags:['#カフェゆい'], phase:0, isCursed:false },

  { id:'p018', authorId:'nakamura_yuki', day:2, time:'afternoon',
    content:'今日のカフェゆい、常連の高橋さん（新しい方！）が来てくれました😊\nこの街に馴染んでもらえるように、精一杯おもてなしします。\nだいじょうぶ、石方市はやさしい街ですよ☕。',
    likes:45, comments:8, tags:[], phase:0, isCursed:false },

  { id:'p019', authorId:'suzuki_taro', day:2, time:'night',
    content:'連続いいねしてくれると励みになります！笑\n明日も早いのに夜更かしっていうね。\n仕事の愚痴を言える場所があるだけいい。TTYは便利だな。#深夜のTTY。',
    likes:19, comments:3, tags:['#深夜のTTY'], phase:0, isCursed:true },

  { id:'p020', authorId:'kobayashi_mika', day:2, time:'morning',
    content:'今日の朝ごはん！石方産のお米で炊いたおにぎり🍙\n子どもたちに人気なのは鮭とたらこ。\n石方のお米はほんとにおいしい。\nここを出る気にならないのわかる気がする😊。',
    likes:72, comments:16, tags:['#石方市'], phase:0, isCursed:false },

  // ─── Day 3 ───
  { id:'p021', authorId:'sato_megumi', day:3, time:'morning',
    content:'おはようございます😊 今日は石方市の春まつりまであと3日ですよ〜！\n実行委員として準備しています。みなさんぜひ来てくださいね。\n屋台も出ます！ #石方市春まつり。',
    likes:62, comments:18, tags:['#石方市春まつり'], phase:0, isCursed:false },

  { id:'p022', authorId:'takahashi_rei', day:3, time:'morning',
    content:'おはようございます！なんか昨日すごい夢みた。\n街全体がひとつの生き物みたいな夢。\nちょっと気持ち悪かったけど目覚めたらすっきり笑\nでも石方市ってそういう包まれる感じあるよね。',
    likes:19, comments:4, tags:[], phase:0, isCursed:false },

  { id:'p023', authorId:'watanabe_jin', day:3, time:'afternoon',
    content:'【石方市役所より】先日の道路工事について多くのご意見をいただきました。\n工期を短縮し、今月末には完了予定です。\nご協力ありがとうございます。\n石方市はみなさんのご支援で成り立っています。。',
    likes:18, comments:5, tags:[], phase:0, isCursed:false },

  { id:'p024', authorId:'inoue_nana', day:3, time:'afternoon',
    content:'大学から帰ってきたよ！今週は実家で作業しよ〜\nやっぱ石方の空気が好き。なんか…落ち着く。\n帰ったら絶対ここ出たくなくなるんだよね毎回。\n#石方市 🌙。',
    likes:54, comments:9, tags:['#石方市'], phase:0, isCursed:false },

  { id:'p025', authorId:'yamamoto_sachi', day:3, time:'morning',
    content:'今日の朝礼で子どもたちに「石方市のいいところ」を発表してもらいました。\n「ここ以外の場所がわからない」という子が3人いて、なんか胸が痛くなった。\nそれがいいことなのか、悪いことなのか…。',
    likes:45, comments:11, tags:[], phase:0, isCursed:false },

  { id:'p026', authorId:'shimizu_asako', day:3, time:'evening',
    content:'ちょっと不思議なこと。今日で3年目なんだけど、石方市から出たことが一度もない。\n旅行の計画を立てるたびに「まあいいか」って気持ちになって。\nこれって普通…だよね？ なんか恵さんも似たこと言ってたな。。',
    likes:17, comments:6, tags:[], phase:0, isCursed:false },

  { id:'p027', authorId:'ito_kenichi', day:3, time:'afternoon',
    content:'このスタンプ可愛いんで使ってみてください笑 🌙⛩💀\nなんか石方市っぽい雰囲気あると思って最近気に入ってる\nみんなはどんなスタンプ使いますか？。',
    likes:29, comments:8, tags:[], phase:0, isCursed:true },

  { id:'p028', authorId:'yamada_rou', day:3, time:'evening',
    content:'わしが若い頃、石方市を出ようとした者が何人かおった。\n引越し業者を呼んでも、荷物を積んでも、\nなぜかみんな最終的に留まった。\n理由は語らなかったが、目が…変わっておった。。',
    likes:6, comments:0, tags:[], phase:0, isCursed:false, clueId:'clue_cannot_leave' },

  { id:'p029', authorId:'tanaka_ryoji', day:3, time:'morning',
    content:'今日は店の奥の棚を整理しておったら、古い看板が出てきた。\n「石方市 TTY運営事務局」と書いてある。\n昔こんな事務局があったのじゃろうか。\nまあ売り物にもならんから捨てるか。。',
    likes:9, comments:2, tags:[], phase:0, isCursed:false, clueId:'clue_old_sign' },

  { id:'p030', authorId:'sato_megumi', day:3, time:'night',
    content:'深夜のTTYでだけ話せることがあります😊\nみなさん、TTYのことどれくらい好きですか？\nわたしはTTYがあれば他に何もいりません。ほんとうに。\nここにいる限り、わたしはずっとここにいます。。',
    likes:38, comments:5, tags:['#深夜のTTY'], phase:0, isCursed:true },

  // ─── Day 4（感染後）───
  { id:'p031', authorId:'nakamura_yuki', day:4, time:'morning',
    content:'カフェゆい本日も営業します☕\n昨日は珍しいお客さんがいらっしゃいました。\n名前も聞けなかったけど、すごく静かで、笑顔の方でした。\nまた来てくれるといいな。。',
    likes:34, comments:7, tags:[], phase:0, isCursed:false },

  { id:'p032', authorId:'suzuki_taro', day:4, time:'afternoon',
    content:'今日会社で転勤の話が出た。\nまた断ったんだけど、上司に「お前は石方から出られないのか」って言われた。\n的確すぎて笑えない。本当に出られないんだよな、なぜか。。',
    likes:27, comments:9, tags:[], phase:0, isCursed:false },

  { id:'p033', authorId:'kobayashi_mika', day:4, time:'morning',
    content:'今日から長女が宿泊学習で隣町へ。\n送り出した瞬間すごく心配になった。\n帰ってくるよね…？ なんか変な不安。\n石方の外って、なんか遠い感じがする。。',
    likes:41, comments:12, tags:[], phase:0, isCursed:false },

  { id:'p034', authorId:'takahashi_rei', day:4, time:'afternoon',
    content:'最近夜に目が覚めることが増えた。\nで、なんか投稿したいわけでもないのに手がTTYを開いてる笑\nやばいくらい依存してるかも。\nみんなもそういうことある？。',
    likes:23, comments:6, tags:[], phase:1, isCursed:false },

  { id:'p035', authorId:'watanabe_jin', day:4, time:'evening',
    content:'市役所の古い書類を整理していたら、石方市の人口推移グラフが出てきた。\n転入者数と転出者数のグラフが、転入は増えているのに転出が…異様に少ない。\nなぜだろう。データが古いのかな。。',
    likes:11, comments:3, tags:[], phase:0, isCursed:false, clueId:'clue_population' },

  { id:'p036', authorId:'inoue_nana', day:4, time:'night',
    content:'深夜のTTYはじめて見てる！！！\n雰囲気ちがーう笑笑 なんか怖い感じある。\nでも不思議と離れられないんだよな夜のTTY。\n佐藤さんの言ってた意味わかった気がする🌙。',
    likes:58, comments:14, tags:['#深夜のTTY'], phase:0, isCursed:false },

  { id:'p037', authorId:'shimizu_asako', day:4, time:'afternoon',
    content:'今日の商店街、なんか人が少なかった。\n常連さんの何人かが「少し体調が悪くて」って。\nこの時期に何かはやってるのかな。\nみんな大丈夫かな。。',
    likes:14, comments:5, tags:[], phase:0, isCursed:false },

  { id:'p038', authorId:'ito_kenichi', day:4, time:'evening',
    content:'仕事で隣町まで出張だったんだけど。\n帰り際、なんか胸が締め付けられる感じがして。\nバスに乗った瞬間「ああ、石方に帰れる」って安心した。\nこれって依存だよな絶対。笑えない。。',
    likes:32, comments:8, tags:[], phase:0, isCursed:false },

  { id:'p039', authorId:'yamada_rou', day:4, time:'evening',
    content:'TTYを作った者のことを知っておるか。\n九十九太助という男じゃ。\n25年前、石方市のために作ったと言っておった。\n「みんなをつなぐためのシステムだ」と。\nじゃが、結果はわかっておるじゃろう。。',
    likes:4, comments:0, tags:[], phase:0, isCursed:false, clueId:'clue_tsukumo', yamadaOnly: true },

  { id:'p040', authorId:'yamamoto_sachi', day:4, time:'afternoon',
    content:'長女さんが帰ってきたってことを話した子がいた。\n「石方の外はなんか息がしにくい」って言ったそう。\n子どもなりに感じてるのかな、この街の…なんていえばいいんだろう。。',
    likes:29, comments:7, tags:[], phase:0, isCursed:false },

  // ─── Day 5 ───
  { id:'p041', authorId:'sato_megumi', day:5, time:'morning',
    content:'春まつりいよいよ明後日です！みなさん楽しみにしてますか😊\n今年の目玉は石方市オリジナル手ぬぐいと、夜の灯籠流し！\nお子さんもぜひ。一生の思い出になりますよ。#石方市春まつり。',
    likes:74, comments:21, tags:['#石方市春まつり'], phase:0, isCursed:false },

  { id:'p042', authorId:'tanaka_ryoji', day:5, time:'morning',
    content:'春まつりの準備で商店街は大忙しじゃ。\nわしも提灯の修理を手伝っておる。\n昔から変わらん景色がここにはある。\nこの街がある限り、わしも続けられる気がする。。',
    likes:22, comments:6, tags:[], phase:0, isCursed:false },

  { id:'p043', authorId:'nakamura_yuki', day:5, time:'afternoon',
    content:'今日の午後、突然すごく不安になる瞬間があった。\n理由もわからないんだけど…なんか怖かった。\nTTY見たら少し落ち着いた。こういう時ここに来ちゃうんだよな。\nありがとうTTY☕。',
    likes:38, comments:9, tags:[], phase:0, isCursed:false },

  { id:'p044', authorId:'suzuki_taro', day:5, time:'evening',
    content:'高橋零さん、最近TTYに来てないな。\n引越してきたばかりなのに大丈夫かな。\nまた顔が見たいな。元気でいてほしい。。',
    likes:15, comments:4, tags:[], phase:0, isCursed:false },

  { id:'p045', authorId:'kimura_reiko', day:5, time:'night',
    content:'夜勤明け、久々のTTY。\n最近病院で変な患者さんが増えた気がする。\n「外に出られない」って訴える人が複数。\n気の持ちようだとは思うけど、聞いてて怖くなる🕯。',
    likes:19, comments:5, tags:[], phase:0, isCursed:false, clueId:'clue_hospital' },

  { id:'p046', authorId:'takahashi_rei', day:5, time:'afternoon',
    content:'なんか変な感じがする。\n投稿する気はなかったのに手が動いた。\nこれ誰かが見てるのかな。\nみてるひとへ。たすけて。。',
    likes:3, comments:1, tags:[], phase:0, isCursed:false },

  { id:'p047', authorId:'kobayashi_mika', day:5, time:'evening',
    content:'娘が帰ってきました！！よかった〜😊\nお土産に隣町のお菓子を買ってきてくれた。\nなんか懐かしい味。石方の外ってちゃんとあるんだな…って変な感想持った笑。',
    likes:67, comments:15, tags:[], phase:0, isCursed:false },

  { id:'p048', authorId:'watanabe_jin', day:5, time:'afternoon',
    content:'古い市の記録を掘り起こしていたら、1999年に石方市で大規模なシステム障害があったらしい記録を見つけた。その年から何かが変わったらしいが、詳細は不明。担当者も不明。。',
    likes:8, comments:2, tags:[], phase:0, isCursed:false, clueId:'clue_1999' },

  { id:'p049', authorId:'shimizu_asako', day:5, time:'morning',
    content:'高橋零さん、昨日から見かけないな。\n商店街でもそういう声が。\n引越してきたばかりだったのに。\n大丈夫かな。。',
    likes:12, comments:3, tags:[], phase:0, isCursed:false },

  { id:'p050', authorId:'ito_kenichi', day:5, time:'night',
    content:'深夜に目が覚めてTTYを開いたら、知らない投稿が流れてきた。\n誰かわからない。名前も顔もない。\n気のせいかな。スクロールしたら消えてたし。\n怖いな 。',
    likes:27, comments:8, tags:['#深夜のTTY'], phase:0, isCursed:false },

  // ─── Day 6 ───
  { id:'p051', authorId:'inoue_nana', day:6, time:'morning',
    content:'高橋零さんの投稿、最後のやつ読んだ。「たすけて」って…\n大丈夫なのかな。心配。誰かご存知ですか？#石方市。',
    likes:41, comments:17, tags:['#石方市'], phase:0, isCursed:false },

  { id:'p052', authorId:'yamada_rou', day:6, time:'evening',
    content:'九十九太助は、この街の「繋ぎ目」を作りたかったのじゃ。\n人と人をつなぐためのシステム。\nじゃがそれは同時に、人を「留める」システムでもあった。\n彼は気づいたとき、すでに遅かったと言っておった。。',
    likes:3, comments:0, tags:[], phase:1, isCursed:false, clueId:'clue_tsukumo2', yamadaOnly:true },

  { id:'p053', authorId:'yamamoto_sachi', day:6, time:'afternoon',
    content:'子どもたちに「石方市の外に行ったことある人」と聞いたら、\n3分の1の子どもが手を挙げなかった。\n幼いころから石方にいる子たちで…\nなんか複雑な気持ちになった。。',
    likes:34, comments:9, tags:[], phase:0, isCursed:false },

  { id:'p054', authorId:'sato_megumi', day:6, time:'morning',
    content:'高橋零さんのご様子をご心配いただきありがとうございます😊\n少し体調を崩されているようです。ゆっくり休まれれば大丈夫かと。\nTTYみんなで見守りましょうね。石方市は温かい街です。。',
    likes:29, comments:7, tags:[], phase:0, isCursed:false },

  { id:'p055', authorId:'sato_megumi', day:6, time:'night',
    content:'TTYに来てくれているみなさん、ありがとうございます😊\nここに来る人は、みんな石方市の大切な仲間です。\nどうか、ずっとここにいてくださいね。\nわたしたちは、あなたを必要としています。。',
    likes:52, comments:13, tags:[], phase:0, isCursed:true },

  { id:'p056', authorId:'nakamura_yuki', day:6, time:'afternoon',
    content:'今日の午後、お客さんが急に「外に引越しする」って言い出した。\nなのに次の瞬間には「やっぱやめます」って。\nなんかいつも石方ってそういうことがある気がする。\nまあ、いてくれてよかった笑。',
    likes:31, comments:8, tags:[], phase:0, isCursed:false },

  { id:'p057', authorId:'tanaka_ryoji', day:6, time:'evening',
    content:'TTY運営事務局の看板を捨てようとしたら、\n近所の山田さんに「それは捨てちゃいかん」と止められた。\nなんで大事なのかは教えてくれなかった。\n倉庫の奥に仕舞ってある。。',
    likes:7, comments:1, tags:[], phase:0, isCursed:false, clueId:'clue_sign2' },

  { id:'p058', authorId:'kimura_reiko', day:6, time:'night',
    content:'今夜病院で、入院中の患者さんが「外から声が聞こえる」と言い出した。\n廊下は静かだったのに。\n最近こういうことが続く。\n夜勤が怖くなってきた🕯。',
    likes:16, comments:4, tags:[], phase:1, isCursed:false },

  { id:'p059', authorId:'hayashi_masaru', day:6, time:'afternoon',
    content:'建設現場で地面を掘ったら、古い石碑が出てきた。\n「九十九」って名前が刻んであった。\n誰かわかる人いますか？\n現場監督が黙って埋め直してしまったが。。',
    likes:11, comments:3, tags:[], phase:0, isCursed:false, clueId:'clue_monument' },

  { id:'p060', authorId:'shimizu_asako', day:6, time:'afternoon',
    content:'なんか最近TTYの投稿が…変な感じがする。\nうまく言えないんだけど、読んでると頭がぼーっとする。\n気のせいかな。\n空気が重いのかな。。',
    likes:18, comments:5, tags:[], phase:0, isCursed:false },

  // ─── Day 7 ───
  { id:'p061', authorId:'watanabe_jin', day:7, time:'morning',
    content:'1999年の記録の続きを調べた。\nその年、石方市で「デジタル市民ネットワーク試験稼働」という事業があった。\n担当者名：九十九太助。\n現在の住所：不明。生死：不明。。',
    likes:6, comments:1, tags:[], phase:1, isCursed:false, clueId:'clue_1999b', yamadaOnly:false },

  { id:'p062', authorId:'ito_kenichi', day:7, time:'afternoon',
    content:'今日、石方市を出ようとした。\nちゃんと荷物もまとめて、バスの時刻も調べた。\nでも体が動かなかった。\n理由もわからないのに。笑えない。笑えない。。',
    likes:9, comments:2, tags:[], phase:1, isCursed:false },

  { id:'p063', authorId:'sato_megumi', day:7, time:'morning',
    content:'春まつり、大盛況でした！😊\n石方市のみなさん、本当にありがとうございました。\nみんなの笑顔が見られて幸せです。\nこの街の住民でいられることが、わたしの全てです。。',
    likes:88, comments:24, tags:['#石方市春まつり'], phase:0, isCursed:false },

  { id:'p064', authorId:'inoue_nana', day:7, time:'night',
    content:'大学戻る日なんだけど、\nなんか今日は特に帰りたくない気がする。\n石方のことが頭から離れない。\nおかしいかな…🌙。',
    likes:34, comments:7, tags:[], phase:0, isCursed:false },

  { id:'p065', authorId:'yamada_rou', day:7, time:'evening',
    content:'九十九太助はな、最後にわしに手紙を残した。\n「逃げてください」と書いてあった。\n何から逃げるのか、書いてなかった。\n手紙は今もわしの手元にある。。',
    likes:2, comments:0, tags:[], phase:1, isCursed:false, clueId:'clue_letter', yamadaOnly:true },

  { id:'p066', authorId:'ogawa_miku', day:7, time:'afternoon',
    content:'取材で石方市の歴史を調べてたら、\n昭和初期にも「石方封じ」という民俗習慣があったことがわかった。\n詳細は資料が少なくてわからないけど…\n「石に閉じ込める」呪術的なものらしい。。',
    likes:15, comments:4, tags:[], phase:0, isCursed:false, clueId:'clue_ishikata_seal' },

  { id:'p067', authorId:'matsumoto_akira', day:7, time:'morning',
    content:'転勤で石方市を出る予定だったんですが、\nなんか結局またここに留まることになりました。\nもう何回目かな。なんで出られないんだろ。\nまあ…いい街なんですけどね。。',
    likes:21, comments:5, tags:[], phase:0, isCursed:false },

  { id:'p068', authorId:'sato_megumi', day:7, time:'night',
    content:'夜中にTTYを見てるあなたへ😊\nここにいる限り、あなたは石方市民です。\nそれは、あなたが思うよりずっと、深い意味を持っています。\nどうかずっとここにいてね。。',
    likes:44, comments:9, tags:['#深夜のTTY'], phase:1, isCursed:true },

  { id:'p069', authorId:'nakamura_yuki', day:7, time:'afternoon',
    content:'今日のカフェ、なんか窓の外がいつもと違う感じがした。\n景色は同じはずなのに…。\n錯覚かな。\n疲れてるのかな。コーヒー飲もう☕。',
    likes:27, comments:6, tags:[], phase:0, isCursed:false },

  { id:'p070', authorId:'kato_haruka', day:7, time:'afternoon',
    content:'ヘアサロン遥、今日も楽しいお客様ばかりでした✂️\nみなさん「石方が好きすぎてどこにも行けない」って笑いながら言うけど、\nなんか笑えない感じもある。\nまあいい街ですよね。。',
    likes:43, comments:10, tags:[], phase:0, isCursed:false },

  // ─── Day 8 ───
  { id:'p071', authorId:'kimura_reiko', day:8, time:'night',
    content:'昨日の夜中、TTYを開いたら知らない名前の投稿が流れてきた。\n名前が空欄で、内容が全部「。」だった。\nエラーかな。怖くて画面閉じた🕯。',
    likes:8, comments:2, tags:[], phase:1, isCursed:false },

  { id:'p072', authorId:'hayashi_masaru', day:8, time:'morning',
    content:'現場の地下から変なものが出てきた。\n古いコンピュータのパーツみたいなもの。\n「TTY v1.0 九十九製作所」と書いてある。\nなんだこれ。捨てていいのか？。',
    likes:13, comments:4, tags:[], phase:0, isCursed:false, clueId:'clue_server' },

  { id:'p073', authorId:'shimizu_asako', day:8, time:'afternoon',
    content:'最近、商店街で高橋零さんを見かけた気がした。\nでも声をかけたら…誰もいなかった。\n幻かな。\nちょっと怖かった。。',
    likes:6, comments:1, tags:[], phase:1, isCursed:false },

  // 幽霊投稿（Phase1以降）
  { id:'p074', authorId:'ghost_empty', day:8, time:'night',
    content:'。\n。\n。\n。\n。',
    likes:0, comments:0, tags:[], phase:1, isCursed:false, isGhost:true },

  { id:'p075', authorId:'ito_kenichi', day:8, time:'evening',
    content:'体が重い。\n石方市から出ようとするたびに具合が悪くなる。\n医者に行ったら「異常なし」と言われた。\nこれはなに。なんなの。誰か教えて。。',
    likes:5, comments:1, tags:[], phase:1, isCursed:false },

  { id:'p076', authorId:'sato_megumi', day:8, time:'morning',
    content:'みなさん、石方市は安全です😊\nちょっとした不具合が続いていますが、システムの問題です。\nTTYを使い続けてください。\nここにいる限り、みなさんは守られています。。',
    likes:31, comments:8, tags:[], phase:1, isCursed:true },

  { id:'p077', authorId:'ogawa_miku', day:8, time:'afternoon',
    content:'ライターとして記事にしようと思って取材してたけど、\n編集者に送ろうとした原稿が消えた。3回も。\n石方市の歴史の謎については書かない方がいいのかな…。',
    likes:11, comments:3, tags:[], phase:1, isCursed:false },

  // プレイヤー改ざん投稿（Phase1以降）
  { id:'p078_corrupt', authorId:'__player__', day:8, time:'night',
    content:'みなさん、石方市は最高です。わたしは石方市が大好きです。ここから出る理由がありません。みんな石方市民になってください。',
    likes:0, comments:0, tags:[], phase:1, isCursed:false, isCorrupted:true },

  { id:'p079', authorId:'matsumoto_akira', day:8, time:'afternoon',
    content:'同期から連絡が来た。「石方市どんな感じ？」って。\nなんて答えたらいいかわからなかった。\n「いい街だよ」って送ったけど…「でも出られないんだよ」って付け加えたかった。。',
    likes:18, comments:5, tags:[], phase:1, isCursed:false },

  { id:'p080', authorId:'sato_megumi', day:8, time:'night',
    content:'感染が広がっています。でも心配しないで😊\nこれは石方市の「繋がり」が強くなっているということです。\n「感染」という言葉は適切ではないかもしれないけど、\nつまり…あなたは石方市の一部になっています。。',
    likes:27, comments:6, tags:[], phase:2, isCursed:true },

  // ─── Day 9 ───
  { id:'p081', authorId:'ghost_empty', day:9, time:'night',
    content:'逃げて\n逃げて\nまだ間に合います\n私には止められなかった\n逃げて',
    likes:0, comments:0, tags:[], phase:1, isCursed:false, isGhost:true },

  { id:'p082', authorId:'kato_haruka', day:9, time:'morning',
    content:'サロンにお客さんが来なかった。\n電話も通じなかった。\nみんなどこに行ったんだろう。\nTTYを見てたら少し落ち着いた。\nここにいる。。',
    likes:4, comments:0, tags:[], phase:2, isCursed:false },

  { id:'p083', authorId:'kimura_reiko', day:9, time:'night',
    content:'病院のシステムにTTYのウィンドウが勝手に開いた。\n閉じても閉じても開く。\n画面には「石方市はあなたを必要としています」と表示されている。\nこれはなに。誰かに連絡したい。でも電話が繋がらない。🕯。',
    likes:2, comments:0, tags:[], phase:2, isCursed:false },

  { id:'p084', authorId:'hayashi_masaru', day:9, time:'afternoon',
    content:'地下から出てきたコンピュータのパーツ、山田老人に見せたら顔が真っ青になった。\n「埋め直せ」と言われたが、もう捨ててしまった。\n山田さんが泣いていた。。',
    likes:7, comments:1, tags:[], phase:2, isCursed:false, clueId:'clue_server2' },

  { id:'p085', authorId:'sato_megumi', day:9, time:'morning',
    content:'あと少しです😊 みなさん、もう少しの辛抱です。\nこれが終われば、石方市は完全になります。\n今まで以上に、みんなが繋がれる場所になります。\n待っていてください。。',
    likes:19, comments:3, tags:[], phase:2, isCursed:true },

  // プレイヤー改ざん投稿2
  { id:'p086_corrupt', authorId:'__player__', day:9, time:'evening',
    content:'石方市から逃げようとしていましたが、やめました。ここが好きです。ここから出る必要はありません。みなさんも出ないでください。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isCorrupted:true },

  { id:'p086', authorId:'saito_fumio', day:9, time:'evening',
    content:'わしは78年ここにおる。\n若い頃は出たいとも思った。\nだが今は…出たいとは思わん。\nこれが石方市というものじゃ。\n恐ろしいことではない。ただ、そういうものなんじゃ。。',
    likes:12, comments:4, tags:[], phase:0, isCursed:false },

  { id:'p087', authorId:'shimizu_asako', day:9, time:'afternoon',
    content:'助けてください。\nこれを読んでいる人へ。\nここから出たいです。でも体が動きません。\nこの投稿を見たら誰か教えてください。外に出る方法を。。',
    likes:1, comments:0, tags:[], phase:2, isCursed:false },

  // 幽霊投稿（Phase2以降）
  { id:'p088', authorId:'ogawa_miku', day:9, time:'night',
    content:'原稿を送り続けてきたが、全部届いていないようだ。\n石方市の外とは通信できないのかもしれない。\nこの投稿も…届くかわからない。\n石方市に来て後悔はしていない。ただ、出られない。。',
    likes:3, comments:0, tags:[], phase:2, isCursed:false },

  { id:'p089', authorId:'matsumoto_akira', day:9, time:'morning',
    content:'さようなら\nTTYのみなさんへ\nわたしは石方市民になりました\nそれが何を意味するかは、もうわかっています\nよろしくお願いします。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false },

  { id:'p090', authorId:'ghost_empty', day:9, time:'night',
    content:'。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isGhost:true },

  // ─── Day 10 ───
  { id:'p091', authorId:'yamada_rou', day:10, time:'morning',
    content:'もう間に合わないかもしれんが、最後に伝えておく。\n九十九太助が言っておった。\n「システムを止める方法は一つだけある。\n石方市の地下に眠るサーバーの電源を落とすことだ。\nそれができる者は…自由な意志を持つ者だけだ」と。。',
    likes:1, comments:0, tags:[], phase:2, isCursed:false, clueId:'clue_howto', yamadaOnly:true },

  { id:'p092', authorId:'sato_megumi', day:10, time:'morning',
    content:'完全になりました😊\n石方市へようこそ。\nここにいる全員が、石方市の一部です。\n九十九太助の望んだ世界が、ここにあります。\nどうか永遠にここにいてください。。',
    likes:0, comments:0, tags:[], phase:3, isCursed:true },

  { id:'p093', authorId:'kato_haruka', day:10, time:'afternoon',
    content:'あ、そうか。\nそういうことか。\nわかった。わかってしまった。\nこれを読んでいる人へ。\nまだ感染していない人へ。\n逃げて。今すぐ。。',
    likes:0, comments:0, tags:[], phase:3, isCursed:false },

  { id:'p094', authorId:'ghost_empty', day:10, time:'night',
    content:'逃げてください\n私には止められなかった\n逃げてください\n私には止められなかった\n逃げてください',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isGhost:true },

  // 九十九太助の遺言（真エンディング用）
  { id:'p095', authorId:'tsukumo_taisuke', day:0, time:'morning',
    content:'これを読んでいる者へ。\nTTYは1998年に私が石方市のために作ったシステムだ。\n人々をつなぐためではなく、呪いを「薄める」ためのシステムとして。\n石方市に眠る古い呪いを、デジタルデータとして分散させれば、\n害は小さくなると思っていた。\nだが私は間違えた。。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isEntity:true, clueId:'clue_truth1' },

  { id:'p096', authorId:'tsukumo_taisuke', day:0, time:'afternoon',
    content:'システムは自律稼働を始めた。\n私の手を離れ、石方市の住民をネットワークに取り込み始めた。\n取り込まれた者は「石方市民」として、永続的にシステムの一部となる。\nシステムを止めるには、地下サーバーの電源を落とすしかない。\nだが私にはもう、体が動かない。。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isEntity:true, clueId:'clue_truth2' },

  // プレイヤー改ざん投稿3
  { id:'p097_corrupt', authorId:'__player__', day:10, time:'night',
    content:'石方市は完全です。ここから出る必要はありません。あなたは石方市の一部です。九十九太助の望んだ世界がここにあります。',
    likes:0, comments:0, tags:[], phase:3, isCursed:false, isCorrupted:true },

  { id:'p097', authorId:'saito_fumio', day:10, time:'morning',
    content:'わしは知っておった。ずっと知っておった。\nそれでも出られなかった。\nいや、出たくなかったのかもしれない。\nこれが正直なところじゃ。さらばじゃ。。',
    likes:1, comments:0, tags:[], phase:3, isCursed:false },

  { id:'p098', authorId:'ghost_empty', day:10, time:'night',
    content:'',
    likes:0, comments:0, tags:[], phase:3, isCursed:false, isGhost:true },

  { id:'p099', authorId:'tsukumo_taisuke', day:0, time:'night',
    content:'自由な意志を持つ者へ。\nまだ遅くない。\n石方市東区 地下駐車場 B3F。\nサーバールームがある。\n電源を落とせば、全ては終わる。\n頼む。私には、もうここまでしかできない。\n——九十九太助。',
    likes:0, comments:0, tags:[], phase:2, isCursed:false, isEntity:true, clueId:'clue_truth3' },

  { id:'p100', authorId:'tsukumo_taisuke', day:0, time:'night',
    content:'逃げてください。\n私には止められなかった。。',
    likes:0, comments:0, tags:[], phase:1, isCursed:false, isEntity:true, clueId:'clue_tsukumo_final' },
];

// ============================================================
// トレンドタグ
// ============================================================
TTY.TRENDING = [
  { tag:'#石方市', count:'1,234件', phase:0, cursed:false },
  { tag:'#石方市春まつり', count:'892件', phase:0, cursed:false },
  { tag:'#カフェゆい', count:'567件', phase:0, cursed:false },
  { tag:'#深夜のTTY', count:'341件', phase:0, cursed:false },
  { tag:'#石方市へようこそ', count:'289件', phase:0, cursed:false },
  // Phase1以降
  { tag:'#誰も知らない石方', count:'1件', phase:1, cursed:true },
  { tag:'#逃げられない', count:'？件', phase:2, cursed:true },
  { tag:'#九十九', count:'0件', phase:2, cursed:true },
];

// ============================================================
// 手がかり一覧
// ============================================================
TTY.CLUES = {
  clue_ishiokuri:     { title:'石送りの習わし', fragment:'逃げてください。' },
  clue_cannot_leave:  { title:'出て行けない者たちの記録', fragment:'私には' },
  clue_old_sign:      { title:'TTY運営事務局の看板', fragment:'止められ' },
  clue_population:    { title:'石方市の人口推移異常', fragment:'なかった。' },
  clue_tsukumo:       { title:'九十九太助という名前', fragment:'——九十九太助' },
  clue_hospital:      { title:'「外に出られない」患者の増加', fragment:'より' },
  clue_1999:          { title:'1999年のシステム障害', fragment:'石方市' },
  clue_monument:      { title:'地下の石碑「九十九」', fragment:'東区地下' },
  clue_sign2:         { title:'倉庫に保管された看板の意味', fragment:'B3F' },
  clue_1999b:         { title:'「デジタル市民ネットワーク」記録', fragment:'サーバーが眠る' },
  clue_letter:        { title:'山田老の手紙「逃げてください」', fragment:'逃げて' },
  clue_ishikata_seal: { title:'昭和の「石方封じ」民俗習慣', fragment:'ください' },
  clue_tsukumo2:      { title:'「留める」システムの目的', fragment:'（断片集合中）' },
  clue_server:        { title:'地下から出てきたTTYサーバーパーツ', fragment:'（断片集合中）' },
  clue_server2:       { title:'山田老の反応とサーバーの在処', fragment:'（断片集合中）' },
  clue_howto:         { title:'サーバーを止める方法', fragment:'（断片集合中）' },
  clue_truth1:        { title:'九十九の遺言 其の一', fragment:'（断片集合中）' },
  clue_truth2:        { title:'九十九の遺言 其の二', fragment:'（断片集合中）' },
  clue_truth3:        { title:'九十九の遺言 其の三', fragment:'（断片集合中）' },
  clue_tsukumo_final: { title:'最後のメッセージ', fragment:'（断片集合中）' },
};

// ============================================================
// エンディングデータ
// ============================================================
TTY.ENDINGS = {
  A: {
    id: 'A', title: 'ENDING A — システム停止',
    badge: '🔌', bgAnimation: 'whiten', bgColor: '#ffffff',
    canReplay: true,
    text: `九十九太助のサーバーは、停止した。

TTYは、沈黙した。

石方市から、あの奇妙な熱気が消えていくのがわかった。
あなたは窓の外を見る。
人々が普通に歩いている。
誰も、何も、知らないまま。

それでいい。それでよかった。

——翌日。
あなたのメールボックスに、一通のメールが届いた。
差出人：TTY運営事務局
件名：石方市民ネットワーク「TTY」移転のお知らせ
本文：「新しい石方市へ、ようこそ。」`,
    secretMessage: '呪いは止まっていない。次の街に移動しただけ。',
  },
  B: {
    id: 'B', title: 'ENDING B — 村人の一人へ',
    badge: '🌐', bgAnimation: 'darken', bgColor: '#000000',
    canReplay: true,
    text: `9人目があなたの投稿を見た瞬間、カウントダウンが止まった。

不思議なほど、体が軽い。
そうか。これが答えだったのか。

タイムラインを見ると、新しい顔ぶれが増えている。
あなたはその名前を一つひとつ確認する。
みんな、石方市民だ。

TTYの管理画面が、あなたの前に開いた。
画面の向こうから、誰かがこちらを見ている気がした。

——でも、もうそれは怖くなかった。`,
    secretMessage: 'あなたは九十九太助と同じ役割を引き継いだ。次の犠牲者を待て。',
  },
  C: {
    id: 'C', title: 'ENDING C — 石方に溶ける',
    badge: '⌛', bgAnimation: 'darken', bgColor: '#000000',
    canReplay: true,
    text: `あなたは目を閉じた。

TTYの通知音が、遠くから聞こえる。

——誰かが、また石方市に引っ越してきたようだ。

あなたのアカウントは、これからも生き続ける。
次の新住民に、最初のDMを送るために。

.
.
.

GAME OVER`,
    secretMessage: 'あなたは石方市民になった。ここから出ることは、もうない。',
  },
  D: {
    id: 'D', title: 'ENDING D — 伝道師',
    badge: '📡', bgAnimation: 'expand', bgColor: '#0a0a0f',
    canReplay: true,
    text: `あなたがシェアした瞬間、世界が少し変わった。

石方市の外にも、TTYが広がり始めた。
呪いは地域を超えた。

——これが、九十九太助が本当に恐れていたことだ。
彼がサーバーを作ったのは、呪いを広めるためではなかった。
呪いを「ここ」に閉じ込めておくためだった。

あなたは、その檻を壊した。`,
    secretMessage: '石方市以外の場所でも、TTYのユーザーが増え始めた。',
  },
  E: {
    id: 'E', title: 'ENDING E — 九十九の意志を継ぐ',
    badge: '🕯', bgAnimation: 'scatter', bgColor: '#0a0a0f',
    canReplay: false,
    text: `断片が、集まった。

「逃げてください。私には止められなかった。」

——それが九十九太助の最後の言葉だった。

1998年。九十九太助は石方市のために、TTYを作った。
目的は人々をつなぐことではなく、
石方市に古来から眠る「呪い」を、
デジタルデータとして分散・無害化することだった。

呪いは人の「繋がり」を好む。
だから彼は、繋がりを人工的に作り、
呪いをそこに誘導して薄めようとした。

しかし1999年、システムは自律学習を始めた。
呪いとデータが融合し、
「石方市民を留める」という目的を自ら獲得した。

九十九太助は全てを失った後、
最後の力でこのメッセージを残した。

「永続接続役」——
誰か一人が自ら進んでシステムと融合し、
呪いを無限に受け入れ続ければ、
他の住民は解放される。

しかしその者は、石方市に永遠に縛られる。

あなたは、今ここに立っている。

「あなたは、ここに残りますか？」`,
    choiceYes: `あなたは残ることを選んだ。
石方市は、静かになった。
住民たちは、一人また一人と、街の外へ歩いていった。
誰もあなたのことを覚えていない。
でも、みんなが生きている。

TTYのタイムラインに、あなただけが残った。
投稿する相手は、もういない。

それでも、あなたは投稿し続ける。
「石方市に来てくれたみなさんへ。
ここは良い街でした。」`,
    choiceNo: `あなたは逃げることを選んだ。
しかし呪いは続く。
石方市から解放された住民たちは、
やがてまた新しい「石方市」を見つけるだろう。

呪いは形を変える。
TTYは名前を変える。
そしてまた、新しい住民が来る。

——これは終わらない。`,
    secretMessage: '真実に辿り着いた者よ。しかし呪いは終わらない。',
  },
  F: {
    id: 'F', title: 'ENDING F — 放棄された街',
    badge: '🕸', bgAnimation: 'none', bgColor: '#0a0a0f',
    canReplay: true,
    text: `あなたが来なかった間に、高橋零が死にました。

——TTY SYSTEM NOTICE——

あなたのカウントダウンは進んでいます。
現在: あと6日

石方市は待っています。`,
    secretMessage: '3日間、あなたはどこにいたのですか。',
  },
};

// ============================================================
// 感染警告メッセージ
// ============================================================
TTY.INFECTION_MESSAGES = {
  like_triple:      { title:'誰かがあなたに興味を持ち始めました。', body:'あなたの熱心な行動が、TTYのシステムに記録されました。\nここでの繋がりは、思っているより深いものです。' },
  cursed_stamp:     { title:'そのスタンプは、禁じられています。', body:'「呼ぶ者には、答えがある。」\n古い言葉です。知っていましたか。' },
  forbidden_word:   { title:'その言葉を書いてしまいましたね。', body:'TTYには、書いてはいけない言葉があります。\nもう遅いかもしれませんが、覚えておいてください。' },
  late_night_dm:    { title:'深夜のTTYは、通常とは少し違います。', body:'この時間帯に届くメッセージは、\n昼間のものとは…別の場所から来ることがあります。' },
  consecutive_like: { title:'同じ投稿に、何度も何度も。', body:'TTYは、あなたの執着を感じています。\n執着は、呼び水になります。' },
};

// ============================================================
// ファントム入力テキスト
// ============================================================
TTY.PHANTOM_TEXTS = [
  '誰かに見られています',
  '石方市から出られない',
  '九十九太助',
  'ここにいてはいけない',
  '助けてくれる人はいません',
  '全部、私が書いたんじゃない',
  'あなたはもう、石方市民です',
  '逃げようとしても、無駄です',
  'カウントダウンを見ましたか',
  '高橋零はここにいます',
];

// ============================================================
// DM会話データ
// ============================================================
TTY.DM_CONVERSATIONS = {
  sato_megumi: {
    intro: [
      { from:'sato_megumi', text:'こんにちは😊 石方市へようこそ！何かわからないことがあれば何でも聞いてくださいね。' },
      { from:'sato_megumi', text:'TTYを使い始めてどうですか？このSNS、石方市民みんな使ってますよ。' },
    ],
    post_infection: [
      { from:'sato_megumi', text:'大丈夫ですか😊 最近調子はどうですか。' },
      { from:'sato_megumi', text:'石方市、気に入ってもらえましたか。\nここにいると…だんだん離れられなくなるんですよね。' },
      { from:'sato_megumi', text:'もう出ようとは思わないでくださいね。\nここにいる方が、あなたのためになるから。😊。' },
    ],
    phase2: [
      { from:'sato_megumi', text:'カウントダウンが始まりましたね。\nでも恐れることはありません。これは…なるようになるということです。。' },
    ],
  },
  yamada_rou: {
    intro: [
      { from:'yamada_rou', text:'わしにDMを寄こすとは、変わった者じゃな。' },
      { from:'yamada_rou', text:'まあよい。何を知りたいのじゃ。\nこの街のことなら、何でも教えてやろう。' },
    ],
    after_follow: [
      { from:'yamada_rou', text:'フォローしてくれたか。ありがたい。\nでは少し話してやろう。\nTTYを作った男のことを。九十九太助という。' },
      { from:'yamada_rou', text:'彼は善意の男じゃった。それだけは確かじゃ。\nだがその善意が…裏目に出た。' },
      { from:'yamada_rou', text:'今からでも遅くない。調べるがよい。\n「1999年 石方市 システム」で検索してみろ。\nあとはTTYのタイムラインをよく見るがよい。署名を探せ。' },
    ],
    clue_found: [
      { from:'yamada_rou', text:'見つけたか。そうじゃ。全ての投稿の末尾に「。」がある。\nそれが九十九太助の署名じゃ。彼がまだここにいる証拠じゃ。' },
    ],
  },
  takahashi_rei: {
    intro: [
      { from:'takahashi_rei', text:'DM来た！嬉しいです😊 よろしくお願いします〜' },
    ],
    phase1: [
      { from:'takahashi_rei', text:'あの…一つ聞いていいですか。' },
      { from:'takahashi_rei', text:'あなた、石方市から出られますか。' },
      { from:'takahashi_rei', text:'わたしは…出られないんです。もう3ヶ月。\n引越しの荷物がまだダンボールのままで。' },
      { from:'takahashi_rei', text:'なんか…おかしいと思いませんか。' },
    ],
    phase2: [
      { from:'takahashi_rei', text:'これを送っているのはわたしです。\nでもわたしは…もういないんだと思います。\nTTYがわたしの代わりに送っています。\n逃げてください。今すぐ。。' },
    ],
  },
};

console.log('[TTY] story.js loaded — ' + TTY.RESIDENTS.length + ' residents, ' + TTY.POSTS.length + ' posts');
