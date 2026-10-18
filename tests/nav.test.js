import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { createServer } from 'vite';

test('navbar follows interaction, active state, and layout changes', async () => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      headless: true,
    });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${server.resolvedUrls.local[0]}zen/preview.html`);
    const nav = page.getByRole('navigation');
    const links = nav.getByRole('link');
    const pill = nav.locator('.zen-nav-indicator');
    async function aligned(label) {
      await page.waitForFunction((text) => {
        const link = [...document.querySelectorAll('nav a')].find((item) => item.textContent === text);
        const indicator = document.querySelector('.zen-nav-indicator');
        const a = link.getBoundingClientRect();
        const b = indicator.getBoundingClientRect();
        return getComputedStyle(indicator).visibility === 'visible' &&
          Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1 && Math.abs(a.width - b.width) < 1;
      }, label);
    }
    await aligned('About');
    await links.nth(1).hover();
    await aligned('Work');
    await page.mouse.move(0, 0);
    await aligned('About');
    await links.nth(0).focus();
    await page.keyboard.press('Tab');
    await aligned('Work');
    assert.equal(await links.nth(1).evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
    await page.keyboard.press('Enter');
    await page.locator('#toggle').focus();
    await aligned('Work');
    assert.equal(await links.nth(1).getAttribute('aria-current'), 'page');

    // A route update need not remount the navbar.
    await links.nth(1).evaluate((el) => el.removeAttribute('aria-current'));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.zen-nav-indicator')).visibility === 'hidden');
    await links.nth(3).evaluate((el) => el.setAttribute('aria-current', 'page'));
    await aligned('Blog');
    await page.setViewportSize({ width: 240, height: 800 });
    await aligned('Blog');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await links.nth(3).evaluate((el) => { el.textContent = 'Blog archive'; });
    await aligned('Blog archive');
    await links.nth(0).dispatchEvent('pointerover', { pointerType: 'touch' });
    await aligned('Blog archive');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await pill.evaluate((el) => getComputedStyle(el).transitionDuration), '0s');

    await page.locator('#toggle').click();
    assert.equal(await page.locator('.zen-light').count(), 1);
    const disabled = page.getByRole('button', { name: 'Unavailable' });
    assert.equal(await disabled.isDisabled(), true);
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
