import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const kfmbPill =
  'inline-flex items-center justify-center rounded-[var(--brand-button-radius,9999px)] px-8 py-2.5 text-sm font-semibold tracking-wide text-[var(--brand-accent-foreground,#fff)] transition-opacity hover:opacity-90';

export function KfmbScript({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <p
      aria-hidden={typeof children === 'string'}
      className={cn(
        'font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none md:text-7xl',
        className
      )}
      style={{ color: 'var(--brand-highlight, #f5c451)' }}
    >
      {children}
    </p>
  );
}

const KFMB_SOCIAL = [
  { label: 'Facebook', mark: 'f' },
  { label: 'Instagram', mark: '◎' },
  { label: 'X', mark: '𝕏' },
  { label: 'YouTube', mark: '▷' },
  { label: 'LinkedIn', mark: 'in' },
];

export function KfmbSocialRow({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {KFMB_SOCIAL.map((item) => (
        <a
          key={item.label}
          href="https://www.kuwaitflourmills.com/Home"
          aria-label={item.label}
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-accent-foreground)' }}
        >
          {item.mark}
        </a>
      ))}
    </div>
  );
}

export function KfmbTitle({
  children,
  className,
  light,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}): JSX.Element {
  return (
    <div
      className={cn(
        'text-3xl font-bold uppercase tracking-[0.16em] sm:text-4xl',
        className
      )}
      style={{
        fontFamily: 'var(--brand-heading-font, inherit)',
        color: light ? 'var(--brand-primary-foreground, #fff)' : 'var(--brand-primary, #1e5b9e)',
      }}
    >
      {children}
    </div>
  );
}
