/**
 * Screenshot helper for the Section 05 arena cards (and the search dialog /
 * mobile layout that consume the same arena data).
 *
 * Run through the `Visual check` workflow: GitHub Actions has a browser and
 * network access, this repo's dev sandbox has neither. `NODE_PATH` points at the
 * scratch playwright install.
 *
 * Every phase is wrapped so a partial failure still yields a report, and errors
 * are emitted as `::error::` annotations (the workflow log blobs are not always
 * reachable from the sandbox).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = process.env.OUT;
const URL = process.env.TARGET_URL;
const report = {};

function fail(phase, error) {
  const message = `${phase}: ${error && error.message ? error.message : error}`;
  report[`error:${phase}`] = message;
  console.log(`::error::${message.split("\n")[0].slice(0, 900)}`);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  process.exit(1);
}

async function open(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  } catch {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
  }
}

async function firstVisible(page, selector) {
  const all = page.locator(selector);
  const count = await all.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = all.nth(i);
    if (await candidate.isVisible()) return candidate;
  }
  throw new Error(`no visible element for ${selector} (found ${count})`);
}

async function arenaSection(page, theme) {
  await page.waitForSelector(".arena-grid", { timeout: 60000 });
  const section = page.locator(".arena-section");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await section.screenshot({ path: path.join(OUT, `arena-${theme}.png`) });

  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".arena-card")).map(card => {
      const img = card.querySelector(".arena-emblem img");
      return {
        name: card.querySelector("h3")?.textContent ?? null,
        emblem: img ? img.getAttribute("src") : "trophy-fallback",
        emblemLoaded: img ? img.naturalWidth > 0 : null,
        chips: Array.from(card.querySelectorAll(".arena-chip")).map(c => c.textContent.trim().replace(/\s+/g, " ")),
        featured: !!card.querySelector(".arena-featured"),
        height: Math.round(card.getBoundingClientRect().height),
      };
    })
  );
}

async function searchDialog(page) {
  const trigger = await firstVisible(page, 'button[aria-label="Search"]');
  await trigger.click();
  await page.waitForTimeout(700);

  const input = await firstVisible(page, 'input[placeholder*="Search tournaments"]');
  for (const query of ["arena", "refuge"]) {
    await input.fill(query);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `search-${query}.png`) });
    report[`search:${query}`] = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".egor-search-row"))
        .slice(0, 8)
        .map(row => ({
          text: row.textContent.replace(/\s+/g, " ").trim(),
          badge: row.querySelector(".egor-search-badge")?.textContent?.trim() ?? null,
        }))
    );
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
    try {
      await ctx.addInitScript(t => localStorage.setItem("theme", t), theme);
      const page = await ctx.newPage();
      page.on("console", m => m.type() === "error" && console.log(`[${theme}][console]`, m.text()));
      page.on("pageerror", e => console.log(`[${theme}][pageerror]`, e.message));
      page.on("response", r => r.status() >= 400 && console.log(`[${theme}][http]`, r.status(), r.url()));
      await open(page, URL);
      report[`arena-${theme}`] = await arenaSection(page, theme);
      console.log(`${theme}: arena section captured`);
    } catch (e) {
      await browser.close();
      fail(`arena-${theme}`, e);
    } finally {
      await ctx.close();
    }
  }

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  try {
    const page = await desktop.newPage();
    await open(page, URL);
    await searchDialog(page);
    console.log("search dialog captured");
  } catch (e) {
    await browser.close();
    fail("search-dialog", e);
  } finally {
    await desktop.close();
  }

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  try {
    const page = await mobile.newPage();
    await open(page, URL);
    await page.waitForSelector(".arena-grid", { timeout: 60000 });
    await page.locator(".arena-card").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT, "arena-mobile.png") });
    report.mobile = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      cards: Array.from(document.querySelectorAll(".arena-card")).map(c =>
        Math.round(c.getBoundingClientRect().height)
      ),
    }));
    console.log("mobile captured");
  } catch (e) {
    await browser.close();
    fail("mobile", e);
  } finally {
    await mobile.close();
  }

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(e => fail("unexpected", e));
