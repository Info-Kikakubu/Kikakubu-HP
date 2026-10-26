const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const target = process.env.TEST_URL || pathToFileURL(path.join(root, "index.html")).href;
const screenshots = process.env.UI_SCREENSHOTS || path.join(root, "tmp", "ui-preview");
const normalize = text => text.replace(/\s+/g, " ").trim();
(async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    for (const width of [1280, 1024, 900, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(target);
      await page.locator(".event-panel").last().waitFor();
      const state = await page.evaluate(() => ({
        columns: getComputedStyle(document.querySelector(".panel-grid")).gridTemplateColumns.split(" ").length,
        cards: document.querySelectorAll(".event-panel").length,
        disclosures: document.querySelectorAll(".additional-info > details").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [...document.querySelectorAll(".event-panel")].some(e => e.scrollHeight > e.clientHeight + 1)
      }));
      assert.equal(state.columns, width >= 900 ? 4 : 2); assert.equal(state.cards, 5); assert.equal(state.disclosures, 3);
      assert.equal(state.overflow, false); assert.equal(state.clipped, false);
      assert.equal(await page.locator('.panel-thumbnail img').count(), 4);
      for (const img of await page.locator('.panel-thumbnail img, .title-emblem').all()) {
        await img.evaluate(i => i.decode());
        assert.ok(await img.evaluate(i => i.naturalWidth > 0));
      }
      const titleRect = await page.locator('.site-title-bar h1').boundingBox();
      const emblemRect = await page.locator('.title-emblem').boundingBox();
      assert.ok(emblemRect.x >= titleRect.x + titleRect.width, 'emblem is right of the title');
      assert.ok(Math.abs(emblemRect.y + emblemRect.height / 2 - titleRect.y - titleRect.height / 2) < 2);
      const food = await page.locator('#panel-food').boundingBox();
      const campus = await page.locator('#panel-campus-quest').boundingBox();
      const remake = await page.locator('#panel-game-remake').boundingBox();
      assert.ok(Math.abs(food.x - campus.x) < 2);
      assert.ok(Math.abs(food.x + food.width - remake.x - remake.width) < 2, 'food spans exactly two cards');
      assert.ok(food.y + food.height <= campus.y, 'food is above CampusQuest and remake');
      assert.ok(Math.abs(food.height - campus.height) < 2, 'food has one-card height');
      assert.equal(await page.locator('#festival-info').count(), 0);
      assert.equal(await page.locator('#slideshow').evaluate(e => e.parentElement.className), 'quick-menu');
      assert.equal(await page.locator('#title .slideshow').count(), 0);
      const preview = await page.locator('#slideshow').boundingBox();
      const sns = await page.locator('#quick-sns').boundingBox();
      const access = await page.locator('#quick-map').boundingBox();
      assert.ok(preview.x + preview.width < sns.x && sns.x + sns.width < access.x, 'slideshow is left of SNS and access');
      assert.ok(Math.abs(preview.height - sns.height * (width > 1024 ? 2 : 1)) < 2, 'responsive slideshow size');
      if (width <= 1024) assert.ok(Math.abs(preview.width - sns.width) < 2);
      assert.ok(Math.abs(preview.y + preview.height - sns.y - sns.height) < 2, 'bottom aligned');
      await page.waitForFunction(() => document.querySelectorAll('#slideshow .slideshow-image').length === 5);
      await page.locator('.slideshow-zoom').click();
      assert.equal(await page.locator('#modal-title').textContent(), '写真スライドショー');
      assert.equal(await page.locator('.modal-body #slideshow').count(), 1);
      assert.ok((await page.locator('#slideshow').boundingBox()).width > preview.width);
      const activeSrc = await page.locator('#slideshow .is-active').getAttribute('src');
      await page.locator('.slideshow-next').click();
      assert.notEqual(await page.locator('#slideshow .is-active').getAttribute('src'), activeSrc);
      const newSrc = await page.locator('#slideshow .is-active').getAttribute('src');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog').open && document.querySelector('.quick-menu #slideshow'));
      assert.equal(await page.locator('#slideshow .is-active').getAttribute('src'), newSrc, 'same image after closing enlargement');
      assert.equal(await page.locator('.slideshow-zoom').evaluate(e => e === document.activeElement), true);
      const border = await page.locator('#quick-map').evaluate(e => getComputedStyle(e).borderTopWidth);
      assert.equal(border, '2px');
      await page.evaluate(() => scrollTo(0, 500));
      assert.ok(Math.abs((await page.locator('#slideshow').boundingBox()).y - preview.y) < 2, 'slideshow stays fixed while scrolling');
      assert.ok(Math.abs((await page.locator('.site-title-bar').boundingBox()).y) < 2, 'title sticks to viewport top');
      await page.evaluate(() => scrollTo(0, 0));
      let modalText = '';
      for (let index = 0; index < 5; index++) {
        const card = page.locator(".event-panel").nth(index); await card.click();
        assert.equal(await page.locator("dialog").evaluate(e => e.open), true);
        assert.equal(await page.locator(".modal-close").evaluate(e => e === document.activeElement), true);
        assert.equal(await page.locator("body").evaluate(e => getComputedStyle(e).overflow), "hidden");
        modalText += ' ' + await page.locator('.modal-body').textContent();
        const project = await page.evaluate(i => window.festivalContent.projects.items[window.festivalContent.ui.panels[i].project], index);
        assert.ok(normalize(await page.locator('.modal-body').textContent()).includes(normalize(project.description)), 'original project description in modal');
        if (index === 0) {
          assert.ok((await page.locator('.modal-body').textContent()).includes('1食 500円'));
          assert.ok((await page.locator('.modal-body').textContent()).includes(project.orderInstructions));
          assert.ok((await page.locator('.modal-body').textContent()).includes(project.notes));
        }
        const b = await page.locator("dialog").boundingBox();
        if (width <= 600) assert.ok(Math.abs(b.y + b.height - 900) <= 2, "bottom sheet");
        else assert.ok(Math.abs((b.x + b.width / 2) - await page.evaluate(() => innerWidth / 2)) < 10, "centered dialog");
        if (index === 0) await page.locator(".modal-close").click();
        else if (index === 1) await page.mouse.click(2, 2);
        else await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog").open && !document.body.classList.contains("modal-open"));
        assert.equal(await card.evaluate(e => e === document.activeElement), true, "restore trigger focus");
      }
      const raw = await page.evaluate(() => window.festivalContent);
      const allText = normalize(await page.locator("body").textContent() + modalText);
      const retained = [raw.title.heading, raw.title.introduction, raw.title.date, raw.title.time, raw.title.venue, raw.news.heading, raw.notices.heading, raw.about.heading, raw.about.body];
      raw.news.items.forEach(item => retained.push(item.title, item.date, item.body));
      raw.projects.items.forEach(item => retained.push(...["title", "description", "orderInstructions", "date", "time", "location", "price", "participation", "payment", "notes"].map(key => item[key]), ...(item.exhibits || [])));
      raw.notices.items.forEach(item => retained.push(item.title, item.body));
      retained.filter(Boolean).forEach(text => assert.ok(allText.includes(normalize(text)), "Missing original content: " + text));
      for (const [selector, title] of [["#quick-sns", raw.links.heading], ["#quick-map", raw.access.heading]]) {
        await page.locator(selector).click(); assert.equal(await page.locator("#modal-title").textContent(), title);
        if (selector === "#quick-sns") {
          assert.equal(await page.locator(".sns-link").count(), raw.links.items.length);
          const snsText = normalize(await page.locator(".modal-body").textContent());
          raw.links.items.forEach(item => assert.ok(snsText.includes(normalize(item.account))));
        } else {
          assert.ok((await page.locator(".modal-body").textContent()).includes(raw.access.description));
          await page.locator(".modal-body img").evaluate(i => i.decode());
        }
        await page.keyboard.press("Escape"); await page.waitForFunction(() => !document.querySelector("dialog").open);
      }
      await page.locator("#news > summary").click(); await page.locator("#notices > summary").click();
      assert.equal(await page.locator("#news").evaluate(e => e.open), true); assert.equal(await page.locator("#notices").evaluate(e => e.open), true);
      await page.locator("#news-sort").selectOption("asc");
      assert.equal(await page.locator(".news-items summary").first().textContent().then(normalize), normalize(raw.news.items[0].date + raw.news.items[0].title + "+"));
      await page.goto(target + "#slideshow"); await page.waitForFunction(() => document.querySelector('dialog').open);
      await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog').open);
      await page.goto(target + "#access"); await page.waitForFunction(() => document.querySelector("dialog").open); await page.keyboard.press("Escape");
      await page.goto(target);
      await page.screenshot({ path: path.join(screenshots, "home-" + width + ".png"), fullPage: true });
      if ([1280, 390].includes(width)) {
        await page.locator(".event-panel").nth(2).click();
        await page.screenshot({ path: path.join(screenshots, "modal-" + width + ".png") });
        await page.keyboard.press("Escape");
      }
      console.log("PASS " + width + "px: cards, disclosures, all original text, modal close/focus/scroll, quick menu, legacy anchors");
    }
    await page.setViewportSize({ width: 390, height: 900 }); await page.goto(target);
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    const zoom = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, clipped: [...document.querySelectorAll(".event-panel")].some(e => e.scrollHeight > e.clientHeight + 1) }));
    assert.equal(zoom.overflow, false); assert.equal(zoom.clipped, false);
    // 公開元で既に削除されている写真を再アップロードせず、失敗時の表示を検証します。
    await page.addInitScript(() => {
      const decode = HTMLImageElement.prototype.decode;
      HTMLImageElement.prototype.decode = function () {
        if (/\/demo[234]\.jpg(?:\?|$)/.test(this.src)) return Promise.reject(new Error("Simulated missing image"));
        return decode.call(this);
      };
    });
    await page.goto(target);
    await page.waitForFunction(() => document.querySelectorAll(".slideshow-image").length === 5 && [...document.querySelectorAll(".slideshow-image")].every(i => i.complete && i.naturalWidth > 0));
    assert.equal(await page.locator(".slideshow-image").count(), 5);
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log("PASS 200% text and missing-photo fallback; no JavaScript errors");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
