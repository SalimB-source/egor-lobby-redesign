/**
 * Screenshot helper for the Section 05 arena cards (and the search dialog that
 * consumes the same arena data). Run through the `Visual check` workflow:
 * GitHub Actions has a browser and network access, this repo's dev sandbox does
 * not. `NODE_PATH` points at the scratch playwright install.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = process.env.OUT;
const URL = process.env.TARGET_URL;

async function arenaSection(page, theme) {
  await page.waitForSelector(".arena-grid", { timeout: 60000 });
  const section = page.locator(".arena-section");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await section.screenshot({ path: path.join(OUT, `arena-${theme}.png`) });

  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".arena-card")).map(card => ({
      name: card.querySelector("h3")?.textContent ?? null,
      emblem: card.querySelector(".arena-emblem img")?.getAttribute("src") ?? "trophy-fallback",
      emblemLoaded: card.querySelector(".arena-emblem img")
        ? card.querySelector(".arena-emblem img").naturalWidth > 0
        : null,
      chips: Array.from(card.querySelectorAll(".arena-chip")).map(c => c.textContent.trim().replace(/\s+/g, " ")),
      featured: !!card.querySelector(".arena-featured"),
      height: Math.round(card.getBoundingClientRect().height),
    }))
  );
}

async function searchDialog(page) {
  await page.getByRole("button", { name: "Search", exact: true }).first().click();
  await page.waitForTimeout(600);
  const input = page.locator('input[placeholder*="Search tournaments"]');
  await input.fill("arena");
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "search-dialog.png") });

  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".egor-search-row"));
    return rows.slice(0, 8).map(row => ({
      text: row.textContent.replace(/\s+/g, " ").trim(),
      badge: row.querySelector(".egor-search-badge")?.textContent?.trim() ?? null,
    }));
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = {};

  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
    await ctx.addInitScript(t => localStorage.setItem("theme", t), theme);
    const page = await ctx.newPage();
    page.on("console", m => m.type() === "error" && console.log(`[${theme}][console]`, m.text()));
    page.on("pageerror", e => console.log(`[${theme}][pageerror]`, e.message));
    page.on("response", r => r.status() >= 400 && console.log(`[${theme}][http]`, r.status(), r.url()));

    await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
    report[`arena-${theme}`] = await arenaSection(page, theme);
    await ctx.close();
  }

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  report.search = await searchDialog(page);
  await ctx.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const mPage = await mobile.newPage();
  await mPage.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await mPage.waitForSelector(".arena-grid", { timeout: 60000 });
  await mPage.locator(".arena-card").first().scrollIntoViewIfNeeded();
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: path.join(OUT, "arena-mobile.png") });
  report.mobileWidth = await mPage.evaluate(() => document.documentElement.scrollWidth);
  await mobile.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => {
  console.error("shots failed:", e);
  process.exit(1);
});
