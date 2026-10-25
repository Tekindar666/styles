# @tekindar666/styles

Minimal React 19 components with Zen styling. The dark palette and typography come from the portfolio; the light palette and action button are new designs. Not published yet.

## Usage

Load the CSS once in your app entry point (or Next.js root layout):

```tsx
import '@tekindar666/styles/zen/styles.css';
import {
  ZenTheme, ZenContent, ZenHeading, ZenText, ZenLink, ZenButton, ZenNav,
} from '@tekindar666/styles/zen';

<ZenTheme mode={isDark ? 'dark' : 'light'}>
  <ZenContent>
    <ZenNav aria-label="Main navigation">
      <a href="/" aria-current="page">About</a>
      <a href="/work">Work</a>
    </ZenNav>
    <ZenHeading level={1}>Hello</ZenHeading>
    <ZenText>Welcome to my site.</ZenText>
    <ZenText muted>A little more context.</ZenText>
    <ZenLink href="/about">About me</ZenLink>
    <ZenButton onClick={handleClick}>Get in touch</ZenButton>
  </ZenContent>
</ZenTheme>
```

All components accept native props, refs, and `className`. React 19 is required for ref props. `ZenContent` renders `<main>`; `ZenHeading` defaults to `<h2>` and accepts levels 1–6. `ZenText` renders `<p>`. `ZenButton` defaults to `type="button"`; pass `type="submit"` explicitly for forms.

`ZenTheme` renders a div, applies the palette, and inherits font defaults down its subtree. Your app owns mode selection, persistence, and system-preference detection. Nested themes work. Full-page wrappers can use `minHeight: '100vh'`; the package intentionally does not reset body margins.

## Still palette

Reuse Zen's components, typography, spacing, and behavior with a gray-green palette:

```tsx
<ZenTheme palette="still" mode="light">
  <ZenHeading>This week</ZenHeading>
  <ZenButton>Add meal</ZenButton>
</ZenTheme>
```

`palette` defaults to `"zen"`. Still supports both modes with three colors each:

| Mode | Background | Foreground | Muted / interaction |
| --- | --- | --- | --- |
| Light | `#F7F7F5` | `#303431` | `#606963` |
| Dark | `#171B18` | `#DCE1DC` | `#9AA89D` |

Still reuses these colors for borders and states rather than adding shades. Surfaces match the background. Buttons remain transparent at rest; hover uses the muted color with background-colored text. The sliding navigation indicator is outlined to keep link text readable as it moves. Nested wrappers reset the palette, including when returning to default Zen. The existing Tailwind utilities follow the selected palette.

The preview includes independent palette and mode toggles.

## Sliding navigation

`ZenNav` renders a native `<nav>` and a decorative indicator. Supply direct anchor children, including router components that render anchors. Mark at most one active link with `aria-current="page"`. Links remain ordinary navigation links, not tabs.

The indicator follows pointer hover or keyboard focus, returning to the current page afterward. Without an active or interacted-with link it hides. It handles link resizing, wrapping, label changes, active-page updates, and reduced motion. Touch pointers do not trigger hover tracking.

In Next.js, `ZenNav` is a Client Component; your layout and the simple wrappers can remain Server Components. Use an app-owned client wrapper with `usePathname()` to set `aria-current` on `next/link` children. The library has no router dependency. Interactive props such as `onClick` still need to originate in a Client Component.

The build preserves the navbar's `"use client"` directive and leaves React external. A full Next.js integration smoke test has not been run.

## Tailwind CSS v4

Use this in your app CSS instead of importing the plain stylesheet:

```css
@import 'tailwindcss';
@import '@tekindar666/styles/zen/tailwind.css';
```

Components accept utility classes, for example `<ZenButton className="px-8">Save</ZenButton>`. The adapter also supplies `bg-zen-background`, `text-zen-foreground`, `text-zen-muted`, and `border-zen-border`; these follow the nearest theme wrapper. Utilities override the component layer. Package source scanning is not required.

The adapter requires Tailwind v4. Plain styles do not require Tailwind. The previous class-string JavaScript exports have been replaced with React components; CSS class names are unchanged.

## Development

- `npm install`
- `npm run preview` → http://127.0.0.1:4173/zen/preview.html
- `npm test` → component rendering and Chromium interaction checks
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Browser tests use `CHROMIUM_PATH`, `/usr/bin/chromium` when available, or Playwright's installed Chromium. They create no screenshots or traces. The preview uses Vite to render the real React components; opening the HTML directly is not supported.
