import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ZenTheme, ZenContent, ZenHeading, ZenText, ZenLink, ZenButton, ZenNav } from '../src/index.js';
import '../zen/styles.css';

function Preview() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [page, setPage] = useState('About');
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <ZenTheme mode={mode} style={{ minHeight: '100vh' }}>
      <ZenContent>
        <ZenNav aria-label="Main navigation" style={{ marginBottom: 48 }}>
          {['About', 'Work', 'Projects', 'Blog'].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} aria-current={page === label ? 'page' : undefined}
              onClick={() => setPage(label)}>{label}</a>
          ))}
        </ZenNav>
        <ZenHeading level={1}>Zen</ZenHeading>
        <ZenText>A quiet starting point for personal websites. System fonts, readable content, and a restrained palette.</ZenText>
        <ZenText muted>Secondary text provides context without competing with the main content.</ZenText>
        <ZenText><ZenLink href="#example">Explore the example</ZenLink></ZenText>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <ZenButton ref={buttonRef} id="toggle" aria-pressed={mode === 'light'}
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>Light mode</ZenButton>
          <ZenButton disabled>Unavailable</ZenButton>
        </div>
        <section id="example" style={{ marginTop: 64 }}>
          <ZenHeading>Built for content</ZenHeading>
          <ZenText>Use Tab to explore keyboard focus. Hover or select a navigation link to move the highlight.</ZenText>
        </section>
      </ZenContent>
    </ZenTheme>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Preview /></StrictMode>);
