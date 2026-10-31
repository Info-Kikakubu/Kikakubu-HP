// まちベルの公開board APIと同期する文字表示。API側のCORS許可後に公開します。
(() => {
  "use strict";
  const projects = document.getElementById("projects");
  if (!projects) return;
  const origin = "https://machibell-food-court.gakusai-foodcourt.workers.dev";
  const shopId = "e9e92128-5842-4b2a-9ef8-cba6abf02a39";
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  const section = node("section", "", "yakisoba-live"); section.id = "yakisoba-live";
  section.setAttribute("aria-labelledby", "yakisoba-live-heading");
  const heading = node("h2", "焼きそば速報"); heading.id = "yakisoba-live-heading";
  const description = node("p", "待ち状況を確認できます！", "yakisoba-live-description");
  const list = node("dl", "", "yakisoba-counts");
  const outputs = [];
  for (const label of ["準備中", "受け取り出来ます"]) {
    const row = node("div", "", "yakisoba-count-row");
    const value = node("strong", "—", "yakisoba-count-number");
    const count = node("dd", "", "yakisoba-count-value");
    count.append(value, node("span", "人", "yakisoba-count-unit"));
    row.append(node("dt", label), count); list.append(row); outputs.push(value);
  }
  const status = node("p", "待ち状況を取得しています…", "yakisoba-live-status");
  status.setAttribute("role", "status");
  const link = node("a", "呼び出し画面を開く →", "yakisoba-live-link"); link.href = origin + "/display";
  section.append(heading, description, list, status, link); projects.before(section);
  let timer, controller, stopped = false, lastSuccess = 0;
  const formatTime = timestamp => new Intl.DateTimeFormat("ja-JP", {hour:"2-digit",minute:"2-digit",timeZone:"Asia/Tokyo"}).format(timestamp);
  async function refresh() {
    if (controller || stopped || document.hidden) return;
    clearTimeout(timer);
    controller = new AbortController();
    const timeout = setTimeout(() => controller?.abort(), 10000);
    try {
      const response = await fetch(origin + "/api/board", {cache:"no-store",credentials:"omit",signal:controller.signal});
      if (!response.ok) throw new Error("取得失敗");
      const data = await response.json();
      const shop = data.shops?.find(item => item.id === shopId);
      if (!shop || !Array.isArray(shop.cooking)) throw new Error("店舗データがありません");
      const pickup = shop.pickup ?? shop.tickets;
      if (!Array.isArray(pickup) || (shop.calling !== undefined && !Array.isArray(shop.calling))) throw new Error("受け取り状況が不正です");
      const ready = new Set([...(shop.calling ?? []), ...pickup]);
      outputs[0].textContent = String(shop.cooking.length);
      outputs[1].textContent = String(ready.size);
      lastSuccess = Date.now();
      status.textContent = `自動更新中・最終確認 ${formatTime(lastSuccess)}`;
      section.classList.remove("is-stale");
    } catch {
      // 通信できないときに0人と誤表示しません。
      outputs.forEach(output => { output.textContent = "—"; });
      status.textContent = lastSuccess ? `更新できません（最終確認 ${formatTime(lastSuccess)}）。呼び出し画面をご確認ください。` : "待ち状況を取得できません。呼び出し画面をご確認ください。";
      section.classList.add("is-stale");
    } finally {
      clearTimeout(timeout); controller = null;
      if (!stopped && !document.hidden) timer = setTimeout(refresh, 2000);
    }
  }
  document.addEventListener("visibilitychange", () => {
    clearTimeout(timer);
    if (!document.hidden) refresh();
  });
  window.addEventListener("online", refresh);
  window.addEventListener("pagehide", () => { stopped = true; clearTimeout(timer); controller?.abort(); });
  window.addEventListener("pageshow", () => { stopped = false; refresh(); });
  refresh();
})();
