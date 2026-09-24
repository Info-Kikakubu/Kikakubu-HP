# dasai-festival-HP

大学祭HPの編集用リポジトリです。

- 公開ページ：https://info-kikakubu.github.io/Kikakubu-HP/
- 公開元：main ブランチ / リポジトリ直下
- 掲載文言は content/、表示の組み立ては scripts/main.js、デザインは styles/main.css で管理します。

## 編集するファイル

| 編集内容 | ファイル |
| --- | --- |
| お知らせ | [content/news.js](content/news.js) |
| タイトル・ロゴ・冒頭紹介文 | [content/title.js](content/title.js) |
| タブの文言・順序・表示 | [content/tabs.js](content/tabs.js) |
| アクセスマップ・出典 | [content/access.js](content/access.js) |
| SNSなどのリンク | [content/links.js](content/links.js) |
| 企画内容 | [content/projects.js](content/projects.js) |
| 案内・注意事項 | [content/notices.js](content/notices.js) |
| デーサイ企画部の紹介 | [content/about.js](content/about.js) |
| 上部スライドショーの画像・順序・表示時間 | [content/slideshow.js](content/slideshow.js) |
| 全体の統合・本文の表示順 | [scripts/main.js](scripts/main.js) |
| 色・余白・文字サイズ | [styles/main.css](styles/main.css) |

## 構成

```text
index.html            ページの入口
content/
  news.js             お知らせ編集
  title.js            タイトル編集
  tabs.js             タブ編集
  access.js           アクセスマップ編集
  links.js            リンク編集
  projects.js         企画内容編集
  notices.js          案内・注意事項編集
  about.js            デーサイ企画部の紹介編集
  slideshow.js        スライドショー編集
scripts/
  main.js             上記の編集ファイルを統合
  slideshow.js        スライドショーの表示処理
styles/
  main.css            共通デザイン
assets/
  logo.png            ロゴ画像（既存の画像）
```

index.html が編集ファイルを順に読み込んだ後、main.js がページを組み立てます。ビルド操作は不要です。main ブランチは公開用のブランチ、main.js はページの統合処理であり、役割が異なります。

## 編集方法

以下は、GitHubの画面から文章や画像の設定を変更し、公開ページで確認するまでの手順です。

### 1. 編集するファイルを選ぶ

1. [GitHubリポジトリ](https://info-kikakubu.github.io/Kikakubu-HP/)を開きます。
2. このREADMEの「編集するファイル」表から、変更したい内容に対応するファイルを確認します。
3. GitHub上で `content` などのフォルダを開き、目的のファイル名を押します。

例：お知らせを変更するときは `content` → `news.js` の順に開きます。

### 2. 編集画面を開く

1. ファイルの内容が表示されたら、画面右上の鉛筆アイコン「Edit this file」を押します。
2. 文字を入力できる編集画面に切り替わったことを確認します。

鉛筆アイコンが表示されない場合は、GitHubにログインしているか、このリポジトリを編集できるアカウントかを確認してください。

### 3. 内容を書き換える

基本的には、`"` と `"` で囲まれた文章だけを書き換えます。

変更前：

```javascript
"title": "変更前のお知らせ"
```

変更後：

```javascript
"title": "新しいお知らせ"
```

- `"`、`:`、`,`、`{ }`、`[ ]` はプログラムの記号です。文章と一緒に消さないでください。
- 文章を空欄にするときは、引用符を残して `""` とします。
- 項目が1件もないときは、配列を `[]` のままにします。
- 企画や案内のファイルにあるコメント内の記入例は、公開ページには表示されません。

### 4. 項目を追加する

お知らせや企画などを追加するときは、`items: [ ]` の中にある `{ ... }` を1項目分まとめて複製します。

```javascript
items: [
  {
    "title": "1件目"
  },
  {
    "title": "2件目"
  }
]
```

- 項目と項目の間にはカンマ `,` が必要です。
- 最後の項目の後ろには、カンマを付けなくても構いません。
- `{` と `}` の数を変えないように注意してください。

### 5. 文章・画像・リンクを記入する

- 文章はHTMLとして解釈せず、入力した文字のまま表示します。
- 文章内で改行したい場所には `\n` を記入します。
- 画像は、先にGitHubの `assets` フォルダ内へアップロードします。
- 画像パスは `index.html` を基準に、`./assets/画像名.png` のように記入します。
- スライドショー画像は `./assets/slideshow/画像名.jpg` のように記入します。
- 外部サイトのリンクは `https://` から始まるURLを記入します。

### 6. 変更内容を保存する

1. 編集が終わったら、画面右上の「Commit changes...」を押します。
2. 「Commit message」に、何を変更したかを短く入力します。

   例：`お知らせの開催時間を修正`

3. すぐに公開してよい変更であることを確認します。
4. 「Commit directly to the main branch」が選択されていることを確認します。
5. 緑色の「Commit changes」を押します。

`main` ブランチへ保存すると、公開ページの更新処理が自動で始まります。内容が未確認の場合は保存しないでください。

### 7. 公開処理が成功したか確認する

1. リポジトリ上部の「Actions」を押します。
2. 一番上に表示される `pages-build-deployment` を確認します。
3. 黄色の丸は処理中です。緑色のチェックが付くまで待ちます。
4. 赤色の印が付いた場合は公開に失敗しているため、直前の編集内容を見直します。

### 8. 公開ページで確認する

1. [公開ページ](https://yoshikiosedo.github.io/dasai-festival-HP/)を開きます。
2. 編集した文章、画像、リンクが正しく表示されることを確認します。
3. 古い内容が表示される場合は、Windowsでは `Ctrl + Shift + R` を押して再読み込みします。スマートフォンではページを閉じてから開き直します。
4. 表示崩れや誤字があった場合は、同じ手順で元のファイルを再編集します。

ローカルで確認するときは、この構成一式を保持したまま `index.html` をブラウザーで開きます。`index.html` だけを別の場所へ移動すると、画像や各編集ファイルを読み込めません。

## タブと空欄の扱い

- 左上の「☰ メニュー」を押すと、左サイドバーにタブが展開します。各タブはページ内の項目へ移動するリンクです。
- 「閉じる ×」、背景クリック、Escapeキーで閉じられます。項目を選ぶとサイドバーを閉じて移動します。
- メニューボタンとサイドバー見出しは tabs.js の menuLabel / heading で編集できます。
- target は news / access / links / projects / notices / about から選びます。タブの順序は tabs.js の配列順です。
- enabled: false にするとタブ全体を非表示にできます。
- 企画は title、案内は title または body が記入されると表示します。リンクはURLとリンク文言が必要です。
- 本文のない項目と、その項目を指すタブは表示しません。未入力の項目は掲載しません。
- 本文の順序は main.js で「お知らせ → 企画内容 → アクセスマップ → 注意事項 → デーサイ企画部の紹介 → SNS」としています。

## 公開・運用

GitHub Pagesの設定は Settings → Pages → Deploy from a branch → main / (root) です。mainへの変更は公開対象になるため、確認前の編集は別ブランチで進め、確認後にmainへ統合できます。

掲載情報.md は原稿整理用です。変更を自動で取り込む仕組みはないため、確認した内容を対応する content/ のファイルへ反映します。未確定の内容や編集用メモは掲載しません。

企画の collapsible: true は開閉式表示です。企画固有の注意事項は projects.js の notes、全体の注意事項は notices.js で編集します。

## 上部スライドショー
- 写真は assets/slideshow/ に保存し、content/slideshow.js の items に画像パスを順番に記入します。
- 現在は demo1.jpg → demo2.jpg → demo3.jpg → demo4.jpg → demophoto1.jpg → demophoto2.jpg → demophoto3.jpg の順番です。
- interval: 6000 / transition: 1000 は、5秒静止＋1秒の切り替えです。
- 写真全体を中央に表示します。一時停止・再生ボタンで操作できます。
- 端末で動きを減らす設定をしている場合は停止状態から開始します。
- 表示処理は scripts/slideshow.js に分離しています。

## 今後のHP開発予定



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
