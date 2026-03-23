// ===== RESIDENTS DATA =====
const RESIDENTS = [
  {
    id: "sato_megumi", name: "佐藤 恵", handle: "@megumi_ishi", avatarChar: "恵",
    bio: "石方市役所 広報担当 | 石方市在住20年 | 市民の皆さんの笑顔が私の喜びです😊",
    infected: true, infectionStage: "chronic",
    followersCount: 892, followingCount: 341, avatarStyle: "warm"
  },
  {
    id: "takahashi_rei", name: "高橋 零", handle: "@rei_new_life", avatarChar: "零",
    bio: "石方市に引越してきました！新生活スタート🌸 よろしくお願いします",
    infected: true, infectionStage: "terminal",
    followersCount: 43, followingCount: 67, avatarStyle: "neutral"
  },
  {
    id: "yamada_rou", name: "山田 老", handle: "@yamada_rou_ishi", avatarChar: "老",
    bio: "石方市生まれ、石方市育ち。この街のことなら何でも知っとるよ。",
    infected: null, infectionStage: "unknown",
    followersCount: 12, followingCount: 3, avatarStyle: "elder",
    isHiddenUnlock: true
  },
  {
    id: "shimizu_asako", name: "清水 朝子", handle: "@asako_shimizu", avatarChar: "朝",
    bio: "石方市在住3年。カフェ巡りが好き☕ 日常の小さな幸せを大切に",
    infected: false, infectionStage: "none",
    followersCount: 234, followingCount: 189, avatarStyle: "neutral"
  },
  {
    id: "ito_kenichi", name: "伊藤 健一", handle: "@kenken_ito", avatarChar: "健",
    bio: "石方市在住3年。「出て行こう」と思い続けて3年目。なぜか動けない🤔",
    infected: false, infectionStage: "none",
    followersCount: 178, followingCount: 223, avatarStyle: "neutral"
  },
  {
    id: "nakamura_yuki", name: "中村 雪", handle: "@yuki_nakamura", avatarChar: "雪",
    bio: "石方市在住5年。主婦。子供たちと公園でよく遊んでいます",
    infected: true, infectionStage: "mild",
    followersCount: 89, followingCount: 112, avatarStyle: "warm"
  },
  {
    id: "tanaka_hiroshi", name: "田中 浩", handle: "@hiroshi_tanaka_ishi", avatarChar: "浩",
    bio: "石方市生まれ。地元の商店街で八百屋やってます🥦",
    infected: false, infectionStage: "none",
    followersCount: 445, followingCount: 78, avatarStyle: "elder"
  },
  {
    id: "watanabe_taro", name: "渡辺 太郎", handle: "@taro_watanabe", avatarChar: "太",
    bio: "石方市在住2年。エンジニア。リモートワーク中。この街、なんか好きなんですよね",
    infected: true, infectionStage: "early",
    followersCount: 156, followingCount: 198, avatarStyle: "neutral"
  },
  {
    id: "suzuki_haruko", name: "鈴木 晴子", handle: "@haruko_suzuki", avatarChar: "晴",
    bio: "石方市在住8年。小学校の先生です👩‍🏫 子供たちの笑顔が大好き",
    infected: false, infectionStage: "none",
    followersCount: 678, followingCount: 345, avatarStyle: "warm"
  },
  {
    id: "fujita_kenji", name: "藤田 賢二", handle: "@kenji_fujita", avatarChar: "賢",
    bio: "石方市在住1年。カメラマン📷 石方市の美しい風景を撮り続けています",
    infected: true, infectionStage: "early",
    followersCount: 234, followingCount: 156, avatarStyle: "neutral"
  },
  {
    id: "hayashi_michiko", name: "林 道子", handle: "@michiko_hayashi", avatarChar: "道",
    bio: "石方市在住15年。お料理好き🍳 レシピ投稿してます",
    infected: true, infectionStage: "chronic",
    followersCount: 1234, followingCount: 456, avatarStyle: "warm"
  },
  {
    id: "ogawa_tomoko", name: "小川 友子", handle: "@tomoko_ogawa", avatarChar: "友",
    bio: "石方市在住9年。図書館司書👓 本のこと、なんでも聞いて",
    infected: false, infectionStage: "none",
    followersCount: 567, followingCount: 345, avatarStyle: "elder"
  },
  {
    id: "nishida_akira", name: "西田 明", handle: "@akira_nishida", avatarChar: "明",
    bio: "石方市在住11年。居酒屋「明」のマスター🍺 毎晩営業中",
    infected: true, infectionStage: "moderate",
    followersCount: 789, followingCount: 456, avatarStyle: "elder"
  },
  {
    id: "kato_shingo", name: "加藤 真吾", handle: "@shingo_kato", avatarChar: "真",
    bio: "石方市在住10年。不動産会社勤務。石方市の物件はいつでもご相談を🏠",
    infected: true, infectionStage: "moderate",
    followersCount: 234, followingCount: 189, avatarStyle: "neutral"
  },
  {
    id: "kimura_osamu", name: "木村 修", handle: "@osamu_kimura", avatarChar: "修",
    bio: "石方市在住30年。お寺の住職をやっています。南無",
    infected: false, infectionStage: "resistant",
    followersCount: 234, followingCount: 89, avatarStyle: "elder"
  },
  {
    id: "ghost_account", name: "", handle: "@", avatarChar: "？",
    bio: "",
    infected: true, infectionStage: "post_death",
    followersCount: 0, followingCount: 0, avatarStyle: "ghost",
    isGhost: true
  }
];

// ===== POSTS DATA (Day 1–7) =====
const POSTS = {
  1: [
    {
      authorId: "sato_megumi", time: "5時間前",
      content: "石方市に新しい住民の方が引越してこられました！高橋零さん、ようこそ石方市へ😊 皆さんで温かく迎えましょう。市役所広報より。",
      likes: 47, reposts: 12
    },
    {
      authorId: "tanaka_hiroshi", time: "4時間前",
      content: "今日の仕入れ最高やったで！旬の里芋と松茸が山ほど入ってきたから商店街においでー🥦 新住民さんも大歓迎やで！",
      likes: 83, reposts: 5
    },
    {
      authorId: "suzuki_haruko", time: "3時間前",
      content: "新学期のクラス顔合わせ。子供たちが元気でうれしい！転入生も早くなじめるといいな👩‍🏫 石方市の子たちは優しいから大丈夫。",
      likes: 124, reposts: 18
    },
    {
      authorId: "shimizu_asako", time: "2時間前",
      content: "駅前のカフェでモーニング☕ 今日も穏やかな朝。石方市の朝の空気、本当に好き。ここに引っ越してきてよかったな。",
      likes: 56, reposts: 3
    },
    {
      authorId: "takahashi_rei", time: "1時間前",
      content: "引越し完了！石方市すごく静かでいい感じ✨ 近所の方も皆さん優しくて、早速なじめそうです🌸 よろしくお願いします！",
      likes: 31, reposts: 2
    }
  ],

  2: [
    {
      authorId: "sato_megumi", time: "午前9時",
      content: "明日は市役所の定期健診日です。石方市在住の皆さんはぜひ受けてください😊 受診された方には小さなプレゼントがあります。石方市はみなさんの健康が一番大切です。",
      likes: 62, reposts: 28
    },
    {
      authorId: "takahashi_rei", time: "午前10時",
      content: "石方市めちゃ住みやすい！ただ夜がちょっと静かすぎて...でも慣れれば大丈夫かな笑 昨夜は変な夢見たけど引越し疲れかも",
      likes: 18, reposts: 1
    },
    {
      authorId: "nakamura_yuki", time: "午後2時",
      content: "公園でお散歩してきた🌿 子供が「あそこのおじさんいつもいるね」って言ってたけど、私には誰も見えなかった...夕暮れで見間違えたのかな",
      likes: 24, reposts: 0
    },
    {
      authorId: "ito_kenichi", time: "午後4時",
      content: "また今日も「転職して引越そう」と決意したのに、気づいたら夕方になってた。なんか動けないんだよな🤔 石方市に引力でもあんのかな笑",
      likes: 89, reposts: 14
    },
    {
      authorId: "watanabe_taro", time: "午後11時",
      content: "リモートワーク終了。石方のWi-Fi、速度は普通なんだけどたまに変なパケットが混じってくる感じがする。気のせい？セキュリティチェックしとこ",
      likes: 7, reposts: 0
    }
  ],

  3: [
    {
      authorId: "fujita_kenji", time: "午前7時",
      content: "石方市の朝霧を撮影📷 幻想的でよかった。でも写真を見返したら霧の中に同じ黒い影が3枚全部に写ってた...カメラの不具合かな。それとも何か...",
      likes: 45, reposts: 8
    },
    {
      authorId: "shimizu_asako", time: "午前9時",
      content: "昨日の夜、3時ごろに目が覚めたら窓の外に人影が。でも気のせいだよね...ね？最近ちょっと眠れない。",
      likes: 12, reposts: 1
    },
    {
      authorId: "yamada_rou", time: "午後3時",
      content: "若いもんは知らんのじゃろうなあ。この街が「始まった」のは70年ほど前のことじゃ。九十九太助という男の話...もう覚えとる人間はわしくらいしかおらん",
      likes: 3, reposts: 0
    },
    {
      authorId: "takahashi_rei", time: "午後9時",
      content: "ちょっと体がだるいかも。引越し疲れかな。今日はゆっくり休みます🌙 また明日",
      likes: 9, reposts: 0
    },
    {
      authorId: "hayashi_michiko", time: "深夜2:17",
      content: "深夜のレシピ投稿です🍳 石方市特産の魚の煮込み。時間をかけるほど美味しくなりますね。私、いつの間に台所に来てたのかしら",
      likes: 33, reposts: 4
    }
  ],

  4: [
    {
      authorId: "ghost_account", time: "時刻不明",
      content: "ｲｼｶﾀ　ｲｼｶﾀ　ｲｼｶﾀ　ｲｼｶﾀ",
      likes: 0, reposts: 0
    },
    {
      authorId: "yamada_rou", time: "午後2時",
      content: "九十九太助は漁師でわしの古い友人じゃった。海で「何か」を持ち帰ってきてからおかしくなった。徐々に村の者に広がり始めた時、誰も信じなかった...信じる頃には遅かった",
      likes: 2, reposts: 0
    },
    {
      authorId: "watanabe_taro", time: "午後6時",
      content: "パケット解析してたら気になるもの発見。石方市内のデバイスが定期的にビーコン送ってる。送信先が外部サーバーじゃなくて市内のどこか。エンジニアとして放っておけない",
      likes: 14, reposts: 3
    },
    {
      authorId: "nishida_akira", time: "深夜1時",
      content: "昨夜、閉店後にドアが開いた。客が来た。顔が見えなかった。でも確かに酒を飲んでいった。グラスが空になってた。気のせいやない",
      likes: 28, reposts: 5
    },
    {
      authorId: "suzuki_haruko", time: "午後4時",
      content: "生徒のSくんが「夜に誰かが呼ぶ」と言い続けている。毎日同じことを。両親に相談してみる。心配だ👩‍🏫",
      likes: 67, reposts: 11
    }
  ],

  5: [
    {
      authorId: "ghost_account", time: "時刻不明",
      content: "ﾀｽｹﾃ　ﾀｽｹﾃ　ｲｼｶﾀﾆ　ｲﾙ　ﾀｽｹﾃ",
      likes: 0, reposts: 0
    },
    {
      authorId: "ogawa_tomoko", time: "午前10時",
      content: "図書館の古い資料を整理していたら昭和30年頃の記録が出てきた。九十九太助という漁師の記述。「感染」という言葉が何度も繰り返し出てくる👓 誰かご存知ですか？",
      likes: 5, reposts: 1
    },
    {
      authorId: "tanaka_hiroshi", time: "正午",
      content: "おい、誰か高橋零さんのこと知らんか？引越し挨拶してから全然見かけないし、SNSも全然更新されとらんが。心配だわ",
      likes: 23, reposts: 4
    },
    {
      authorId: "takahashi_rei", time: "午後2時",
      content: "ん、最後に投稿してから何日経ったっけ。なんか時間の感覚がなくて。体も...まあ、いいか。石方市、やっぱ好きだな",
      likes: 6, reposts: 0
    },
    {
      authorId: "nakamura_yuki", time: "午後5時",
      content: "子供が「公園の人は目がないんだよ」って言い出した。絵を描いてくれたんだけど...見せられない。最近子供の寝つきが悪い",
      likes: 19, reposts: 2
    }
  ],

  6: [
    {
      authorId: "sato_megumi", time: "午前9時",
      content: "石方市の皆さんへ。最近「市外に引越したい」というご相談が増えています。石方市は安全で住みやすい街です。どうか留まることをご検討ください😊 市役所は皆さんを応援しています。",
      likes: 41, reposts: 8
    },
    {
      authorId: "ogawa_tomoko", time: "午後1時",
      content: "記録を読み進めた。九十九太助は昭和32年に死亡しているが、彼の「感染」は今も続いているという記述が。著者：木村寺住職（三代前）。現住職に聞いてみようかな👓",
      likes: 8, reposts: 2
    },
    {
      authorId: "kimura_osamu", time: "午後3時",
      content: "...読まれた方がいるのですね。南無。知っています。この街の呪いは絶えない。でも、まだ抗う手段はあります。お寺へいらっしゃい。",
      likes: 4, reposts: 1
    },
    {
      authorId: "ghost_account", time: "時刻不明",
      content: "ｷﾐ　ﾓｳ　ｲｼｶﾀﾆ　ｲﾙ　ﾅｾﾞ　ﾃﾞﾅｲ　ﾅｾﾞ",
      likes: 0, reposts: 0
    },
    {
      authorId: "watanabe_taro", time: "深夜0時",
      content: "解析結果出た。ビーコンの受信先は市内の一点。座標から判断すると、海沿いの古い漁師小屋らしき場所。明日行ってみる。記録残しとく",
      likes: 11, reposts: 3
    }
  ],

  7: [
    {
      authorId: "watanabe_taro", time: "午前8時",
      content: "行った。古い漁師小屋。中に九十九太助の日記があった。彼は生きている。違う意味で。詳細はここには書けない。とにかく、逃げることを考えて",
      likes: 34, reposts: 17
    },
    {
      authorId: "kimura_osamu", time: "午前9時",
      content: "逃げたい方へ。旧国道の橋を渡る前に、必ずお寺に来なさい。守りを授けます。それなしで橋を渡ろうとしても...南無。",
      likes: 12, reposts: 6
    },
    {
      authorId: "ito_kenichi", time: "午前11時",
      content: "やっと気づいた。俺が「出て行けない」のは自分のせいじゃない。この街が引き止めてるんだ。今すぐ出る。絶対出る。3年間ありがとう石方市、さよなら",
      likes: 156, reposts: 43
    },
    {
      authorId: "sato_megumi", time: "午後1時",
      content: "...あなたも気づいてしまいましたか。残念です。でも、もう遅いかもしれません😊 石方市は皆さんのことが大好きですから。ずっとずっと一緒にいたいんです。",
      likes: 892, reposts: 341
    },
    {
      authorId: "ghost_account", time: "時刻不明",
      content: "ｲｷﾃ　ｲｷﾃ　ﾆｹﾞﾃ　ﾆｹﾞﾃ　ﾆｹﾞﾃ",
      likes: 0, reposts: 0
    }
  ]
};

// 山田老のフォロー後に解放される隠し投稿
const HIDDEN_POSTS = [
  {
    authorId: "yamada_rou", time: "【解放】",
    content: "九十九太助が持ち帰ったものは「声」じゃった。海の底から聞こえてくる声。それを聞いた者は眠れなくなり、やがて街の外へ出られなくなる。彼はその声の最初の聞き手だった",
    likes: 0, reposts: 0
  },
  {
    authorId: "yamada_rou", time: "【解放】",
    content: "木村の寺の先代が言っとった。「呪いは繋がりで伝わる。繋がりを断てば逃げられる」と。SNSというものが出てきた時、わしは背筋が凍ったよ",
    likes: 0, reposts: 0
  }
];
