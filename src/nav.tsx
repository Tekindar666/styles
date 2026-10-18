'use client';

import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from 'react';

/** Supply anchor children and mark the current page with aria-current="page". */
export function ZenNav({ children, className, ref, ...props }: ComponentPropsWithRef<'nav'>) {
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => navRef.current!, []);

  useEffect(() => {
    const nav = navRef.current!;
    const pill = pillRef.current!;
    let hovered: HTMLAnchorElement | null = null;
    let focused: HTMLAnchorElement | null = null;
    let frame = 0;

    function linkFrom(target: EventTarget | null) {
      if (!(target instanceof Element)) return null;
      const link = target.closest<HTMLAnchorElement>('a[href]');
      return link?.closest('nav') === nav ? link : null;
    }

    function position() {
      if (hovered && !nav.contains(hovered)) hovered = null;
      if (focused && !nav.contains(focused)) focused = null;
      const link = hovered ?? focused ?? nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
      pill.style.visibility = link ? 'visible' : 'hidden';
      if (!link) return;
      pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.height = `${link.offsetHeight}px`;
    }

    function onPointerOver(event: PointerEvent) {
      if (event.pointerType === 'touch') return;
      hovered = linkFrom(event.target);
      position();
    }
    function onPointerLeave() {
      hovered = null;
      position();
    }
    function onFocusIn(event: FocusEvent) {
      focused = linkFrom(event.target);
      hovered = null;
      position();
    }
    function onFocusOut(event: FocusEvent) {
      focused = linkFrom(event.relatedTarget);
      position();
    }

    const resize = new ResizeObserver(position);
    function observeLinks() {
      resize.disconnect();
      resize.observe(nav);
      nav.querySelectorAll('a[href]').forEach((link) => resize.observe(link));
      position();
    }
    const mutations = new MutationObserver(observeLinks);
    mutations.observe(nav, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['aria-current', 'href'],
    });
    nav.addEventListener('pointerover', onPointerOver);
    nav.addEventListener('pointerleave', onPointerLeave);
    nav.addEventListener('focusin', onFocusIn);
    nav.addEventListener('focusout', onFocusOut);
    observeLinks();
    // Place the initial indicator before enabling its movement animation.
    frame = requestAnimationFrame(() => { pill.dataset.ready = 'true'; });
    return () => {
      cancelAnimationFrame(frame);
      delete pill.dataset.ready;
      resize.disconnect();
      mutations.disconnect();
      nav.removeEventListener('pointerover', onPointerOver);
      nav.removeEventListener('pointerleave', onPointerLeave);
      nav.removeEventListener('focusin', onFocusIn);
      nav.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <nav {...props} ref={navRef} className={['zen-nav', className].filter(Boolean).join(' ')}>
      <span ref={pillRef} className="zen-nav-indicator" aria-hidden="true" />
      {children}
    </nav>
  );
}
