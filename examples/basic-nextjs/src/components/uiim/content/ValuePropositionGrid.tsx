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

interface ValuePropositionItemFields {
  id: string;
  itemTitle: { jsonValue: Field<string> };
  itemDescription: { jsonValue: Field<string> };
  itemIcon: { jsonValue: ImageField };
  itemLink: { jsonValue: LinkField };
}

interface ValuePropositionGridDatasource {
  title: { jsonValue: Field<string> };
  description: { jsonValue: Field<string> };
  children: {
    results: ValuePropositionItemFields[];
  };
}

interface ValuePropositionGridFields {
  data: {
    datasource: ValuePropositionGridDatasource;
  };
}

type ValuePropositionGridProps = ComponentProps & {
  fields: ValuePropositionGridFields;
};

const ValuePropositionGridDefaultComponent = (): JSX.Element => (
  <div className="component value-proposition-grid">
    <div className="component-content">
      <span className="is-empty-hint">ValuePropositionGrid</span>
    </div>
  </div>
);

const SectionHeader = ({
  datasource,
  isEditing,
}: {
  datasource: ValuePropositionGridDatasource;
  isEditing?: boolean;
}) => (
  <div className="mx-auto mb-12 max-w-3xl text-center">
    {(datasource.title?.jsonValue?.value || isEditing) && (
      <Text
        field={datasource.title?.jsonValue}
        tag="h2"
        className="text-3xl font-bold tracking-tight sm:text-4xl font-[var(--brand-heading-font,inherit)]"
        style={{ color: 'var(--brand-fg, #111111)' }}
      />
    )}
    {(datasource.description?.jsonValue?.value || isEditing) && (
      <ContentSdkRichText
        field={datasource.description?.jsonValue}
        className="mt-4 text-lg opacity-70 font-[var(--brand-body-font,inherit)]"
        style={{ color: 'var(--brand-fg, #111111)' }}
      />
    )}
  </div>
);

/* ────────────────────────────────────────────
   Default — 3-column grid, icons above text, centered
   ──────────────────────────────────────────── */
export const Default = ({ fields, params, page }: ValuePropositionGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <ValuePropositionGridDefaultComponent />;
  const items = datasource.children?.results || [];

  return (
    <div className={cn('component value-proposition-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="grid gap-8 md:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                {(item.itemIcon?.jsonValue?.value?.src || isEditing) && (
                  <div className="mb-4 h-16 w-16 overflow-hidden">
                    <ContentSdkImage
                      field={item.itemIcon?.jsonValue}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                {(item.itemTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={item.itemTitle?.jsonValue}
                    tag="h3"
                    className="text-xl font-semibold font-[var(--brand-heading-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(item.itemDescription?.jsonValue?.value || isEditing) && (
                  <ContentSdkRichText
                    field={item.itemDescription?.jsonValue}
                    className="mt-2 text-sm opacity-70 font-[var(--brand-body-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(item.itemLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={item.itemLink?.jsonValue}
                    className="mt-3 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
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
   TwoColumn — 2 items side by side, larger
   ──────────────────────────────────────────── */
export const TwoColumn = ({ fields, params, page }: ValuePropositionGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <ValuePropositionGridDefaultComponent />;
  const items = datasource.children?.results || [];

  return (
    <div className={cn('component value-proposition-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="grid gap-12 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                {(item.itemIcon?.jsonValue?.value?.src || isEditing) && (
                  <div className="mb-5 h-20 w-20 overflow-hidden">
                    <ContentSdkImage
                      field={item.itemIcon?.jsonValue}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                {(item.itemTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={item.itemTitle?.jsonValue}
                    tag="h3"
                    className="text-2xl font-semibold font-[var(--brand-heading-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(item.itemDescription?.jsonValue?.value || isEditing) && (
                  <ContentSdkRichText
                    field={item.itemDescription?.jsonValue}
                    className="mt-3 text-base opacity-70 font-[var(--brand-body-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(item.itemLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={item.itemLink?.jsonValue}
                    className="mt-4 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
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
   FourColumn — 4 compact items in a row
   ──────────────────────────────────────────── */
export const FourColumn = ({ fields, params, page }: ValuePropositionGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <ValuePropositionGridDefaultComponent />;
  const items = datasource.children?.results || [];

  return (
    <div className={cn('component value-proposition-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                {(item.itemIcon?.jsonValue?.value?.src || isEditing) && (
                  <div className="mb-3 h-12 w-12 overflow-hidden">
                    <ContentSdkImage
                      field={item.itemIcon?.jsonValue}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                {(item.itemTitle?.jsonValue?.value || isEditing) && (
                  <Text
                    field={item.itemTitle?.jsonValue}
                    tag="h3"
                    className="text-base font-semibold font-[var(--brand-heading-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
                  />
                )}
                {(item.itemDescription?.jsonValue?.value || isEditing) && (
                  <ContentSdkRichText
                    field={item.itemDescription?.jsonValue}
                    className="mt-1.5 text-xs opacity-70 font-[var(--brand-body-font,inherit)]"
                    style={{ color: 'var(--brand-fg, #111111)' }}
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
   Horizontal — icon left, text right, stacked vertically
   ──────────────────────────────────────────── */
export const Horizontal = ({ fields, params, page }: ValuePropositionGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <ValuePropositionGridDefaultComponent />;
  const items = datasource.children?.results || [];

  return (
    <div className={cn('component value-proposition-grid', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeader datasource={datasource} isEditing={isEditing} />
          <div className="flex flex-col gap-8">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-5">
                {(item.itemIcon?.jsonValue?.value?.src || isEditing) && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden">
                    <ContentSdkImage
                      field={item.itemIcon?.jsonValue}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  {(item.itemTitle?.jsonValue?.value || isEditing) && (
                    <Text
                      field={item.itemTitle?.jsonValue}
                      tag="h3"
                      className="text-lg font-semibold font-[var(--brand-heading-font,inherit)]"
                      style={{ color: 'var(--brand-fg, #111111)' }}
                    />
                  )}
                  {(item.itemDescription?.jsonValue?.value || isEditing) && (
                    <ContentSdkRichText
                      field={item.itemDescription?.jsonValue}
                      className="mt-1.5 text-sm opacity-70 font-[var(--brand-body-font,inherit)]"
                      style={{ color: 'var(--brand-fg, #111111)' }}
                    />
                  )}
                  {(item.itemLink?.jsonValue?.value?.href || isEditing) && (
                    <ContentSdkLink
                      field={item.itemLink?.jsonValue}
                      className="mt-2 inline-block text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
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

function KfmbFactoryMark({ title }: { title: string }): JSX.Element {
  const name = title.toLowerCase();
  const path = name.includes('mill')
    ? 'M4 20h16M6 20V10l6-6 6 6v10M9 20v-4h6v4'
    : name.includes('macaroni') || name.includes('pasta')
      ? 'M7 4c2 5 2 11 0 16M12 4c2 5 2 11 0 16M17 4c2 5 2 11 0 16'
      : name.includes('biscuit')
        ? 'M12 3.5l1.8 3.6 4 .6-2.9 2.8.7 4L12 12.6 8.4 14.5l.7-4L6.2 7.7l4-.6z'
        : name.includes('oil')
          ? 'M10 3h4l-.6 5H16l-4 13-4-13h2.6z'
          : name.includes('arabic')
            ? 'M5 14c2-5 12-5 14 0 1 2-1 4-3 4H8c-2 0-4-2-3-4zM8 10c1-2 7-2 8 0'
            : name.includes('european')
              ? 'M6 15c0-4 2-7 6-7s6 3 6 7H6zm3 0v3m6-3v3M9 8V6m6 2V6'
              : name.includes('gluten')
                ? 'M12 3v18M8 7c2 2 6 2 8 0M8 12h8M8 17c2-2 6-2 8 0'
                : name.includes('artisanal')
                  ? 'M4 16l8-10 8 10M8 16v4h8v-4'
                  : name.includes('sandwich')
                    ? 'M4 10c4-4 12-4 16 0v1H4v-1zm0 3h16v1c-4 3-12 3-16 0v-1z'
                    : name.includes('coffee')
                      ? 'M7 8h9v4a4 4 0 0 1-4 4H10a3 3 0 0 1-3-3V8zm9 1h2a2 2 0 0 1 0 4h-2M8 19h8'
                      : name.includes('feed') || name.includes('animal')
                        ? 'M5 15c1-5 13-5 14 0M8 15v4M16 15v4M9 9c.5 2 5.5 2 6 0'
                        : 'M12 3l8 5v8l-8 5-8-5V8z';
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}

/* Kfmb variant — blue factory photograph, circular orange icons */
export const Kfmb = ({ fields, params, page }: ValuePropositionGridProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results || [];
  if (!datasource) return <ValuePropositionGridDefaultComponent />;

  return (
    <div className={cn('component value-proposition-grid', styles)} id={RenderingIdentifier}>
      <section
        className="relative w-full bg-cover bg-center px-4 py-16 md:py-20"
        style={{
          backgroundColor: 'var(--brand-primary)',
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--brand-primary) 78%, transparent), color-mix(in srgb, var(--brand-secondary) 82%, transparent)), url('https://aun-kfmb.sitecoresandbox.cloud/api/public/content/98338-section1-img3?v=5373d7a7')",
        }}
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <p
            aria-hidden
            className="font-[family-name:var(--brand-script-font,cursive)] text-6xl leading-none text-white/80 md:text-7xl"
          >
            Products
          </p>
          {(datasource.title?.jsonValue?.value || isEditing) && (
            <Text
              field={datasource.title.jsonValue}
              tag="h2"
              className="-mt-4 text-3xl font-bold uppercase tracking-[0.16em] text-white sm:text-4xl"
              style={{ fontFamily: 'var(--brand-heading-font)' }}
            />
          )}
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="relative">
                <div className="flex flex-col items-center">
                  <div
                    className="mb-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--brand-accent)' }}
                  >
                    {(item.itemIcon?.jsonValue?.value?.src || isEditing) ? (
                      <ContentSdkImage field={item.itemIcon.jsonValue} className="h-10 w-10 object-contain" />
                    ) : (
                      <KfmbFactoryMark title={item.itemTitle?.jsonValue?.value || ''} />
                    )}
                  </div>
                  {(item.itemTitle?.jsonValue?.value || isEditing) && (
                    <Text
                      field={item.itemTitle.jsonValue}
                      tag="h3"
                      className="max-w-[9rem] text-sm font-bold uppercase leading-tight tracking-wide text-white"
                      style={{ fontFamily: 'var(--brand-heading-font)' }}
                    />
                  )}
                </div>
                {(item.itemLink?.jsonValue?.value?.href || isEditing) && (
                  <ContentSdkLink
                    field={item.itemLink.jsonValue}
                    className={isEditing ? 'mt-2 block text-xs text-white underline' : 'absolute inset-0 z-10'}
                    aria-label={item.itemTitle?.jsonValue?.value || 'Factory'}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
