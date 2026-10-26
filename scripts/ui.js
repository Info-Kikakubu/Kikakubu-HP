// 既存の content/ を読み、UIだけを組み立てます。本文はHTMLとして解釈しません。
(() => {
  "use strict";
  const data = window.festivalContent || {};
  const ui = data.ui || {};
  const root = document.getElementById("page");
  const title = data.title || {};
  const projects = data.projects?.items || [];
  const accents = /^#[0-9a-f]{6}$/i;
  const paths = {
    food: "M4 11h16l-2 9H6l-2-9ZM3 11h18M8 3v5m4-5v5m4-5v5",
    quest: "M8 3h8v6l-4 3-4-3V3ZM12 12v9M6 17h12",
    game: "M7 7h10l4 9a3 3 0 0 1-5 3l-2-2h-4l-2 2a3 3 0 0 1-5-3L7 7ZM7 11v5M4.5 13.5h5M16 12h.01M18 15h.01",
    code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20",
    screening: "M3 5h18v12H3V5Zm6 16h6m-3-4v4M10 8l5 3-5 3V8Z",
    sns: "M18 6 6 12l12 6M21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    map: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  };
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    if (["expand-icon", "panel-arrow", "link-arrow"].includes(className)) node.setAttribute("aria-hidden", "true");
    return node;
  }
  function add(parent, tag, text, className) {
    if (text?.trim()) parent.append(el(tag, text, className));
  }
  function url(value) {
    if (!value) return "";
    try { const parsed = new URL(value, document.baseURI); return ["https:", "http:", "file:"].includes(parsed.protocol) ? parsed.href : ""; }
    catch { return ""; }
  }
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", paths[name] || paths.quest);
    svg.append(path);
    return svg;
  }
  function link(parent, value, label, className = "text-link") {
    if (!url(value) || !label) return;
    const node = el("a", label, className);
    node.href = url(value);
    parent.append(node);
  }
  function facts(item, keys) {
    const dl = el("dl", "", "facts");
    keys.forEach(([key, label]) => {
      if (item[key]?.trim()) dl.append(el("dt", label), el("dd", item[key]));
    });
    return dl;
  }
  const eventKeys = [["festivalName", "名称"], ["date", "開催日"], ["time", "開催時間"], ["venue", "会場"]];
  function projectBody(item, includeExhibits = true) {
    const body = el("div", "", "content-stack");
    if (url(item.image)) {
      const image = el("img", "", "content-image"); image.src = url(item.image); image.alt = item.imageAlt || ""; body.append(image);
    }
    add(body, "p", item.description, "multiline");
    if (item.orderInstructions?.trim()) { add(body, "h4", "注文方法"); add(body, "p", item.orderInstructions, "multiline"); }
    if (includeExhibits && item.exhibits?.length) {
      add(body, "h4", "展示物一覧");
      item.exhibits.forEach(text => add(body, "p", text, "multiline"));
    }
    const detail = facts(item, [["date", "開催日"], ["time", "開催時間"], ["location", "場所"], ["price", "料金・価格"], ["participation", "参加方法"], ["payment", "支払方法"]]);
    if (detail.childElementCount) body.append(detail);
    link(body, item.url, item.linkLabel);
    if (item.notes?.trim()) { add(body, "h4", "注意事項"); add(body, "p", item.notes, "multiline"); }
    return body;
  }
  function newsBody() {
    const body = el("div", "", "content-stack");
    add(body, "h3", data.news?.heading);
    const controls = el("div", "", "news-controls");
    const label = el("label", "更新日順"); label.htmlFor = "news-sort";
    const select = el("select"); select.id = "news-sort";
    [["desc", "新しい順"], ["asc", "古い順"]].forEach(([value, text]) => { const opt = el("option", text); opt.value = value; select.append(opt); });
    controls.append(label, select);
    const list = el("div", "", "news-items");
    function date(value) { const p = String(value || "").match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/); return p ? Date.UTC(+p[1], +p[2] - 1, +p[3]) : 0; }
    function render() {
      list.replaceChildren();
      [...(data.news?.items || [])].filter(item => item.title?.trim()).sort((a, b) => (select.value === "asc" ? 1 : -1) * (date(a.date) - date(b.date))).forEach(item => {
        const details = el("details", "", "nested-disclosure");
        const summary = el("summary"); summary.append(el("span", item.date, "news-date"), el("span", item.title), el("span", "+", "expand-icon"));
        const text = el("div", "", "content-stack nested-body"); add(text, "p", item.body, "multiline"); link(text, item.url, item.linkLabel || "詳しく見る");
        details.append(summary, text); list.append(details);
      });
    }
    select.addEventListener("change", render); render();
    body.append(controls, list); return body;
  }
  function festivalBody() {
    const body = el("div", "", "content-stack");
    body.append(facts(title, eventKeys));
    const slideshow = window.createFestivalSlideshow?.(data.slideshow || {});
    if (slideshow) { slideshow.id = "slideshow"; body.append(slideshow); }
    add(body, "h3", data.projects?.heading);
    projects.forEach(item => {
      const details = el("details", "", "nested-disclosure");
      const summary = el("summary"); summary.append(el("span", item.title), el("span", "+", "expand-icon"));
      const container = el("div", "", "nested-body"); container.append(projectBody(item)); details.append(summary, container); body.append(details);
    });
    return body;
  }
  function noticesBody() {
    const body = el("div", "", "content-stack"); add(body, "h3", data.notices?.heading);
    (data.notices?.items || []).forEach(item => { const article = el("article", "", "content-stack"); add(article, "h4", item.title); add(article, "p", item.body, "multiline"); link(article, item.url, item.linkLabel); body.append(article); });
    return body;
  }
  function aboutBody() {
    const body = el("div", "", "content-stack"); add(body, "h3", data.about?.heading); add(body, "p", data.about?.body, "multiline"); return body;
  }
  function snsBody() {
    const body = el("div", "", "sns-list");
    (data.links?.items || []).forEach(item => {
      if (!url(item.url)) return;
      const a = el("a", "", "sns-link"); a.href = url(item.url);
      if (url(item.icon)) { const img = el("img"); img.src = url(item.icon); img.alt = ""; a.append(img); }
      const text = el("span", "", "content-stack"); add(text, "strong", item.platform); add(text, "span", item.account); add(text, "span", item.label); a.append(text, el("span", "↗", "link-arrow")); body.append(a);
    });
    return body;
  }
  function mapBody() {
    const body = el("div", "", "content-stack"); const access = data.access || {};
    if (url(access.image)) {
      const figure = el("figure", "", "map-figure");
      const a = el("a"); a.href = url(access.image); a.setAttribute("aria-label", "キャンパスマップを拡大して表示");
      const img = el("img", "", "content-image"); img.src = url(access.image); img.alt = access.imageAlt || "キャンパスマップ"; a.append(img); figure.append(a);
      add(figure, "figcaption", access.credit); body.append(figure);
    }
    add(body, "p", access.description, "multiline"); return body;
  }

  document.title = title.pageTitle || "デー祭2026";
  root.className = "festival-page";
  const header = el("header", "", "site-intro"); header.id = "title";
  const titleBar = el("div", "", "site-title-bar");
  titleBar.append(el("h1", title.heading || title.pageTitle));
  if (url(ui.titleEmblem?.src)) {
    const emblem = el("img", "", "title-emblem");
    emblem.src = url(ui.titleEmblem.src); emblem.alt = ui.titleEmblem.alt || "";
    titleBar.append(emblem);
  }
  const slideshow = window.createFestivalSlideshow?.(data.slideshow || {});
  if (slideshow) slideshow.id = "slideshow";
  add(header, "p", title.introduction, "intro-copy multiline");
  const compactFacts = facts(title, eventKeys); compactFacts.classList.add("intro-facts"); header.append(compactFacts);
  const cards = el("section", "", "main-content"); cards.id = "projects";
  cards.setAttribute("aria-labelledby", "projects-heading");
  const heading = el("h2", data.projects?.heading || "企画内容"); heading.id = "projects-heading";
  cards.append(heading);
  const grid = el("div", "", "panel-grid"); cards.append(grid);
  const additional = el("section", "", "additional-info"); additional.id = "additional-info";
  additional.setAttribute("aria-labelledby", "additional-heading");
  const detailHeading = el("h2", "詳細情報"); detailHeading.id = "additional-heading"; additional.append(detailHeading);
  const renderers = { news: newsBody, festival: festivalBody, notices: noticesBody, about: aboutBody };
  const aliases = { festival: "festival-info", news: "news", notices: "notices", about: "about" };
  (ui.additionalInfo || []).forEach((item, index) => {
    const details = el("details", "", "info-disclosure"); details.id = aliases[item.source] || "info-" + index;
    const summary = el("summary");
    const text = el("span", "", "info-heading"); text.append(el("span", item.title, "info-title")); add(text, "span", item.lead, "info-lead");
    summary.append(el("span", item.number || String(index + 1).padStart(2, "0"), "info-number"), text, el("span", "+", "expand-icon"));
    const body = el("div", "", "info-body content-stack");
    if (renderers[item.source]) body.append(renderers[item.source]());
    add(body, "p", item.body, "multiline");
    if (item.notes?.length) { const tags = el("ul", "", "note-tags"); item.notes.forEach(note => tags.append(el("li", note))); body.append(tags); }
    details.append(summary, body); additional.append(details);
  });
  const footer = el("footer", "© " + (title.pageTitle || title.heading), "site-footer");
  root.replaceChildren(titleBar, header, cards, additional, footer);

  // 共通dialog：標準のフォーカストラップとEscape操作を利用します。
  const dialog = el("dialog", "", "detail-modal"); dialog.id = "detail-modal";
  dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-labelledby", "modal-title");
  const modalHeader = el("header", "", "modal-header");
  const modalTitles = el("div"); const eyebrow = el("p", "", "modal-eyebrow"); const modalTitle = el("h2"); modalTitle.id = "modal-title"; modalTitles.append(eyebrow, modalTitle);
  const close = el("button", "閉じる ×", "modal-close"); close.type = "button";
  modalHeader.append(modalTitles, close);
  const modalBody = el("div", "", "modal-body content-stack"); dialog.append(modalHeader, modalBody); document.body.append(dialog);
  let opener = null;
  let slideshowExpanded = false;
  let resumeSlideshow = false;
  function openModal(panel, body, trigger) {
    opener = trigger || document.activeElement;
    eyebrow.textContent = panel.eyebrow || ""; modalTitle.textContent = panel.title || "";
    dialog.style.setProperty("--panel-accent", accents.test(panel.accent) ? panel.accent : "#43b991");
    modalBody.replaceChildren(body);
    dialog.showModal(); document.body.classList.add("modal-open"); modalBody.scrollTop = 0; close.focus();
    const toggle = document.querySelector(".slideshow-toggle");
    resumeSlideshow = body !== slideshow && toggle?.getAttribute("data-paused") === "false";
    if (resumeSlideshow) toggle.click();
  }
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (slideshowExpanded) {
      slideshow.classList.add("slideshow-compact"); quick.prepend(slideshow); slideshowExpanded = false;
    }
    document.body.classList.remove("modal-open");
    if (resumeSlideshow) { document.querySelector(".slideshow-toggle")?.click(); resumeSlideshow = false; }
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  (ui.panels || []).forEach((panel, index) => {
    const project = projects[panel.project] || {};
    const button = el("button", "", "event-panel"); button.type = "button"; button.id = "panel-" + panel.id;
    if (panel.span === 2) button.classList.add("event-panel-wide");
    button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-controls", dialog.id);
    button.style.setProperty("--panel-accent", accents.test(panel.accent) ? panel.accent : "#43b991");
    const top = el("span", "", "panel-top"); top.append(el("span", String(index + 1).padStart(2, "0"), "panel-number"), el("span", "↗", "panel-arrow"));
    const illustration = el("span", "", panel.thumbnail ? "panel-thumbnail" : "panel-icon");
    if (url(panel.thumbnail)) {
      const thumbnail = el("img"); thumbnail.src = url(panel.thumbnail); thumbnail.alt = panel.thumbnailAlt || "";
      illustration.append(thumbnail);
    } else illustration.append(icon(panel.icon));
    const bottom = el("span", "", "panel-copy"); add(bottom, "span", panel.eyebrow, "panel-eyebrow"); bottom.append(el("span", panel.title || project.title, "panel-title"));
    button.append(top, illustration, bottom);
    button.addEventListener("click", () => {
      const body = el("div", "", "content-stack");
      add(body, "p", panel.description, "multiline");
      if (project.title && project.title !== panel.title) add(body, "h3", project.title);
      body.append(projectBody(project));
      openModal({ ...panel, title: panel.title || project.title }, body, button);
    });
    grid.append(button);
  });
  const quick = el("nav", "", "quick-menu"); quick.setAttribute("aria-label", "写真・SNS・アクセス");
  let slideshowZoom;
  function expandSlideshow() {
    if (!slideshow || dialog.open) return;
    slideshowExpanded = true; slideshow.classList.remove("slideshow-compact");
    openModal({ title: "写真スライドショー", eyebrow: "PHOTOS" }, slideshow, slideshowZoom);
  }
  if (slideshow) {
    slideshow.classList.add("slideshow-compact");
    slideshowZoom = el("button", "", "slideshow-zoom"); slideshowZoom.type = "button";
    slideshowZoom.setAttribute("aria-label", "写真スライドショーを拡大して表示");
    slideshowZoom.setAttribute("aria-haspopup", "dialog"); slideshowZoom.setAttribute("aria-controls", dialog.id);
    slideshowZoom.addEventListener("click", expandSlideshow);
    slideshow.querySelector(".slideshow-stage")?.append(slideshowZoom);
    quick.append(slideshow);
  }
  [["sns", ui.snsPanel, snsBody, "SNS", "SNSリンクを開く"], ["map", ui.mapPanel, mapBody, "アクセス", "地図・アクセスを開く"]].forEach(([name, panel, render, label, aria]) => {
    const button = el("button", "", "quick-button"); button.type = "button"; button.id = "quick-" + name;
    button.setAttribute("aria-label", aria); button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-controls", dialog.id);
    button.append(icon(name), el("span", label)); button.addEventListener("click", () => openModal(panel || {}, render(), button)); quick.append(button);
  });
  document.body.append(quick);
  const skip = document.querySelector(".skip-link"); skip?.addEventListener("click", () => { root.tabIndex = -1; root.focus(); });
  function followHash() {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (id === "access") { openModal(ui.mapPanel || {}, mapBody(), document.getElementById("quick-map")); return; }
    if (id === "links") { openModal(ui.snsPanel || {}, snsBody(), document.getElementById("quick-sns")); return; }
    if (id === "slideshow") { expandSlideshow(); return; }
    if (id === "festival-info") id = "title";
    const target = document.getElementById(id);
    if (!target) return;
    let ancestor = target;
    while (ancestor) { if (ancestor.tagName === "DETAILS") ancestor.open = true; ancestor = ancestor.parentElement; }
    target.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", followHash);
  followHash();
})();
