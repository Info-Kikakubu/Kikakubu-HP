// 依存ライブラリ不要。既存の静的ファイルを検証して dist/ へ出力します。
import { readFile, readdir, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "dist");
const context = vm.createContext({ window: {} });
for (const folder of ["content", "scripts"]) {
  for (const file of await readdir(path.join(root, folder))) {
    if (!file.endsWith(".js")) continue;
    const source = await readFile(path.join(root, folder, file), "utf8");
    new vm.Script(source, { filename: folder + "/" + file });
    if (folder === "content") vm.runInContext(source, context);
  }
}
const html = await readFile(path.join(root, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="(\.\/(?:styles|scripts|content)\/[^"?]+)(?:\?[^" ]*)?"/g)) {
  await readFile(path.join(root, match[1]));
}
const ui = context.window.festivalContent.ui;
if (!ui?.panels?.length || !ui.additionalInfo?.length) throw Error("UIの項目が設定されていません。");
const ids = ui.panels.map(item => item.id);
if (new Set(ids).size !== ids.length) throw Error("カードIDが重複しています。");
for (const item of ui.panels) {
  if (!context.window.festivalContent.projects.items[item.project]) throw Error("企画データが見つかりません: " + item.id);
}
async function copy(relative) {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  await mkdir(path.join(output, relative), { recursive: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) await copy(name);
    else await copyFile(path.join(root, name), path.join(output, name));
  }
}
await mkdir(output, { recursive: true });
await copyFile(path.join(root, "index.html"), path.join(output, "index.html"));
for (const folder of ["content", "styles", "scripts", "assets"]) await copy(folder);
console.log("PASS: JavaScript / 参照ファイル / UIデータを検証し、dist/ に静的サイトを出力しました。");
