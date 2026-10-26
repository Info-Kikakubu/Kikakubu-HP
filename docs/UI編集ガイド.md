# UI刷新後の編集・検証

公開URLは従来どおり https://info-kikakubu.github.io/Kikakubu-HP/ です。
GitHub Pages は引き続き main / リポジトリ直下を公開します。

## 本文を編集する場所

既存の content/title.js、projects.js、news.js、notices.js、about.js、links.js、access.js、slideshow.js を使います。
企画の説明・料金・注文方法などを UI ファイルへ転記する必要はありません。

## UIの設定

content/ui.js を編集します。

- panels: トップの企画カード。id は重複しない文字列、project は projects.js の items の番号（0始まり）。title / eyebrow / description はカード・モーダル用の表示文。accent は #43b991 のような6桁の色コード。
- exhibit: 展示物一覧の何番目を紹介するか（0始まり）。省略可能。
- additionalInfo: 折りたたみの number / title / lead / body / notes。source は既存の情報を読み込む対応名（news、festival、notices、about）。配列に項目を追加すると自動で増えます。
- snsPanel / mapPanel: 右下のクイックメニューで開くモーダルの見出し等。SNSや地図の実データは従来の links.js / access.js で編集します。

現在の4カードは CampusQuest、クソゲー再現、プログラミング教養を兼ねたゲーム体験、対談動画上映です。
ゲーム3企画には、詳細の補作をせず既存の展示会の共通案内を表示しています。
元の展示会・食堂・上映の全文は「開催情報・企画の詳細」に残しています。

## 構成

index.html → content/ のデータ → scripts/slideshow.js → scripts/ui.js の順に読み込みます。
styles/ui.css が新UIのレイアウト、styles/theme.css が既存のエメラルド色の設定です。
従来の scripts/main.js と content/tabs.js は履歴・互換用に残しており、新UIの構成には使いません。
旧 #projects / #news / #notices / #about / #title / #slideshow のページ内リンクを引き続き使えます。
旧 #access / #links からは各モーダルを開きます。

## 検証・出力

Node.js が使える環境で `pnpm build` を実行します。依存ライブラリのインストールは不要です。
JavaScript構文とページからの参照・カード設定を確認し、dist/ にサイト一式を出力します。
公開元は従来のリポジトリ直下のままなので、dist/ のコミットや公開設定の変更は不要です。

ブラウザ検証は `pnpm test:ui`。Playwright が必要です。
共有ランタイムの Playwright を使う場合は、NODE_PATH にその node_modules の絶対パスを設定できます。
PC・スマートフォンの列数、本文保持、モーダル操作、旧リンク、複数の折りたたみ、200%相当の表示、読み込み失敗した写真を確認します。

公開前に main の更新を再確認し、競合する変更を上書きしないでください。
表示ファイルを変更した場合は index.html の対応する v= の値も更新します。
