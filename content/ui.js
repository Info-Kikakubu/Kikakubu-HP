// UI専用設定。企画の本文・料金などは、従来どおり projects.js で編集します。
window.festivalContent = window.festivalContent || {};
window.festivalContent.ui = {
  titleEmblem: { src: "./assets/slideshow/学部エンブレム.png?v=figma-oct28a", alt: "千葉大学 情報・データサイエンス学部エンブレム" },
  panels: [
    { id: "food", project: 1, title: "デー祭食堂", eyebrow: "FOOD / YAKISOBA", thumbnail: "./assets/yakisoba.jpg", thumbnailAlt: "デー祭食堂のソース焼きそば", icon: "food", accent: "#43b991", span: 2 },
    { id: "campus-quest", project: 0, title: "CampusQuest", eyebrow: "GAME / EXHIBIT", description: "あなたの興味から最適な履修登録をお作りします! 作った履修登録はプリントアウトして持ち帰りましょう", useOwnDescription: true, thumbnail: "./assets/slideshow/CampusQuestタイトル.png", thumbnailAlt: "Campus Quest タイトル画面", icon: "quest", accent: "#43b991", exhibit: 0 },
    { id: "game-remake", project: 0, useOwnDescription: true, title: "広告ゲー展示", eyebrow: "REMAKE / PLAY", description: "よくある詐欺広告ゲー\"風\"の世界観を本当にプレイしてみたい！そんなあなたの願いを叶える神ゲー、ここに爆誕！", thumbnail: "./assets/slideshow/verdant-relay.png", thumbnailAlt: "VERDANT RELAY ゲーム紹介画像", icon: "game", accent: "#43b991" },
    { id: "programming-game", project: 0, description: "まちを作りながらプログラム開発を学ぼう", useOwnDescription: true, title: "プログラミング教養を兼ねたゲーム体験", eyebrow: "CODE / EXPERIENCE", thumbnail: "./assets/slideshow/学部エンブレム.png?v=figma-oct28a", thumbnailAlt: "情報・データサイエンス学部エンブレム", icon: "code", accent: "#43b991" },
    { id: "screening", project: 2, title: "対談動画上映", eyebrow: "TALK / SCREENING", thumbnail: "./assets/slideshow/対談動画サムネイル.png", thumbnailAlt: "AI時代 私たちは何を学ぶ？ 対談動画", icon: "screening", accent: "#43b991" }
  ],
  // source は既存データとの対応。独自項目は body / notes を記入して追加できます。
  // 複数の折りたたみ項目を同時に開けます。
  additionalInfo: [
    { number: "01", source: "news", title: "お知らせ / NEWS", lead: "最新の更新情報を確認する", notes: [] },
    { number: "02", source: "notices", title: "注意事項 / RULES", lead: "ご来場前にご確認ください", notes: [] },
    { number: "03", source: "about", title: "団体紹介 / ABOUT", lead: "デーサイ企画部について", notes: [] },
    { number: "04", source: "links", title: "SNSリンク / CONNECT", lead: "各種SNSで最新情報を確認する", notes: [] }
  ],
  snsPanel: { eyebrow: "SNS", title: "各種SNSへのリンク", source: "links", accent: "#43b991" },
  mapPanel: { eyebrow: "ACCESS", title: "アクセスマップ", source: "access", accent: "#43b991" },
  secret: {
    message: "こんな細部まで見てくれてありがとう！！",
    signature: "Thanks from",
    names: "Yoshiki, Akihiro, Yoshitaka, Ryoma"
  }
};
