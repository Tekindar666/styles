import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ZenTheme, ZenButton } from '../dist/index.js';

test('Still colors, hover, disabled states and nested palette resets', async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    headless: true,
  });
  try {
    const page = await browser.newPage();
    const css = readFileSync(new URL('../zen/styles.css', import.meta.url), 'utf8');
    for (const [mode, background, foreground, muted] of [
      ['light', 'rgb(247, 247, 245)', 'rgb(48, 52, 49)', 'rgb(96, 105, 99)'],
      ['dark', 'rgb(23, 27, 24)', 'rgb(220, 225, 220)', 'rgb(154, 168, 157)'],
    ]) {
      const html = renderToStaticMarkup(h(ZenTheme, { mode, palette: 'still', id: 'outer' },
        h(ZenButton, { id: 'button' }, 'Add meal'),
        h(ZenButton, { id: 'disabled', disabled: true }, 'Unavailable'),
        h(ZenTheme, { mode: 'light', id: 'nested' }, h(ZenButton, { id: 'nested-button' }, 'Zen')),
      ));
      await page.setContent(`<style>${css}</style>${html}`);
      await page.mouse.move(600, 400);
      const styles = (selector) => page.locator(selector).evaluate((el) => {
        const style = getComputedStyle(el);
        return { background: style.backgroundColor, color: style.color };
      });
      assert.deepEqual(await styles('#outer'), { background, color: foreground });
      assert.deepEqual(await styles('#button'), { background: 'rgba(0, 0, 0, 0)', color: foreground });
      await page.locator('#button').hover();
      assert.deepEqual(await styles('#button'), { background: muted, color: background });
      await page.locator('#disabled').hover();
      assert.deepEqual(await styles('#disabled'), { background: 'rgba(0, 0, 0, 0)', color: muted });
      assert.deepEqual(await styles('#nested'), { background: 'rgb(250, 250, 250)', color: 'rgb(41, 41, 41)' });
      await page.locator('#nested-button').hover();
      assert.deepEqual(await styles('#nested-button'), { background: 'rgb(229, 229, 229)', color: 'rgb(41, 41, 41)' });
      await page.locator('#button').focus();
      assert.equal(await page.locator('#button').evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
    }
  } finally {
    await browser.close();
  }
});
