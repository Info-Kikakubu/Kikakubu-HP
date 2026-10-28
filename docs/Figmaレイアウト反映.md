# Figmaレイアウトの反映（2026-10-28）

提供された Kikakubu-HP-figma-build の index.html と public/ 内の変更を、既存の静的サイトへ反映しました。
公開URLは https://info-kikakubu.github.io/Kikakubu-HP/ のままです。

## 現在の構成

- 起動演出・固定タイトル・学部エンブレムのアニメーション
- コード風の開催日時バナー、グリッド背景、エメラルド系の配色
- 食堂の横長カードと4つの展示・上映カード
- お知らせ・注意事項・団体紹介・SNSの4つの折りたたみ
- 右下にSNS・アクセスのクイックメニュー
- モーダルはPC・スマートフォンとも中央表示
- 動きを減らす設定では起動待ちを省略し、アニメーションを抑制

Figma版に合わせ、旧画面の固定写真スライドショーは表示しません。既存の写真・設定ファイルは保持しています。

## 編集箇所

- content/title.js: 開催日時・告知文
- content/ui.js: カード・サムネイル・学部エンブレム・折りたたみ設定
- content/projects.js、news.js、notices.js、about.js、links.js、access.js: 従来の本文とリンク
- scripts/ui.js: 画面の組み立てとアニメーション
- styles/theme.css / styles/ui.css: 配色・レイアウト・演出

Figma用のReact/Viteの雛形・開発用設定は、公開に不要なため持ち込んでいません。
ファイルへのパスは相対指定なので、従来のGitHub Pagesのサブパスで動作します。
更新した表示ファイルとエンブレムの参照にはキャッシュ更新用の値を付けています。
Google Fontsを読み込めない場合はシステムの等幅フォントへ切り替わります。

## 確認

`pnpm build` で静的ファイルの検証と dist/ への出力ができます。
`pnpm test:ui` は tests/figma-ui.cjs を実行します（Playwrightが必要）。
1280 / 1024 / 768 / 390 / 320px、各企画モーダル、SNS、アクセス、お知らせ並べ替え、複数の折りたたみ、文字サイズ200%、起動と開閉アニメーションを確認します。
旧UI用の tests/ui.cjs は履歴として残しています。
移行前のローカル表示ファイルは tmp/figma-before/ に保存しています（公開対象外）。
