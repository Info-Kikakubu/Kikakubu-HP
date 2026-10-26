// UI専用設定。企画の本文・料金などは、従来どおり projects.js で編集します。
window.festivalContent = window.festivalContent || {};
window.festivalContent.ui = {
  titleEmblem: { src: "./assets/slideshow/学部エンブレム.png", alt: "千葉大学 情報・データサイエンス学部エンブレム" },
  panels: [
    { id: "food", project: 1, title: "デー祭食堂", eyebrow: "食べ物販売", description: "ソース焼きそば", icon: "food", accent: "#43b991", span: 2 },
    { id: "campus-quest", project: 0, title: "CampusQuest", eyebrow: "ゲーム・展示", thumbnail: "./assets/slideshow/CampusQuestタイトル.png", thumbnailAlt: "Campus Quest タイトル画面", icon: "quest", accent: "#43b991", exhibit: 0 },
    { id: "game-remake", project: 0, title: "クソゲー再現", eyebrow: "ゲーム・展示", thumbnail: "./assets/slideshow/学部エンブレム.png", thumbnailAlt: "情報・データサイエンス学部エンブレム", icon: "game", accent: "#43b991" },
    { id: "programming-game", project: 0, title: "プログラミング教養を兼ねたゲーム体験", eyebrow: "ゲーム体験", thumbnail: "./assets/slideshow/学部エンブレム.png", thumbnailAlt: "情報・データサイエンス学部エンブレム", icon: "code", accent: "#43b991" },
    { id: "screening", project: 2, title: "対談動画上映", eyebrow: "学生 × 教員", thumbnail: "./assets/slideshow/対談動画サムネイル.png", thumbnailAlt: "AI時代 私たちは何を学ぶ？ 対談動画", icon: "screening", accent: "#43b991" }
  ],
  // source は既存データとの対応。独自項目は body / notes を記入して追加できます。
  // 複数の折りたたみ項目を同時に開けます。
  additionalInfo: [
    { number: "01", source: "news", title: "お知らせ", lead: "更新情報を確認する", notes: [] },
    { number: "02", source: "notices", title: "注意事項", lead: "ご来場の前にご確認ください", notes: [] },
    { number: "03", source: "about", title: "団体紹介", lead: "デーサイ企画部について", notes: [] }
  ],
  snsPanel: { eyebrow: "SNS", title: "各種SNSへのリンク", source: "links", accent: "#43b991" },
  mapPanel: { eyebrow: "ACCESS", title: "アクセスマップ", source: "access", accent: "#43b991" }
};
