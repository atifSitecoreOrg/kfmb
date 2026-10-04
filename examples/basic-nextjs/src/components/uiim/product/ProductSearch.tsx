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

export const Default = ({ params, rendering, page, fields }: ProductSearchProps): JSX.Element => {
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

  return (
    <section className={`component bg-background px-4 py-12 text-foreground ${params.styles ?? ''}`} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Product search</p>
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text tag="h2" field={fields.Heading} className="mt-3 text-3xl tracking-tight" />
        )}
        <label className="mt-6 block">
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flour, pasta, oil..."
            className="w-full rounded-full bg-muted px-5 py-4 text-base shadow-[0_8px_30px_rgba(20,16,12,0.06)] outline-none ring-ring focus-visible:ring-2"
          />
        </label>
        {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
        {cards.length > 0 && (
          <ul className="mt-4 overflow-hidden rounded-2xl bg-card shadow-[0_12px_40px_rgba(20,16,12,0.08)]">
            {cards.map((card) => (
              <li key={card.id}>
                <a href={card.href} className="block px-5 py-4 transition-colors duration-200 ease-out hover:bg-muted motion-reduce:transition-none">
                  <span className="block text-base">{card.title}</span>
                  {card.summary && <span className="mt-1 block text-sm text-muted-foreground">{card.summary}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
