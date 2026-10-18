import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ZenButton, ZenHeading, ZenText, ZenTheme } from '../dist/index.js';

test('components preserve native props and custom classes', () => {
  const html = renderToStaticMarkup(h(ZenTheme, { mode: 'light' },
    h(ZenHeading, { level: 1, id: 'title' }, 'Hello'),
    h(ZenText, { muted: true }, 'Context'),
    h(ZenButton, { disabled: true, className: 'px-8', 'aria-label': 'Save' }, 'Save'),
  ));
  assert.match(html, /class="zen-light"/);
  assert.match(html, /<h1 id="title" class="zen-heading">/);
  assert.match(html, /class="zen-text zen-muted-text"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-label="Save"/);
  assert.match(html, /type="button"/);
  assert.match(html, /class="zen-button px-8"/);
});
