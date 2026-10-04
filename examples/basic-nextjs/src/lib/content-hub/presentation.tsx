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
}: {
  heading?: Field<string>;
  introduction?: Field<string>;
  isEditing?: boolean;
  eyebrow: string;
}): JSX.Element {
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

export function CardGrid({ cards }: { cards?: ContentCard[] }): JSX.Element {
  const safeCards = (cards ?? []).filter((card) => card?.id && card.title && card.href);
  if (safeCards.length === 0) {
    return <p className="mt-8 text-base text-muted-foreground">Nothing is published in this list yet.</p>;
  }
  return (
    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {safeCards.map((card) => (
        <li key={card.id}>
          <a
            href={card.href}
            className={cn(
              'group flex h-full flex-col overflow-hidden rounded-2xl bg-card text-card-foreground',
              'shadow-[0_12px_40px_rgba(20,16,12,0.08)] transition-transform duration-300 ease-out',
              'motion-reduce:transition-none motion-reduce:hover:transform-none hover:-translate-y-1'
            )}
          >
            {card.imageUrl ? (
              <img src={card.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] w-full bg-secondary" />
            )}
            <div className="flex flex-1 flex-col gap-2 p-5">
              {card.category && <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{card.category}</p>}
              <h3 className="text-xl tracking-tight">{card.title}</h3>
              {card.summary && <p className="text-sm text-muted-foreground">{card.summary}</p>}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function DetailView({ detail }: { detail?: ContentDetail }): JSX.Element {
  if (!detail?.title) {
    return <p className="text-lg text-muted-foreground">This item is not available.</p>;
  }
  const properties = detail.properties ?? [];
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      {detail.imageUrl ? (
        <img src={detail.imageUrl} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_16px_50px_rgba(20,16,12,0.1)]" />
      ) : (
        <div className="aspect-[4/3] rounded-3xl bg-secondary" />
      )}
      <div>
        {detail.category && <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{detail.category}</p>}
        <h1 className="mt-3 font-sans text-4xl tracking-tight md:text-6xl">{detail.title}</h1>
        {detail.body && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{detail.body}</p>}
        {properties.length > 0 && (
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {properties.map((property) => (
              <div key={property.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{property.label}</dt>
                <dd className="mt-1 text-base">{property.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
