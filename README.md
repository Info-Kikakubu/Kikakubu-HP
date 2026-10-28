# Kikakubu-HP — デー祭2026

デーサイ企画部の大学祭HPです。2026年10月28日に、Figmaで作成したレイアウトを反映しました。

- **公開ページ**：[デー祭2026](https://info-kikakubu.github.io/Kikakubu-HP/)
- **編集するリポジトリ**：[Info-Kikakubu/Kikakubu-HP](https://github.com/Info-Kikakubu/Kikakubu-HP)
- **公開元**：`main` ブランチ / リポジトリ直下
- **ローカル編集先**：このリポジトリを取得した `Kikakubu-HP` フォルダ

HTML・CSS・JavaScriptによる静的サイトです。ReactやViteのインストールは公開・通常の編集に必要ありません。公開URLは従来と同じです。

## 現在の画面

1. ターミナル風の起動演出
2. 固定タイトル、学部エンブレム、開催日時のバナー
3. 食堂の横長カードと、4つの展示・上映カード
4. お知らせ・注意事項・団体紹介・SNSリンクの4つの折りたたみ
5. 右下に固定したSNS・アクセスボタン

企画カードや右下のボタンから、詳細モーダルを開きます。モーダルはPC・スマートフォンとも中央に表示され、閉じるボタン、背景クリック、Escapeキーで閉じられます。表示中は背景スクロールを止め、閉じると元のボタンへフォーカスを戻します。

折りたたみは複数を同時に開けます。お知らせは更新日で並べ替えられます。OSの「動きを減らす」設定では起動待ちを省略し、アニメーションを抑えます。

現在は旧サイドバーや固定写真スライドショーを表示していません。関連する旧ファイル・写真は残していますが、現行画面の編集先ではありません。

## 編集するファイル

| 編集したい内容 | ファイル |
| --- | --- |
| メインタイトル・開催日時バナー・告知文 | [content/title.js](content/title.js) |
| 企画カードの並び・見出し・サムネイル・エンブレム | [content/ui.js](content/ui.js) |
| 展示会・食堂・上映の説明、料金、注文方法、注意事項 | [content/projects.js](content/projects.js) |
| お知らせの日時・タイトル・本文 | [content/news.js](content/news.js) |
| 全体の注意事項 | [content/notices.js](content/notices.js) |
| 団体紹介 | [content/about.js](content/about.js) |
| SNSのアカウント・リンク・アイコン | [content/links.js](content/links.js) |
| アクセスマップ・説明・出典 | [content/access.js](content/access.js) |
| カード・モーダル・折りたたみ・アニメーションの処理 | [scripts/ui.js](scripts/ui.js) |
| 現行レイアウト・余白・文字サイズ・演出 | [styles/ui.css](styles/ui.css) |
| エメラルド系の配色・フォント・背景 | [styles/theme.css](styles/theme.css) |
| 共通の基本スタイル | [styles/main.css](styles/main.css) |
| 読み込むファイルとキャッシュ更新用の値 | [index.html](index.html) |

### 開催日時バナー

`content/title.js` の `announcementDate`、`announcementTime`、`announcementNote`、`announcementCatchcopy` を編集します。

`date`、`time`、`venue` は別の開催概要欄に使う項目で、現在は空欄です。これらへ記入すると概要欄が表示されます。`introduction` も現在は空欄です。

### 企画カードと本文の対応

`content/ui.js` の `panels` がカードの設定です。

| 設定 | 用途 |
| --- | --- |
| `id` | 重複しないカードID |
| `project` | `projects.js` の `items` の番号（0始まり） |
| `title` / `eyebrow` | カードとモーダルの見出し・補助タイトル |
| `description` | モーダルに表示する補足文 |
| `thumbnail` / `thumbnailAlt` | サムネイル画像のパス・代替テキスト |
| `icon` | サムネイル未指定時のアイコン |
| `accent` | `#43b991` のような6桁の色コード |
| `span: 2` | 食堂のようにカードを2列分の幅にする |

現在のカードは「デー祭食堂」「CampusQuest」「クソゲー再現」「プログラミング教養を兼ねたゲーム体験」「対談動画上映」の5枚です。

詳細本文は `content/projects.js` から読み込みます。展示の3カードは同じ `project: 0` を参照しているため、この説明を変えると3カードすべての共通案内が変わります。個別の本文を設ける場合は `projects.js` に項目を追加し、対応する `project` の番号を変更してください。

### 折りたたみ・SNS・アクセス

- `content/ui.js` の `additionalInfo` で、折りたたみの表示順・見出し・補足文を編集します。
- `source` は `news`、`notices`、`about`、`links` など、表示処理と既存データとの対応名です。
- `number`、`title`、`lead`、`body`、`notes` を設定でき、配列へ追加すると項目も増えます。`notes` は補足タグの配列です。
- `snsPanel` と `mapPanel` は右下のボタンで開くモーダルの見出し等です。SNSの実データは `links.js`、地図は `access.js` で編集します。

## GitHubで文章・画像を更新する

1. [リポジトリ](https://github.com/Info-Kikakubu/Kikakubu-HP)を開き、上の表から編集対象を選びます。
2. ファイル右上の鉛筆アイコン「Edit this file」を押します。
3. 文章や設定を変更します。引用符・カンマ・括弧は消さないでください。
4. 「Commit changes...」で内容を確認し、変更理由を入力して保存します。
5. `main` への保存は公開対象です。確認中の作業は別ブランチで進められます。
6. [Actions](https://github.com/Info-Kikakubu/Kikakubu-HP/actions)で `pages build and deployment` の成功を確認します。
7. [公開ページ](https://info-kikakubu.github.io/Kikakubu-HP/)で表示と操作を確認します。

JavaScriptの文字列内で改行するときは `\n` を使います。項目を追加するときは配列内の `{ ... }` を複製し、項目の間にカンマを入れてください。文章はHTMLとして解釈せず、そのまま表示します。

画像は先に `assets/` 内へアップロードし、`./assets/画像名.png` のように `index.html` 基準の相対パスを記入します。カード画像やエンブレムもこの方式です。`assets/slideshow/` には現行カードで使う画像も入っています。

### 古い表示が残る場合

表示に使うJS・CSSを変更したときは、`index.html` の対応する `?v=...` の値も新しくします。画像を同名で差し替える場合は、JSやCSSに書いた画像URLの `?v=...` も更新します。未指定の場合は追加できます。

例：

```html
<link rel="stylesheet" href="./styles/ui.css?v=oct28b">
<script defer src="./scripts/ui.js?v=oct28b"></script>
```

Windowsでは `Ctrl + Shift + R` で再読み込みできます。スマートフォンでは一度ページを閉じて開き直してください。

## ローカルで確認・ビルドする

Node.jsとpnpmが使える環境で、このフォルダを開いて実行します。

```powershell
pnpm build
```

このビルドは依存ライブラリのインストール不要です。JavaScript構文、読み込み先、カード設定などを検証し、`dist/` へ静的サイト一式を出力します。

GitHub Pagesの公開元は引き続きリポジトリ直下です。`dist/` のコミットやPages設定の変更は不要です。`dist/`、`tmp/`、`node_modules/` はGitの対象外です。

ブラウザーで手動確認する場合は、フォルダ一式を保持したまま `index.html` を開きます。ファイルを単体で別の場所へ移動すると、画像やデータを読み込めません。Google Fontsが読み込めない環境ではシステムの等幅フォントへ切り替わります。

### UIの自動検証

Playwrightと対応ブラウザーが使える環境で実行します。

```powershell
pnpm test:ui
```

実行対象は [tests/figma-ui.cjs](tests/figma-ui.cjs) です。Playwrightが未導入の場合は開発用に追加し、ブラウザーを用意してください。

```powershell
pnpm add -D playwright
pnpm exec playwright install chromium
pnpm test:ui
```

既存のChromeや共有ランタイムを使う場合は、`CHROME_PATH` にブラウザー実行ファイル、`NODE_PATH` にPlaywrightを含む `node_modules` の絶対パスを指定できます。

テストでは次を確認します。

- 1280 / 1024 / 768 / 390 / 320pxのレイアウト
- 企画カード、SNS、アクセスのモーダル
- 閉じるボタン・背景クリック・Escape、フォーカス復帰、背景スクロール停止
- 複数の折りたたみとお知らせの並べ替え
- 掲載内容と画像の読み込み、文字サイズ200%
- 起動演出と開閉・並べ替えアニメーション
- JavaScript無効時に起動画面が残らないこと

## Figma版の取り込みと関連資料

Figmaの書き出し元は、隣接する `Kikakubu-HP-figma-build` フォルダです。2026年10月28日の取り込みでは、その `index.html` と `public/` 内の表示ファイルを既存サイトへ反映しました。通常の更新は、このリポジトリ内のファイルを編集します。Figma側で再編集しただけでは公開ページは変わりません。

- [Figmaレイアウト反映の記録](docs/Figmaレイアウト反映.md)
- [UI編集ガイド](docs/UI編集ガイド.md)
- [当初のUI仕様書](docs/UI仕様書.md)

旧ファイルの `scripts/main.js`、`scripts/slideshow.js`、`content/tabs.js`、`content/slideshow.js` と `tests/ui.cjs` は保持していますが、現行の入口・テストでは使いません。旧資料と現在の画面が異なる場合は、このREADMEとFigma反映記録を優先してください。

## 今後のHP開発予定（未実装の構想）

以下は将来のURL・フォルダ構成案です。現在の公開先は冒頭に記載したURLであり、この構想に合わせた移行は行っていません。




info-kikakubu.github.io/\
├─ index.html            ← 企画部トップ\
├─ about/\
│  └─ index.html         ← 企画部紹介\
└─ de-sai/\
   ├─ index.html         ← デー祭の総合案内\
   └─ 2026/\
      ├─ index.html      ← 現在のデー祭HP\
      ├─ map.html\
      ├─ assets/\
      ├─ content/\
      ├─ scripts/\
      └─ styles/\
