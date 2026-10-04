'use client';

import React, { JSX, useEffect, useState } from 'react';
import type { ComponentProps } from 'lib/component-props';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { ContentCard } from '@/lib/content-hub/types';

type ProductSearchFields = {
  Heading?: Field<string>;
};

type ProductSearchProps = ComponentProps & {
  fields?: ProductSearchFields;
};

function ProductSearchView({
  params,
  rendering,
  page,
  fields,
  appearance = 'default',
}: ProductSearchProps & { appearance?: 'default' | 'kfmb' }): JSX.Element {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [message, setMessage] = useState('');
  const isEditing = page?.mode?.isEditing;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setCards([]);
      setMessage('');
      return;
    }
    const handle = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/content-hub/search?kind=product&q=${encodeURIComponent(trimmed)}`);
        const payload = (await response.json()) as { items?: ContentCard[]; error?: string };
        const items = (payload.items ?? []).filter((card) => card?.id && card.title && card.href);
        setCards(items);
        if (payload.error) {
          setMessage(isEditing ? payload.error : 'Product search is unavailable right now.');
          return;
        }
        setMessage(items.length ? '' : 'No matching products.');
      } catch {
        setCards([]);
        setMessage('Product search is unavailable right now.');
      }
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query, isEditing]);

  const isKfmb = appearance === 'kfmb';

  return (
    <section
      className={`component px-4 py-12 text-foreground ${isKfmb ? '' : 'bg-background'} ${params.styles ?? ''}`}
      style={{ backgroundColor: isKfmb ? 'var(--brand-muted)' : undefined }}
      id={params.RenderingIdentifier || rendering.uid}
    >
      <div className={`mx-auto max-w-3xl ${isKfmb ? 'text-center' : ''}`}>
        {isKfmb ? (
          <p className="font-[family-name:var(--brand-script-font,cursive)] text-6xl leading-none" style={{ color: 'var(--brand-highlight)' }}>
            Products
          </p>
        ) : (
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Product search</p>
        )}
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text
            tag="h2"
            field={fields.Heading}
            className={isKfmb ? '-mt-2 text-3xl font-bold uppercase tracking-[0.14em]' : 'mt-3 text-3xl tracking-tight'}
            style={isKfmb ? { color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' } : undefined}
          />
        )}
        <label className="mt-6 block text-left">
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flour, pasta, oil..."
            className={
              isKfmb
                ? 'w-full bg-white px-5 py-4 text-base outline-none'
                : 'w-full rounded-full bg-muted px-5 py-4 text-base shadow-[0_8px_30px_rgba(20,16,12,0.06)] outline-none ring-ring focus-visible:ring-2'
            }
            style={isKfmb ? { border: '1px solid var(--brand-border)', color: 'var(--brand-fg)' } : undefined}
          />
        </label>
        {message && <p className="mt-4 text-left text-sm text-muted-foreground">{message}</p>}
        {cards.length > 0 && (
          <ul className={isKfmb ? 'mt-4 overflow-hidden bg-white text-left' : 'mt-4 overflow-hidden rounded-2xl bg-card shadow-[0_12px_40px_rgba(20,16,12,0.08)]'} style={isKfmb ? { border: '1px solid var(--brand-border)' } : undefined}>
            {cards.map((card) => (
              <li key={card.id}>
                <a href={card.href} className="block px-5 py-4 transition-colors duration-200 ease-out hover:bg-muted motion-reduce:transition-none">
                  <span className="block text-base font-semibold" style={isKfmb ? { color: 'var(--brand-primary)' } : undefined}>{card.title}</span>
                  {card.summary && <span className="mt-1 block text-sm text-muted-foreground">{card.summary}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export const Default = (props: ProductSearchProps): JSX.Element => <ProductSearchView {...props} />;

export const Kfmb = (props: ProductSearchProps): JSX.Element => <ProductSearchView {...props} appearance="kfmb" />;
