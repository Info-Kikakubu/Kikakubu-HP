// 各編集ファイルの内容を統合します。通常の文言編集は content/ で行います。
(() => {
  "use strict";
  const content = window.festivalContent || {};
  const root = document.getElementById("page");
  const sections = new Map();

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function safeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function addText(parent, tag, text, className) {
    if (text && text.trim()) parent.append(element(tag, text, className));
  }
  function addLink(parent, url, label) {
    const href = safeUrl(url);
    if (!href || !label) return;
    const link = element("a", label, "link-label");
    link.href = href;
    parent.append(link);
  }
  function section(id, heading) {
    const node = element("section", "", "section");
    node.id = id;
    const title = element("h2", heading);
    title.id = id + "-heading";
    node.setAttribute("aria-labelledby", title.id);
    node.append(title);
    sections.set(id, node);
    return node;
  }

  const title = content.title || {};
  if (title.pageTitle) document.title = title.pageTitle;
  const header = element("header", "", "page-header");
  const logoUrl = safeUrl(title.logo);
  const slideshow = window.createFestivalSlideshow?.(content.slideshow || {});
  if (slideshow) {
    header.append(slideshow);
  } else if (logoUrl) {
    const image = element("img", "", "logo");
    image.src = logoUrl;
    image.alt = title.logoAlt || "";
    header.append(image);
  }
  const heading = element("h1", title.heading || title.pageTitle || "大学祭宣伝", title.heading ? "" : "visually-hidden");
  header.append(heading);
  addText(header, "p", title.introduction, "multiline");
  const overview = element("dl", "", "event-details");
  [["festivalName", "名称"], ["date", "開催日"], ["time", "開催時間"], ["venue", "会場"]].forEach(([key, label]) => {
    if (title[key]?.trim()) overview.append(element("dt", label), element("dd", title[key]));
  });
  if (overview.childElementCount) header.append(overview);
  root.replaceChildren(header);

  const access = content.access || {};
  if (safeUrl(access.image)) {
    const block = section("access", access.heading || "アクセスマップ");
    const figure = element("figure", "", "access-map");
    const link = element("a");
    link.href = "./map.html";
    link.setAttribute("aria-label", "キャンパスマップを拡大して表示");
    const image = element("img", "", "map-image");
    image.src = safeUrl(access.image);
    image.alt = access.imageAlt || "キャンパスマップ";
    link.append(image);
    figure.append(link);
    addText(figure, "figcaption", access.credit, "map-credit");
    block.append(figure);
    addText(block, "p", access.description, "multiline");
  }

  const links = (content.links?.items || []).filter(item => safeUrl(item.url) && item.label);
  if (links.length) {
    const block = section("links", content.links.heading || "リンク");
    const list = element("div", "", "card-list social-grid");
    links.forEach(item => {
      const link = element("a", "", "social-link");
      link.href = safeUrl(item.url);
      const platform = element("span", "", "platform");
      if (safeUrl(item.icon)) {
        const icon = element("img", "", "social-icon");
        icon.src = safeUrl(item.icon);
        icon.alt = "";
        platform.append(icon);
      }
      addText(platform, "span", item.platform);
      link.append(platform);
      addText(link, "span", item.account, "account");
      addText(link, "span", item.label, "link-label");
      list.append(link);
    });
    block.append(list);
  }

  const news = (content.news?.items || []).filter(item => item.title?.trim());
  if (news.length) {
    const block = section("news", content.news.heading || "お知らせ");
    const controls = element("div", "", "news-controls");
    const label = element("label", "更新日順");
    label.htmlFor = "news-sort";
    const select = element("select");
    select.id = "news-sort";
    [["desc", "新しい順"], ["asc", "古い順"]].forEach(([value, text]) => {
      const option = element("option", text);
      option.value = value;
      select.append(option);
    });
    select.value = "desc";
    controls.append(label, select);
    const list = element("div", "", "card-list");
    function dateValue(value) {
      const parts = String(value || "").match(new RegExp("^([0-9]{4})[./-]([0-9]{1,2})[./-]([0-9]{1,2})$"));
      return parts ? Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : 0;
    }
    function renderNews() {
      const sorted = [...news].sort((a, b) => (select.value === "asc" ? 1 : -1) * (dateValue(a.date) - dateValue(b.date)));
      list.replaceChildren();
      sorted.forEach(item => {
        const card = element("details", "", "project-disclosure news-disclosure");
        const summary = element("summary");
        addText(summary, "h3", item.title);
        const body = element("div", "", "project-body");
        addText(body, "p", item.date, "news-date");
        addText(body, "p", item.body, "multiline");
        addLink(body, item.url, item.linkLabel || "詳しく見る");
        card.append(summary, body);
        list.append(card);
      });
    }
    select.addEventListener("change", renderNews);
    renderNews();
    block.append(controls, list);
  }

  const projects = (content.projects?.items || []).filter(item => item.title?.trim());
  if (projects.length) {
    const block = section("projects", content.projects.heading || "企画内容");
    const list = element("div", "", "card-list");
    projects.forEach(item => {
      const wrapper = element(item.collapsible ? "details" : "article", "", item.collapsible ? "project-disclosure" : "card");
      if (item.collapsible) {
        const summary = element("summary");
        addText(summary, "h3", item.title);
        wrapper.append(summary);
      } else {
        addText(wrapper, "h3", item.title);
      }
      const card = element("div", "", "project-body");
      if (safeUrl(item.image)) {
        const image = element("img", "", "project-image");
        image.src = safeUrl(item.image);
        image.alt = item.imageAlt || "";
        image.loading = "lazy";
        card.append(image);
      }
      addText(card, "p", item.description, "multiline");
      if (item.orderInstructions?.trim()) {
        addText(card, "h4", "注文方法", "subheading");
        addText(card, "p", item.orderInstructions, "multiline");
      }
      if (item.exhibits?.length) {
        addText(card, "h4", "展示物一覧", "subheading");
        const exhibits = element("div", "", "exhibit-list");
        item.exhibits.forEach(text => addText(exhibits, "p", text, "multiline"));
        card.append(exhibits);
      }
      const details = element("dl");
      [["date", "開催日"], ["time", "開催時間"], ["location", "場所"], ["price", "料金・価格"], ["participation", "参加方法"], ["payment", "支払方法"]].forEach(([key, label]) => {
        if (item[key]?.trim()) details.append(element("dt", label), element("dd", item[key]));
      });
      if (details.childElementCount) card.append(details);
      addLink(card, item.url, item.linkLabel);
      if (item.notes?.trim()) {
        addText(card, "h4", "注意事項", "subheading");
        addText(card, "p", item.notes, "multiline");
      }
      if (card.childElementCount) wrapper.append(card);
      list.append(wrapper);
    });
    block.append(list);
  }

  const notices = (content.notices?.items || []).filter(item => item.title?.trim() || item.body?.trim());
  if (notices.length) {
    const block = section("notices", content.notices.heading || "案内・注意事項");
    const list = element("div", "", "card-list");
    notices.forEach(item => {
      const card = element("article", "", "card");
      addText(card, "h3", item.title);
      addText(card, "p", item.body, "multiline");
      addLink(card, item.url, item.linkLabel);
      list.append(card);
    });
    block.append(list);
  }

  const about = content.about || {};
  if (about.body?.trim()) {
    const block = section("about", about.heading || "デーサイ企画部とはどんな集団？");
    addText(block, "p", about.body, "multiline");
  }

  // タブを、開閉できる左サイドバーにまとめます。
  const tabs = content.tabs || {};
  const visibleTabs = (tabs.items || []).filter(item => sections.has(item.target) && item.label);
  if (tabs.enabled && visibleTabs.length) {
    root.classList.add("has-sidebar");
    const opener = element("button", tabs.menuLabel || "☰ メニュー", "menu-toggle");
    opener.type = "button";
    opener.setAttribute("aria-controls", "site-sidebar");
    opener.setAttribute("aria-expanded", "false");
    opener.setAttribute("aria-haspopup", "dialog");

    const dialog = element("dialog", "", "sidebar");
    dialog.id = "site-sidebar";
    dialog.setAttribute("aria-labelledby", "sidebar-heading");
    const bar = element("div", "", "sidebar-header");
    const label = element("h2", tabs.heading || "メニュー");
    label.id = "sidebar-heading";
    const closer = element("button", "閉じる ×", "menu-close");
    closer.type = "button";
    bar.append(label, closer);
    const nav = element("nav", "", "sidebar-links");
    nav.setAttribute("aria-label", "ページ内ナビゲーション");
    visibleTabs.forEach(item => {
      const link = element("a", item.label);
      link.href = "#" + item.target;
      link.addEventListener("click", () => {
        dialog.close();
        // ダイアログを閉じてから、リンク先の見出しへフォーカスを移します。
        requestAnimationFrame(() => {
          const heading = sections.get(item.target).querySelector("h2");
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        });
      });
      nav.append(link);
    });
    dialog.append(bar, nav);
    opener.addEventListener("click", () => {
      dialog.showModal();
      opener.setAttribute("aria-expanded", "true");
      document.body.classList.add("sidebar-open");
      closer.focus();
    });
    closer.addEventListener("click", () => dialog.close());
    // 背景クリックで閉じます。Escape とフォーカス制御は dialog の標準動作です。
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      opener.setAttribute("aria-expanded", "false");
      document.body.classList.remove("sidebar-open");
    });
    root.append(opener, dialog);
  }
  // 掲載情報.mdの順：お知らせ → 企画内容 → アクセスマップ → 注意事項 → 企画部紹介 → SNS
  ["news", "projects", "access", "notices", "about", "links"].forEach(id => {
    if (sections.has(id)) root.append(sections.get(id));
  });
})();

