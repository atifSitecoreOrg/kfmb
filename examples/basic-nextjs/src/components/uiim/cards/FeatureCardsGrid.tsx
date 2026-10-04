'use client';

import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';
import { kfmbPill } from '@/components/uiim/kfmb/chrome';

interface FeatureCardItemFields {
  id: string;
  cardTitle: { jsonValue: Field<string> };
  cardDescription: { jsonValue: Field<string> };
  cardImage: { jsonValue: ImageField };
  cardLink: { jsonValue: LinkField };
}

interface FeatureCardsGridDatasource {
  title: { jsonValue: Field<string> };
  description: { jsonValue: Field<string> };
  children: {
    results: FeatureCardItemFields[];
  };
}

interface FeatureCardsGridFields {
  data: {
    datasource: FeatureCardsGridDatasource;
  };
}

type FeatureCardsGridProps = ComponentProps & {
  fields: FeatureCardsGridFields;
};

const FeatureCardsGridDefaultComponent = (): JSX.Element => (
  <div className="component feature-cards-grid">
    <div className="component-content">
      <span className="is-empty-hint">FeatureCardsGrid</span>
    </div>
  </div>
);

const SectionHeader = ({
  datasource,
  isEditing,
  light,
}: {
  datasource: FeatureCardsGridDatasource;
  isEditing?: boolean;
  light?: boolean;
}) => (
  <div className="relative mx-auto mb-12 max-w-3xl text-center">
    {light && (datasource.description?.jsonValue?.value || isEditing) && (
      <ContentSdkRichText
        field={datasource.description?.jsonValue}
        className="font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none text-white md:text-6xl"
      />
    )}
    {(datasource.title?.jsonValue?.value || isEditing) && (
      <Text
        field={datasource.title?.jsonValue}
        tag="h2"
        className="text-3xl font-bold uppercase tracking-[0.14em] sm:text-4xl font-[var(--brand-heading-font,inherit)]"
        style={{ color: light ? 'var(--brand-primary-foreground, #fff)' : 'var(--brand-primary, #09509d)' }}
      />
    )}
    {!light && (datasource.description?.jsonValue?.value || isEditing) && (
      <ContentSdkRichText
        field={datasource.description?.jsonValue}
        className="mt-4 text-lg font-[var(--brand-body-font,inherit)]"
        style={{ color: 'var(--brand-fg, #333333)' }}
      />
    )}
  </div>
);

/* ────────────────────────────────────────────
   Default — 3-column grid, icon top
   ──────────────────────────────────────────── */
export const Default = ({ fields, params, page }: FeatureCardsGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <FeatureCardsGridDefaultComponent />;
  const cards = datasource.children?.results || [];

  return (
    <div className={cn('component feature-cards-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-primary, #09509d)', color: 'var(--brand-primary-foreground, #fff)' }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} light />
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.id} className="flex flex-col items-center text-center">
                {(card.cardImage?.jsonValue?.value?.src || isEditing) && (
                  <div
                    className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-transform duration-200 ease-out active:scale-[0.97] motion-reduce:transition-none"
                    style={{ backgroundColor: 'var(--brand-accent, #ff8c00)' }}
                  >
                    <ContentSdkImage
                      field={card.cardImage?.jsonValue}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                )}
                {(card.cardTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={card.cardTitle?.jsonValue}
                    tag="h3"
                    className="text-sm font-bold uppercase tracking-wide font-[var(--brand-heading-font,inherit)]"
                    style={{ color: 'var(--brand-primary-foreground, #fff)' }}
                  />
                )}
                {(card.cardDescription?.jsonValue?.value || isEditing) && (
                  <ContentSdkRichText
                    field={card.cardDescription?.jsonValue}
                    className="mt-2 flex-1 text-sm opacity-70 font-[var(--brand-body-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(card.cardLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={card.cardLink?.jsonValue}
                    className="mt-4 inline-flex text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--brand-primary)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   TwoColumn — 2 wider cards
   ──────────────────────────────────────────── */
export const TwoColumn = ({ fields, params, page }: FeatureCardsGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <FeatureCardsGridDefaultComponent />;
  const cards = datasource.children?.results || [];

  return (
    <div className={cn('component feature-cards-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="grid gap-8 md:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col p-8 rounded-[var(--brand-card-radius,0.75rem)]"
                style={{
                  backgroundColor: 'var(--brand-bg, #ffffff)',
                  border: '1px solid var(--brand-border, #e5e7eb)',
                }}
              >
                {(card.cardImage?.jsonValue?.value?.src || isEditing) && (
                  <div className="mb-5 h-14 w-14 overflow-hidden">
                    <ContentSdkImage
                      field={card.cardImage?.jsonValue}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                {(card.cardTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={card.cardTitle?.jsonValue}
                    tag="h3"
                    className="text-xl font-semibold font-[var(--brand-heading-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(card.cardDescription?.jsonValue?.value || isEditing) && (
                  <ContentSdkRichText
                    field={card.cardDescription?.jsonValue}
                    className="mt-3 flex-1 text-base opacity-70 font-[var(--brand-body-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(card.cardLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={card.cardLink?.jsonValue}
                    className="mt-5 inline-flex text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--brand-primary)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   WithImages — larger images at top of each card
   ──────────────────────────────────────────── */
export const WithImages = ({ fields, params, page }: FeatureCardsGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <FeatureCardsGridDefaultComponent />;
  const cards = datasource.children?.results || [];

  return (
    <div className={cn('component feature-cards-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col overflow-hidden rounded-[var(--brand-card-radius,0.75rem)]"
                style={{
                  backgroundColor: 'var(--brand-bg, #ffffff)',
                  border: '1px solid var(--brand-border, #e5e7eb)',
                }}
              >
                {(card.cardImage?.jsonValue?.value?.src || isEditing) && (
                  <ContentSdkImage
                    field={card.cardImage?.jsonValue}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  {(card.cardTitle?.jsonValue?.value || isEditing) && (
                    <Text
                      field={card.cardTitle?.jsonValue}
                      tag="h3"
                      className="text-lg font-semibold font-[var(--brand-heading-font,inherit)]"
                      style={{ color: 'var(--brand-fg, #111111)' }}
                    />
                  )}
                  {(card.cardDescription?.jsonValue?.value || isEditing) && (
                    <ContentSdkRichText
                      field={card.cardDescription?.jsonValue}
                      className="mt-2 flex-1 text-sm opacity-70 font-[var(--brand-body-font,inherit)]"
                      style={{ color: 'var(--brand-fg, #111111)' }}
                    />
                  )}
                  {(card.cardLink?.jsonValue?.value?.href || isEditing) && (
                    <ContentSdkLink
                      field={card.cardLink?.jsonValue}
                      className="mt-4 inline-flex text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                      style={{ color: 'var(--brand-primary)' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* The homepage assigns this variant. It renders every factory as an orange icon, matching the KFMB factories band. */
export const Carousel = ({ fields, params, page }: FeatureCardsGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  const cards = datasource?.children?.results || [];

  if (!datasource) return <FeatureCardsGridDefaultComponent />;

  return (
    <div className={cn('component feature-cards-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full bg-cover bg-center px-4 py-16 md:py-20"
        style={{
          backgroundColor: 'var(--brand-primary, #09509d)',
          backgroundImage:
            "linear-gradient(rgba(9, 80, 157, 0.82), rgba(9, 80, 157, 0.82)), url('https://aun-kfmb.sitecoresandbox.cloud/api/public/content/98338-section1-img3?v=5373d7a7')",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} light />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map((card) => {
              const title = card.cardTitle?.jsonValue?.value || '';
              const body = (
                <div className="flex flex-col items-center text-center">
                  <div
                    className="mb-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--brand-accent, #ff8c00)' }}
                  >
                    {(card.cardImage?.jsonValue?.value?.src || isEditing) ? (
                      <ContentSdkImage field={card.cardImage?.jsonValue} className="h-10 w-10 object-contain" />
                    ) : (
                      <FactoryMark title={title} />
                    )}
                  </div>
                  {(title || isEditing) && (
                    <Text
                      field={card.cardTitle?.jsonValue}
                      tag="h3"
                      className="max-w-[9rem] text-sm font-bold uppercase leading-tight tracking-wide font-[var(--brand-heading-font,inherit)]"
                      style={{ color: 'var(--brand-primary-foreground, #fff)' }}
                    />
                  )}
                </div>
              );
              return (
                <li key={card.id} className="relative">
                  {body}
                  {(card.cardLink?.jsonValue || isEditing) && (
                    <ContentSdkLink
                      field={card.cardLink?.jsonValue}
                      className={
                        isEditing
                          ? 'mt-2 block text-center text-xs text-white underline'
                          : 'absolute inset-0 z-10 text-[0px]'
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

/* Kfmb variant — cream news band, script watermark, three photographs, one pill */
export const Kfmb = ({ fields, params, page }: FeatureCardsGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  const cards = datasource?.children?.results || [];
  if (!datasource) return <FeatureCardsGridDefaultComponent />;

  return (
    <div className={cn('component feature-cards-grid', styles)} id={RenderingIdentifier}>
      <section className="w-full px-4 py-16 text-center md:py-20" style={{ backgroundColor: 'var(--brand-muted)' }}>
        <div className="mx-auto max-w-6xl">
          {(datasource.description?.jsonValue?.value || isEditing) ? (
            <ContentSdkRichText
              field={datasource.description.jsonValue}
              className="font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none md:text-7xl"
              style={{ color: 'var(--brand-highlight)' }}
            />
          ) : (
            <p aria-hidden className="font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none md:text-7xl" style={{ color: 'var(--brand-highlight)' }}>
              News &amp; Events
            </p>
          )}
          {(datasource.title?.jsonValue?.value || isEditing) && (
            <Text
              field={datasource.title.jsonValue}
              tag="h2"
              className="-mt-3 text-3xl font-bold uppercase tracking-[0.16em] sm:text-4xl"
              style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}
            />
          )}
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id} className="relative overflow-hidden bg-white">
                {(card.cardImage?.jsonValue?.value?.src || isEditing) && (
                  <ContentSdkImage field={card.cardImage.jsonValue} className="aspect-[16/10] w-full object-cover" />
                )}
                {(card.cardTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={card.cardTitle.jsonValue}
                    tag="h3"
                    className="px-3 py-3 text-sm font-bold uppercase tracking-wide"
                    style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}
                  />
                )}
                {(card.cardLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={card.cardLink.jsonValue}
                    className={isEditing ? 'block px-3 pb-3 text-xs underline' : 'absolute inset-0'}
                    aria-label={card.cardTitle?.jsonValue?.value || 'News story'}
                  />
                )}
              </li>
            ))}
          </ul>
          <a
            href="/Home/media-center/news"
            className={cn(kfmbPill, 'mt-10')}
            style={{ backgroundColor: 'var(--brand-accent)' }}
          >
            Read More
          </a>
        </div>
      </section>
    </div>
  );
};

function FactoryMark({ title }: { title: string }): JSX.Element {
  const name = title.toLowerCase();
  const path = name.includes('mill')
    ? 'M4 20h16M6 20V10l6-6 6 6v10'
    : name.includes('macaroni') || name.includes('pasta')
      ? 'M8 4c2 4 2 12 0 16M12 4c2 4 2 12 0 16M16 4c2 4 2 12 0 16'
      : name.includes('biscuit')
        ? 'M12 3l2 4 4 .5-3 3 .8 4.5L12 13l-3.8 2 0.8-4.5-3-3L10 7z'
        : name.includes('oil')
          ? 'M10 3h4l-1 6h3l-6 12 1-7H8z'
          : name.includes('coffee')
            ? 'M6 8h10v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4V8zm10 2h2a2 2 0 0 1 0 4h-2'
            : name.includes('feed') || name.includes('animal')
              ? 'M4 16c2-6 14-6 16 0M8 16v3M16 16v3M9 10c1 2 5 2 6 0'
              : name.includes('sandwich')
                ? 'M4 9c4-4 12-4 16 0v2H4V9zm0 4h16v2c-4 3-12 3-16 0v-2z'
                : name.includes('gluten')
                  ? 'M12 3v18M12 8c3-1 5-1 6 1M12 12c3 1 5 1 6-1M12 8c-3-1-5-1-6 1M12 12c-3 1-5 1-6-1'
                  : 'M12 3l8 5v8l-8 5-8-5V8z';
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}
