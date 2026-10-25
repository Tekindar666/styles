import type { ComponentPropsWithRef } from 'react';
export { ZenNav } from './nav.js';

const classes = (base: string, extra?: string) => [base, extra].filter(Boolean).join(' ');

type ThemeProps = ComponentPropsWithRef<'div'> & {
  mode: 'dark' | 'light';
  palette?: 'zen' | 'still';
};
export function ZenTheme({ mode, palette = 'zen', className, ...props }: ThemeProps) {
  return <div {...props} className={classes(classes(`zen-${mode}`, palette === 'still' ? 'zen-still' : ''), className)} />;
}

export function ZenContent({ className, ...props }: ComponentPropsWithRef<'main'>) {
  return <main {...props} className={classes('zen-content', className)} />;
}

type HeadingProps = ComponentPropsWithRef<'h2'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 };
export function ZenHeading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag {...props} className={classes('zen-heading', className)} />;
}

type TextProps = ComponentPropsWithRef<'p'> & { muted?: boolean };
export function ZenText({ muted = false, className, ...props }: TextProps) {
  return <p {...props} className={classes(classes('zen-text', muted ? 'zen-muted-text' : ''), className)} />;
}

export function ZenLink({ className, ...props }: ComponentPropsWithRef<'a'>) {
  return <a {...props} className={classes('zen-link', className)} />;
}

export function ZenButton({ className, type = 'button', ...props }: ComponentPropsWithRef<'button'>) {
  return <button {...props} type={type} className={classes('zen-button', className)} />;
}
