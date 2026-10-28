const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const target = process.env.TEST_URL || pathToFileURL(path.join(root, "index.html")).href;
const screenshots = path.join(root, "tmp", "figma-preview");
const normalize = value => value.replace(/\s+/g, " ").trim();
(async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = []; page.on("pageerror", e => errors.push(e.message));
    for (const width of [1280, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(target);
      await page.waitForFunction(() => !document.querySelector("#boot-screen"));
      assert.equal(await page.locator(".event-panel").count(), 5);
      assert.equal(await page.locator(".additional-info > details").count(), 4);
      assert.equal(await page.locator(".event-panel-wide").count(), 1);
      const layout = await page.evaluate(() => ({
        columns: getComputedStyle(document.querySelector(".panel-grid")).gridTemplateColumns.split(" ").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [...document.querySelectorAll(".event-panel")].filter(e => e.scrollHeight > e.clientHeight + 2).map(e => e.id)
      }));
      assert.equal(layout.columns, width >= 900 ? 4 : 2); assert.equal(layout.overflow, false); assert.deepEqual(layout.clipped, []);
      for (const img of await page.locator(".panel-thumbnail img, .title-emblem, .event-thumbnail-emblem").all()) await img.evaluate(i => i.decode());
      let text = "";
      for (let index = 0; index < 5; index++) {
        const card = page.locator(".event-panel").nth(index); await card.click();
        assert.equal(await page.locator("dialog").evaluate(e => e.open), true);
        assert.equal(await page.locator(".modal-close").evaluate(e => e === document.activeElement), true);
        assert.equal(await page.locator("body").evaluate(e => getComputedStyle(e).overflow), "hidden");
        text += " " + await page.locator(".modal-body").textContent();
        const rect = await page.locator("dialog").boundingBox();
        assert.ok(Math.abs(rect.x + rect.width / 2 - await page.evaluate(() => innerWidth / 2)) < 12);
        if (index === 0) await page.locator(".modal-close").click();
        else if (index === 1) await page.mouse.click(2, 2);
        else await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog").open && !document.body.classList.contains("modal-open"));
        assert.equal(await card.evaluate(e => e === document.activeElement), true);
      }
      const raw = await page.evaluate(() => window.festivalContent);
      text = normalize(text + " " + await page.locator("body").textContent());
      const preserved = [raw.title.heading, raw.title.announcementDate, raw.title.announcementTime, raw.title.announcementNote, raw.title.announcementCatchcopy, raw.about.heading, raw.about.body];
      raw.projects.items.forEach(item => preserved.push(...["title", "description", "orderInstructions", "location", "price", "payment", "notes"].map(k => item[k]), ...(item.exhibits || [])));
      raw.news.items.forEach(item => preserved.push(item.title, item.body, item.date));
      raw.notices.items.forEach(item => preserved.push(item.title, item.body));
      preserved.filter(Boolean).forEach(value => assert.ok(text.includes(normalize(value)), "Missing content: " + value));
      await page.locator("#news > summary").click(); await page.locator("#notices > summary").click();
      assert.equal(await page.locator("#news").evaluate(e => e.open), true); assert.equal(await page.locator("#notices").evaluate(e => e.open), true);
      await page.locator("#news-sort").selectOption("asc");
      assert.ok((await page.locator(".news-items summary").first().textContent()).includes(raw.news.items[0].date));
      for (const name of ["sns", "map"]) {
        await page.locator("#quick-" + name).click();
        if (name === "sns") assert.equal(await page.locator(".modal-body .sns-link").count(), raw.links.items.length);
        else { await page.locator(".modal-body img").evaluate(i => i.decode()); assert.ok((await page.locator(".modal-body").textContent()).includes(raw.access.description)); }
        await page.keyboard.press("Escape"); await page.waitForFunction(() => !document.querySelector("dialog").open);
      }
      await page.goto(target); await page.screenshot({ path: path.join(screenshots, "home-" + width + ".png"), fullPage: true });
      console.log("PASS " + width + "px: Figma layout, all content, images, dialogs, focus, sorting and disclosures");
    }
    await page.setViewportSize({ width: 390, height: 900 }); await page.goto(target);
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "200% text horizontal overflow");
    const animated = await browser.newPage({ reducedMotion: "no-preference", viewport: { width: 390, height: 900 } });
    animated.on("pageerror", e => errors.push(e.message));
    await animated.goto(target);
    await animated.waitForFunction(() => !document.querySelector("#boot-screen"));
    await animated.locator("#news > summary").click();
    await animated.waitForFunction(() => document.querySelector("#news").open && document.querySelector("#news .info-body").style.overflow === "");
    await animated.locator("#news-sort").selectOption("asc");
    await animated.waitForFunction(() => !document.querySelector("#news-sort").disabled);
    await animated.locator("#news > summary").click();
    await animated.waitForFunction(() => !document.querySelector("#news").open);
    await animated.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await animated.waitForFunction(() => !document.querySelector(".event-thumbnail-flying") || getComputedStyle(document.querySelector(".event-thumbnail-flying")).opacity === "0");
    await animated.screenshot({ path: path.join(screenshots, "animated-mobile.png") });
    const nojs = await browser.newPage({ javaScriptEnabled: false }); await nojs.goto(target);
    assert.equal(await nojs.locator("#boot-screen").isVisible(), false, "No-JS overlay fallback");
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log("PASS animated boot, sorting, disclosure animation, 200% text and no-JS fallback");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
