// 元の呼び出し画面を直接読み込み、店舗名と準備中・受取可能の件数だけを表示します。
(() => {
  "use strict";
  const projects = document.getElementById("projects");
  if (!projects) return;
  const displayUrl = "https://machibell-food-court.gakusai-foodcourt.workers.dev/display";
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
  const viewport = node("div", "", "yakisoba-live-viewport");
  const stage = node("div", "", "yakisoba-live-stage");
  const frame = node("iframe", "", "yakisoba-live-frame");
  frame.src = displayUrl + "?shop=" + encodeURIComponent(shopId);
  frame.title = "デー祭食堂の準備中・受け取り可能の件数（自動更新）";
  frame.referrerPolicy = "no-referrer";
  frame.tabIndex = -1;
  // 周辺UIを含むiframeには直接入らず、リンクから元画面を操作できます。
  frame.setAttribute("aria-hidden", "true");
  const link = node("a", "呼び出し画面を開く →", "yakisoba-live-link");
  link.href = displayUrl;
  link.setAttribute("aria-label", "焼きそばの待ち状況を呼び出し画面で確認する");
  stage.append(frame); viewport.append(stage);
  section.append(heading, description, viewport, link);
  projects.before(section);
  // iframeの表示幅を固定することで、切り出す店舗枠の位置を安定させます。
  function resize() {
    const mobile = viewport.clientWidth <= 600;
    const width = mobile ? 376 : 846;
    // 件数見出しの下端まで表示し、番号一覧を含めません。
    const height = mobile ? 115.4375 : 129.34375;
    stage.style.width = `${width}px`;
    stage.style.height = `${height}px`;
    frame.style.width = mobile ? "400px" : "900px";
    frame.style.left = mobile ? "-12px" : "-27px";
    frame.style.top = mobile ? "-203.1875px" : "-206.9375px";
    const scale = viewport.clientWidth / width;
    stage.style.transform = `scale(${scale})`;
    viewport.style.height = `${height * scale}px`;
  }
  new ResizeObserver(resize).observe(viewport);
  resize();
})();
