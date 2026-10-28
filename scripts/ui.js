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
    calendar: "M6 2v4m12-4v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
    location: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    news: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
    notices: "M12 3 2.5 20h19L12 3Zm0 6v5m0 3h.01",
    about: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    sns: "M18 6 6 12l12 6M21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    map: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  };
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    if (["expand-icon", "link-arrow"].includes(className)) node.setAttribute("aria-hidden", "true");
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
  function eventOverview() {
    const overview = el("section", "", "event-overview");
    overview.setAttribute("aria-label", "開催概要");
    [
      ["date", "開催日", "calendar"],
      ["time", "開催時間", "clock"],
      ["venue", "会場", "location"]
    ].forEach(([key, label, iconName]) => {
      if (!title[key]?.trim()) return;
      const item = el("div", "", "event-fact event-fact-" + key);
      const iconBox = el("span", "", "event-fact-icon"); iconBox.append(icon(iconName));
      const copy = el("span", "", "event-fact-copy");
      copy.append(el("span", label, "event-fact-label"), el("strong", title[key], "event-fact-value"));
      item.append(iconBox, copy); overview.append(item);
    });
    return overview;
  }
  function eventAnnouncement() {
    if (!title.announcementDate?.trim() && !title.announcementTime?.trim()) return null;
    const board = el("section", "", "event-announcement");
    board.setAttribute("aria-label", "開催日時のお知らせ");
    const functionOpen = el("span", "festivalThumbnail({", "event-function-call event-function-open");
    const functionClose = el("span", "}); // rendered", "event-function-call event-function-close");
    functionOpen.setAttribute("aria-hidden", "true");
    functionClose.setAttribute("aria-hidden", "true");
    board.append(functionOpen);
    if (url(ui.titleEmblem?.src)) {
      const emblemShell = el("span", "", "event-thumbnail-emblem-shell");
      const emblem = el("img", "", "event-thumbnail-emblem");
      emblem.src = url(ui.titleEmblem.src);
      emblem.alt = ui.titleEmblem.alt || "";
      emblemShell.append(emblem);
      board.append(emblemShell);
    }
    const viewport = el("div", "", "announcement-viewport");
    if (title.announcementCatchcopy?.trim()) {
      const catchcopy = el("p", "", "event-thumbnail-catchcopy");
      catchcopy.setAttribute("aria-label", title.announcementCatchcopy);
      const code = el("code", `print("${title.announcementCatchcopy}")`, "catchcopy-code");
      const output = el("span", title.announcementCatchcopy, "catchcopy-output");
      code.setAttribute("aria-hidden", "true");
      output.setAttribute("aria-hidden", "true");
      catchcopy.append(code, output);
      viewport.append(catchcopy);
    }
    const list = el("div", "", "announcement-list");
    const dateRow = el("p", "", "announcement-row");
    dateRow.append(el("span", "// 開催日：", "announcement-key"), el("strong", title.announcementDate, "announcement-value"));
    const timeRow = el("p", "", "announcement-row");
    timeRow.append(el("span", "// 開催時間：", "announcement-key"), el("strong", title.announcementTime, "announcement-value"));
    add(timeRow, "span", title.announcementNote, "announcement-note");
    list.append(dateRow, timeRow); viewport.append(list); board.append(viewport, functionClose);
    return board;
  }
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
        animateInfoDisclosure(details, summary, text);
      });
    }
    async function renderSorted() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        render();
        return;
      }
      select.disabled = true;
      const fadeOut = list.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(8px)" }
        ],
        { duration: 180, easing: "ease-in", fill: "forwards" }
      );
      await fadeOut.finished.catch(() => {});
      fadeOut.cancel();
      render();
      const animations = [...list.children].map((item, index) => item.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 360, delay: index * 55, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" }
      ).finished.catch(() => {}));
      await Promise.all(animations);
      select.disabled = false;
      select.focus({ preventScroll: true });
    }
    select.addEventListener("change", renderSorted); render();
    body.append(controls, list); return body;
  }
  function festivalBody() {
    const body = el("div", "", "content-stack");
    body.append(facts(title, eventKeys));
    add(body, "h3", data.projects?.heading);
    projects.forEach(item => {
      const details = el("details", "", "nested-disclosure");
      const summary = el("summary"); summary.append(el("span", item.title), el("span", "+", "expand-icon"));
      const container = el("div", "", "nested-body"); container.append(projectBody(item)); details.append(summary, container); body.append(details);
      animateInfoDisclosure(details, summary, container);
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
  const titleLink = el("a", "", "site-title-link");
  titleLink.href = "https://info-kikakubu.github.io/Kikakubu-HP/";
  titleLink.append(el("h1", title.heading || title.pageTitle));
  titleBar.append(titleLink);
  if (url(ui.titleEmblem?.src)) {
    const emblemLink = el("a", "", "title-emblem-link");
    emblemLink.href = "https://info-kikakubu.github.io/Kikakubu-HP/";
    emblemLink.setAttribute("aria-label", "デー祭2026公式サイトを開く");
    const emblem = el("img", "", "title-emblem");
    emblem.src = url(ui.titleEmblem.src); emblem.alt = ui.titleEmblem.alt || "";
    emblemLink.append(emblem);
    titleBar.append(emblemLink);
  }
  const announcement = eventAnnouncement();
  add(header, "p", title.introduction, "intro-copy multiline");
  const overview = eventOverview();
  if (overview.childElementCount) header.append(overview);
  const cards = el("section", "", "main-content"); cards.id = "projects";
  cards.setAttribute("aria-labelledby", "projects-heading");
  const heading = el("h2", data.projects?.heading || "企画内容"); heading.id = "projects-heading";
  cards.append(heading);
  const grid = el("div", "", "panel-grid"); cards.append(grid);
  const additional = el("section", "", "additional-info"); additional.id = "additional-info";
  additional.setAttribute("aria-labelledby", "additional-heading");
  const detailHeading = el("h2", "詳細情報 / README"); detailHeading.id = "additional-heading"; additional.append(detailHeading);
  const renderers = { news: newsBody, festival: festivalBody, notices: noticesBody, about: aboutBody, links: snsBody };
  const aliases = { festival: "festival-info", news: "news", notices: "notices", about: "about", links: "social-links" };
  const infoIcons = { news: "news", notices: "notices", about: "about", links: "sns", festival: "calendar" };
  function animateInfoDisclosure(details, summary, body) {
    let animation = null;
    summary.addEventListener("click", event => {
      event.preventDefault();
      animation?.cancel();
      const opening = !details.open;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        details.open = opening;
        if (opening) details.scrollIntoView({ block: "center" });
        else summary.scrollIntoView({ block: "center" });
        return;
      }

      if (opening) details.open = true;
      const styles = getComputedStyle(body);
      const fullHeight = body.scrollHeight;
      const paddingTop = styles.paddingTop;
      const paddingBottom = styles.paddingBottom;
      const frames = opening
        ? [
            { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0, transform: "translateY(-10px)" },
            { height: `${fullHeight}px`, paddingTop, paddingBottom, opacity: 1, transform: "translateY(0)" }
          ]
        : [
            { height: `${fullHeight}px`, paddingTop, paddingBottom, opacity: 1, transform: "translateY(0)" },
            { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0, transform: "translateY(-10px)" }
          ];

      body.style.overflow = "hidden";
      if (opening) details.scrollIntoView({ behavior: "smooth", block: "center" });
      else summary.scrollIntoView({ behavior: "smooth", block: "center" });
      animation = body.animate(frames, { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" });
      animation.addEventListener("finish", () => {
        if (!opening) details.open = false;
        animation?.cancel();
        animation = null;
        body.style.overflow = "";
      }, { once: true });
    });
  }
  (ui.additionalInfo || []).forEach((item, index) => {
    const details = el("details", "", "info-disclosure"); details.id = aliases[item.source] || "info-" + index;
    const summary = el("summary");
    const text = el("span", "", "info-heading"); text.append(el("span", item.title, "info-title")); add(text, "span", item.lead, "info-lead");
    const marker = el("span", "", "info-number");
    marker.append(icon(infoIcons[item.source] || "code"), el("span", item.number || String(index + 1).padStart(2, "0")));
    summary.append(marker, text, el("span", "+", "expand-icon"));
    const body = el("div", "", "info-body content-stack");
    if (renderers[item.source]) body.append(renderers[item.source]());
    add(body, "p", item.body, "multiline");
    if (item.notes?.length) { const tags = el("ul", "", "note-tags"); item.notes.forEach(note => tags.append(el("li", note))); body.append(tags); }
    details.append(summary, body); additional.append(details);
    animateInfoDisclosure(details, summary, body);
  });
  const footer = el("footer", "© " + (title.pageTitle || title.heading), "site-footer");
  root.replaceChildren(
    ...(announcement ? [announcement] : []),
    ...(header.childElementCount ? [header] : []),
    cards,
    additional,
    footer
  );
  root.before(titleBar);

  // 共通dialog：標準のフォーカストラップとEscape操作を利用します。
  const dialog = el("dialog", "", "detail-modal"); dialog.id = "detail-modal";
  dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-labelledby", "modal-title");
  const modalHeader = el("header", "", "modal-header");
  const modalTitles = el("div"); const eyebrow = el("p", "", "modal-eyebrow"); const modalTitle = el("h2"); modalTitle.id = "modal-title"; modalTitles.append(eyebrow, modalTitle);
  const close = el("button", "閉じる ×", "modal-close"); close.type = "button";
  modalHeader.append(modalTitles, close);
  const modalBody = el("div", "", "modal-body content-stack"); dialog.append(modalHeader, modalBody); document.body.append(dialog);
  let opener = null;
  function openModal(panel, body, trigger) {
    opener = trigger || document.activeElement;
    eyebrow.textContent = panel.eyebrow || ""; modalTitle.textContent = panel.title || "";
    dialog.style.setProperty("--panel-accent", accents.test(panel.accent) ? panel.accent : "#43b991");
    modalBody.replaceChildren(body);
    dialog.showModal(); document.body.classList.add("modal-open"); modalBody.scrollTop = 0; close.focus();
  }
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  (ui.panels || []).forEach((panel, index) => {
    const project = projects[panel.project] || {};
    const button = el("button", "", "event-panel"); button.type = "button"; button.id = "panel-" + panel.id;
    if (panel.span === 2) button.classList.add("event-panel-wide");
    button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-controls", dialog.id);
    button.style.setProperty("--panel-accent", accents.test(panel.accent) ? panel.accent : "#43b991");
    const top = el("span", "", "panel-top"); top.append(el("span", String(index + 1).padStart(2, "0"), "panel-number"));
    const illustration = el("span", "", panel.thumbnail ? "panel-thumbnail" : "panel-icon");
    if (url(panel.thumbnail)) {
      const thumbnail = el("img"); thumbnail.src = url(panel.thumbnail); thumbnail.alt = panel.thumbnailAlt || "";
      illustration.append(thumbnail);
    } else illustration.append(icon(panel.icon));
    const bottom = el("span", "", "panel-copy"); add(bottom, "span", panel.eyebrow, "panel-eyebrow"); bottom.append(el("span", panel.title || project.title, "panel-title"));
    button.append(top, illustration, bottom);
    button.addEventListener("click", () => {
      const body = el("div", "", "content-stack");
      if (url(panel.thumbnail)) {
        const thumbnail = el("img", "", "content-image modal-project-thumbnail");
        thumbnail.src = url(panel.thumbnail);
        thumbnail.alt = panel.thumbnailAlt || "";
        body.append(thumbnail);
      }
      add(body, "p", panel.description, "multiline");
      if (project.title && project.title !== panel.title) add(body, "h3", project.title);
      body.append(projectBody(project));
      openModal({ ...panel, title: panel.title || project.title }, body, button);
    });
    grid.append(button);
  });
  const quick = el("nav", "", "quick-menu"); quick.setAttribute("aria-label", "SNS・アクセス");
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
    if (id === "festival-info") id = "title";
    const target = document.getElementById(id);
    if (!target) return;
    let ancestor = target;
    while (ancestor) { if (ancestor.tagName === "DETAILS") ancestor.open = true; ancestor = ancestor.parentElement; }
    target.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", followHash);
  followHash();

  const revealTargets = [...root.querySelectorAll(
    ".event-announcement, .main-content, .additional-info, .event-panel, .info-disclosure"
  )];
  root.querySelectorAll(".event-panel").forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 5) * 70}ms`);
  });
  root.querySelectorAll(".info-disclosure").forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * 80}ms`);
  });
  revealTargets.forEach(item => item.classList.add("reveal-target"));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach(item => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
        if (entry.target.matches(".event-announcement")) {
          if (entry.isIntersecting && !document.body.classList.contains("booting")) playCatchcopyAnimation();
          else if (!entry.isIntersecting) resetCatchcopyAnimation();
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });
    revealTargets.forEach(item => revealObserver.observe(item));
  }

  function resetCatchcopyAnimation() {
    const catchcopy = document.querySelector(".event-thumbnail-catchcopy");
    catchcopy?.classList.remove("is-running", "is-result");
    document.querySelector(".event-announcement")?.classList.remove("is-function-running", "is-function-result");
  }
  function playCatchcopyAnimation() {
    const catchcopy = document.querySelector(".event-thumbnail-catchcopy");
    const thumbnail = document.querySelector(".event-announcement");
    if (!catchcopy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      catchcopy.classList.add("is-result");
      thumbnail?.classList.add("is-function-result");
      return;
    }
    catchcopy.classList.remove("is-running", "is-result");
    thumbnail?.classList.remove("is-function-running", "is-function-result");
    void catchcopy.offsetWidth;
    catchcopy.classList.add("is-running");
    thumbnail?.classList.add("is-function-running");
  }

  const thumbnailEmblem = document.querySelector(".event-thumbnail-emblem-shell");
  const headerEmblemLink = document.querySelector(".title-emblem-link");
  const headerEmblem = headerEmblemLink;
  if (
    thumbnailEmblem &&
    headerEmblem &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const flyingEmblem = thumbnailEmblem.cloneNode(true);
    flyingEmblem.className = "event-thumbnail-flying";
    flyingEmblem.alt = "";
    flyingEmblem.setAttribute("aria-hidden", "true");
    document.body.append(flyingEmblem);
    let emblemCollapsed = false;
    let flightAnimation = null;
    const frameFromRect = (rect, styles) => ({
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      padding: styles.padding,
      borderWidth: styles.borderWidth,
      borderRadius: styles.borderRadius,
      boxShadow: styles.boxShadow,
      opacity: 1
    });

    function animateEmblemFlight(toHeader) {
      const source = thumbnailEmblem.getBoundingClientRect();
      const target = headerEmblem.getBoundingClientRect();
      const sourceStyles = getComputedStyle(thumbnailEmblem);
      const targetStyles = getComputedStyle(headerEmblem);
      const sourceFrame = frameFromRect(source, sourceStyles);
      const targetFrame = {
        ...frameFromRect(target, targetStyles),
        padding: "0px",
        borderWidth: "0px",
        boxShadow: "none"
      };
      const start = flightAnimation
        ? frameFromRect(flyingEmblem.getBoundingClientRect(), getComputedStyle(flyingEmblem))
        : (toHeader ? sourceFrame : targetFrame);
      flightAnimation?.cancel();
      emblemCollapsed = toHeader;
      thumbnailEmblem.classList.add("is-flying");
      thumbnailEmblem.style.opacity = "0";
      headerEmblemLink.style.opacity = "0";
      headerEmblemLink.style.pointerEvents = "none";
      flyingEmblem.style.opacity = "1";

      const destination = toHeader ? targetFrame : sourceFrame;
      const animation = flyingEmblem.animate(
        [start, destination],
        { duration: 780, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "forwards" }
      );
      flightAnimation = animation;
      animation.addEventListener("finish", () => {
        if (flightAnimation !== animation) return;
        thumbnailEmblem.style.opacity = toHeader ? "0" : "1";
        if (!toHeader) thumbnailEmblem.classList.remove("is-flying");
        headerEmblemLink.style.opacity = toHeader ? "1" : "0";
        headerEmblemLink.style.pointerEvents = toHeader ? "auto" : "none";
        requestAnimationFrame(() => {
          if (flightAnimation !== animation) return;
          flyingEmblem.style.opacity = "0";
          animation.cancel();
          flightAnimation = null;
        });
      }, { once: true });
    }
    function evaluateEmblemPosition() {
      if (!emblemCollapsed && window.scrollY > 48) animateEmblemFlight(true);
      else if (emblemCollapsed && window.scrollY < 12) animateEmblemFlight(false);
    }
    thumbnailEmblem.classList.remove("is-flying");
    thumbnailEmblem.style.opacity = "1";
    flyingEmblem.style.opacity = "0";
    headerEmblemLink.style.opacity = "0";
    headerEmblemLink.style.pointerEvents = "none";
    window.addEventListener("scroll", evaluateEmblemPosition, { passive: true });
    window.addEventListener("resize", () => {
      if (flightAnimation) animateEmblemFlight(emblemCollapsed);
    });
    evaluateEmblemPosition();
  }

  const bootScreen = document.getElementById("boot-screen");
  if (bootScreen) {
    const finishBoot = () => {
      document.body.classList.remove("booting");
      bootScreen.remove();
      playCatchcopyAnimation();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishBoot();
    } else {
      const lines = [...bootScreen.querySelectorAll(".boot-line")];
      lines.forEach((line, index) => {
        window.setTimeout(() => line.classList.add("is-visible"), 120 + index * 350);
      });
      window.setTimeout(() => bootScreen.classList.add("is-complete"), 2150);
      window.setTimeout(finishBoot, 2500);
    }
  } else {
    document.body.classList.remove("booting");
    playCatchcopyAnimation();
  }

})();
