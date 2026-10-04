import type { JSX } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { ContentCard, ContentDetail } from './types';

export function CatalogState({
  name,
  message,
}: {
  name: string;
  message: string;
}): JSX.Element {
  return (
    <section className="component bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-6xl rounded-2xl bg-muted px-6 py-10 shadow-[0_8px_30px_rgba(20,16,12,0.06)]">
        <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{name}</p>
        <p className="mt-3 max-w-2xl text-lg">{message}</p>
      </div>
    </section>
  );
}

export function CatalogHeading({
  heading,
  introduction,
  isEditing,
  eyebrow,
  appearance = 'default',
}: {
  heading?: Field<string>;
  introduction?: Field<string>;
  isEditing?: boolean;
  eyebrow: string;
  appearance?: 'default' | 'kfmb';
}): JSX.Element {
  if (appearance === 'kfmb') {
    return (
      <div className="relative text-center">
        <p
          aria-hidden
          className="font-[family-name:var(--brand-script-font,cursive)] text-6xl leading-none md:text-7xl"
          style={{ color: 'var(--brand-highlight, #f5c451)' }}
        >
          {eyebrow}
        </p>
        {heading && (heading.value || isEditing) && (
          <Text
            tag="h1"
            field={heading}
            className="-mt-3 text-3xl font-bold uppercase tracking-[0.16em] md:text-4xl"
            style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}
          />
        )}
        {introduction && (introduction.value || isEditing) && (
          <Text
            tag="p"
            field={introduction}
            className="mx-auto mt-4 max-w-2xl text-base leading-7"
            style={{ color: 'var(--brand-fg)', fontFamily: 'var(--brand-body-font)' }}
          />
        )}
      </div>
    );
  }
  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      {heading && (heading.value || isEditing) && (
        <Text tag="h2" field={heading} className="mt-3 font-sans text-4xl tracking-tight text-foreground md:text-5xl" />
      )}
      {introduction && (introduction.value || isEditing) && (
        <Text tag="p" field={introduction} className="mt-4 text-lg text-muted-foreground" />
      )}
    </div>
  );
}

export function CardGrid({
  cards,
  appearance = 'default',
}: {
  cards?: ContentCard[];
  appearance?: 'default' | 'kfmb';
}): JSX.Element {
  const safeCards = (cards ?? []).filter((card) => card?.id && card.title && card.href);
  if (safeCards.length === 0) {
    return <p className="mt-8 text-base text-muted-foreground">Nothing is published in this list yet.</p>;
  }
  return (
    <ul className={cn('mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3', appearance === 'kfmb' && 'gap-4')}>
      {safeCards.map((card) => (
        <li key={card.id}>
          <a
            href={card.href}
            className={cn(
              'group flex h-full flex-col overflow-hidden bg-white text-card-foreground',
              appearance === 'kfmb'
                ? 'border border-[var(--brand-border)] transition-transform duration-200 hover:-translate-y-0.5'
                : 'rounded-2xl shadow-[0_12px_40px_rgba(20,16,12,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1',
              'motion-reduce:transition-none motion-reduce:hover:transform-none'
            )}
          >
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt=""
                className={cn(
                  'w-full object-cover',
                  appearance === 'kfmb' ? 'aspect-square object-contain p-6' : 'aspect-[4/3]'
                )}
                style={appearance === 'kfmb' ? { backgroundColor: 'var(--brand-bg)' } : undefined}
              />
            ) : (
              <div className={cn('w-full', appearance === 'kfmb' ? 'aspect-square' : 'aspect-[4/3] bg-secondary')} style={appearance === 'kfmb' ? { backgroundColor: 'var(--brand-bg)' } : undefined} />
            )}
            <div className="flex flex-1 flex-col gap-2 p-5">
              {card.category && (
                <p
                  className={cn('text-xs uppercase tracking-[0.14em]', appearance === 'kfmb' ? 'font-bold' : 'text-muted-foreground')}
                  style={{ color: appearance === 'kfmb' ? 'var(--brand-accent)' : undefined }}
                >
                  {card.category}
                </p>
              )}
              <h3
                className={cn('text-xl tracking-tight', appearance === 'kfmb' && 'text-base font-bold uppercase tracking-[0.08em]')}
                style={appearance === 'kfmb' ? { color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' } : undefined}
              >
                {card.title}
              </h3>
              {card.summary && (
                <p className={cn('text-sm leading-6', appearance === 'kfmb' ? '' : 'text-muted-foreground')} style={appearance === 'kfmb' ? { color: 'var(--brand-fg)' } : undefined}>
                  {card.summary}
                </p>
              )}
              {appearance === 'kfmb' && (
                <span
                  className="mt-auto inline-flex w-fit items-center rounded-[var(--brand-button-radius,9999px)] px-5 py-2 text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-accent-foreground)' }}
                >
                  View
                </span>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function DetailView({
  detail,
  appearance = 'default',
}: {
  detail?: ContentDetail;
  appearance?: 'default' | 'kfmb';
}): JSX.Element {
  if (!detail?.title) {
    return <p className="text-lg text-muted-foreground">This item is not available.</p>;
  }
  const properties = detail.properties ?? [];
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      {detail.imageUrl ? (
        <img
          src={detail.imageUrl}
          alt=""
          className={cn(
            'aspect-[4/3] w-full object-cover',
            appearance === 'kfmb' ? 'rounded-none' : 'rounded-3xl shadow-[0_16px_50px_rgba(20,16,12,0.1)]'
          )}
        />
      ) : (
        <div className={cn('aspect-[4/3] bg-secondary', appearance === 'kfmb' ? 'rounded-none' : 'rounded-3xl')} />
      )}
      <div>
        {detail.category && (
          <p
            className={
              appearance === 'kfmb'
                ? 'font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none'
                : 'text-sm uppercase tracking-[0.16em] text-muted-foreground'
            }
            style={appearance === 'kfmb' ? { color: 'var(--brand-highlight)' } : undefined}
          >
            {detail.category}
          </p>
        )}
        <h1
          className={cn('mt-3 font-sans text-4xl tracking-tight md:text-6xl', appearance === 'kfmb' && 'text-3xl font-bold uppercase tracking-[0.12em] md:text-5xl')}
          style={appearance === 'kfmb' ? { color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' } : undefined}
        >
          {detail.title}
        </h1>
        {detail.body && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{detail.body}</p>}
        {properties.length > 0 && (
          <dl className={cn('mt-8 grid gap-4 sm:grid-cols-2', appearance === 'kfmb' && 'grid-cols-1 gap-0 border-t sm:grid-cols-1')} style={appearance === 'kfmb' ? { borderColor: 'var(--brand-border)' } : undefined}>
            {properties.map((property) => (
              <div key={property.label} className={appearance === 'kfmb' ? 'grid grid-cols-[9rem_1fr] gap-4 border-b py-3' : undefined} style={appearance === 'kfmb' ? { borderColor: 'var(--brand-border)' } : undefined}>
                <dt className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: appearance === 'kfmb' ? 'var(--brand-primary)' : undefined }}>{property.label}</dt>
                <dd className="mt-1 text-base" style={appearance === 'kfmb' ? { color: 'var(--brand-fg)', marginTop: 0 } : undefined}>{property.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
