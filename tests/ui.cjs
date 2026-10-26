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
    for (const width of [1280, 900, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(target);
      await page.locator(".event-panel").last().waitFor();
      const state = await page.evaluate(() => ({
        columns: getComputedStyle(document.querySelector(".panel-grid")).gridTemplateColumns.split(" ").length,
        cards: document.querySelectorAll(".event-panel").length,
        disclosures: document.querySelectorAll(".additional-info > details").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [...document.querySelectorAll(".event-panel")].some(e => e.scrollHeight > e.clientHeight + 1)
      }));
      assert.equal(state.columns, width >= 900 ? 4 : 2); assert.equal(state.cards, 4); assert.equal(state.disclosures, 4);
      assert.equal(state.overflow, false); assert.equal(state.clipped, false);
      for (let index = 0; index < 4; index++) {
        const card = page.locator(".event-panel").nth(index); await card.click();
        assert.equal(await page.locator("dialog").evaluate(e => e.open), true);
        assert.equal(await page.locator(".modal-close").evaluate(e => e === document.activeElement), true);
        assert.equal(await page.locator("body").evaluate(e => getComputedStyle(e).overflow), "hidden");
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
      const allText = normalize(await page.locator("body").textContent());
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
      await page.locator("#news > summary").click(); await page.locator("#festival-info > summary").click();
      assert.equal(await page.locator("#news").evaluate(e => e.open), true); assert.equal(await page.locator("#festival-info").evaluate(e => e.open), true);
      await page.locator("#news-sort").selectOption("asc");
      assert.equal(await page.locator(".news-items summary").first().textContent().then(normalize), normalize(raw.news.items[0].date + raw.news.items[0].title + "+"));
      await page.goto(target + "#slideshow"); assert.equal(await page.locator("#festival-info").evaluate(e => e.open), true);
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
    await page.goto(target); await page.locator("#festival-info > summary").click();
    await page.waitForFunction(() => document.querySelectorAll(".slideshow-image").length === 2 && [...document.querySelectorAll(".slideshow-image")].every(i => i.complete && i.naturalWidth > 0));
    assert.equal(await page.locator(".slideshow-image").count(), 2);
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log("PASS 200% text and missing-photo fallback; no JavaScript errors");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
