// UI専用設定。企画の本文・料金などは、従来どおり projects.js で編集します。
window.festivalContent = window.festivalContent || {};
window.festivalContent.ui = {
  panels: [
    { id: "campus-quest", project: 0, title: "CampusQuest", eyebrow: "ゲーム・展示", icon: "quest", accent: "#43b991", exhibit: 0 },
    { id: "game-remake", project: 0, title: "クソゲー再現", eyebrow: "ゲーム・展示", icon: "game", accent: "#43b991" },
    { id: "programming-game", project: 0, title: "プログラミング教養を兼ねたゲーム体験", eyebrow: "ゲーム体験", icon: "code", accent: "#43b991" },
    { id: "screening", project: 2, title: "対談動画上映", eyebrow: "学生 × 教員", icon: "screening", accent: "#43b991" }
  ],
  // source は既存データとの対応。独自項目は body / notes を記入して追加できます。
  // 複数の折りたたみ項目を同時に開けます。
  additionalInfo: [
    { number: "01", source: "news", title: "お知らせ", lead: "更新情報を確認する", notes: [] },
    { number: "02", source: "festival", title: "開催情報・企画の詳細", lead: "日時・会場・食堂のご案内と写真", notes: [] },
    { number: "03", source: "notices", title: "注意事項", lead: "ご来場の前にご確認ください", notes: [] },
    { number: "04", source: "about", title: "団体紹介", lead: "デーサイ企画部について", notes: [] }
  ],
  snsPanel: { eyebrow: "SNS", title: "各種SNSへのリンク", source: "links", accent: "#43b991" },
  mapPanel: { eyebrow: "ACCESS", title: "アクセスマップ", source: "access", accent: "#43b991" }
};
