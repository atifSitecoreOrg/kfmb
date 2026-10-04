import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { getCatalogDetail, getRelatedCatalog, routeIdentifier, searchCatalog } from './client';
import { CardGrid, CatalogHeading, CatalogState, DetailView } from './presentation';
import type { CatalogKind } from './types';

type CatalogFields = {
  Heading?: Field<string>;
  Introduction?: Field<string>;
  PreviewIdentifier?: Field<string>;
};

type CatalogProps = ComponentProps & {
  fields?: CatalogFields;
};

const EYEBROW: Record<CatalogKind, string> = {
  product: 'From the mills',
  factory: 'Our factories',
  recipe: 'Cooking books',
};

const NOUN: Record<CatalogKind, string> = {
  product: 'products',
  factory: 'factories',
  recipe: 'recipes',
};

function sectionId(params: CatalogProps['params'], rendering: CatalogProps['rendering']): string | undefined {
  return params?.RenderingIdentifier || rendering?.uid;
}

function publicMessage(isEditing: boolean | undefined, detail: string, fallback: string): string {
  return isEditing ? detail : fallback;
}

export async function CatalogListing({
  kind,
  componentName,
  params,
  page,
  fields,
  rendering,
}: CatalogProps & { kind: CatalogKind; componentName: string }): Promise<JSX.Element> {
  const isEditing = page?.mode?.isEditing;
  try {
    const result = await searchCatalog(kind, '', 12);
    const cards = result.ok ? result.data ?? [] : [];
    return (
      <section className={`component bg-background px-4 py-16 text-foreground ${params?.styles ?? ''}`} id={sectionId(params, rendering)}>
        <div className="mx-auto max-w-6xl">
          <CatalogHeading eyebrow={EYEBROW[kind]} heading={fields?.Heading} introduction={fields?.Introduction} isEditing={isEditing} />
          {!result.ok && (
            <CatalogState
              name={componentName}
              message={publicMessage(isEditing, result.error, `The ${NOUN[kind]} catalog is unavailable right now.`)}
            />
          )}
          {result.ok && cards.length === 0 && (
            <CatalogState name={componentName} message={`No ${NOUN[kind]} are published yet.`} />
          )}
          {cards.length > 0 && <CardGrid cards={cards} />}
        </div>
      </section>
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Content Hub request failed';
    return <CatalogState name={componentName} message={publicMessage(isEditing, detail, `The ${NOUN[kind]} catalog is unavailable right now.`)} />;
  }
}

export async function CatalogDetail({
  kind,
  componentName,
  segment,
  params,
  page,
  fields,
  rendering,
}: CatalogProps & { kind: CatalogKind; componentName: string; segment: string }): Promise<JSX.Element> {
  const isEditing = page?.mode?.isEditing;
  try {
    const context = page?.layout?.sitecore?.context as Record<string, unknown> | undefined;
    const identifier = routeIdentifier(context, segment, fields?.PreviewIdentifier?.value);
    if (!identifier) {
      return (
        <CatalogState
          name={componentName}
          message={isEditing ? 'Set Preview Identifier to preview a Content Hub item.' : `Choose a ${kind} from the catalog.`}
        />
      );
    }
    const result = await getCatalogDetail(kind, identifier);
    return (
      <section className={`component bg-background px-4 py-16 text-foreground ${params?.styles ?? ''}`} id={sectionId(params, rendering)}>
        <div className="mx-auto max-w-6xl">
          {!result.ok && (
            <CatalogState
              name={componentName}
              message={publicMessage(isEditing, result.error, `This ${kind} is not available.`)}
            />
          )}
          {result.ok && result.data && <DetailView detail={result.data} />}
          {result.ok && !result.data && <CatalogState name={componentName} message={`This ${kind} is not available.`} />}
        </div>
      </section>
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Content Hub request failed';
    return <CatalogState name={componentName} message={publicMessage(isEditing, detail, `This ${kind} is not available.`)} />;
  }
}

export async function RelatedRail({
  kind,
  componentName,
  segment,
  mode,
  params,
  page,
  fields,
  rendering,
}: CatalogProps & {
  kind: CatalogKind;
  componentName: string;
  segment: string;
  mode: 'similar' | 'recommended';
}): Promise<JSX.Element | null> {
  const isEditing = page?.mode?.isEditing;
  const emptyMessage = mode === 'similar' ? `No similar ${NOUN[kind]} yet.` : `No recommended ${NOUN[kind]} yet.`;
  try {
    const context = page?.layout?.sitecore?.context as Record<string, unknown> | undefined;
    const identifier = routeIdentifier(context, segment, fields?.PreviewIdentifier?.value);
    const result = await getRelatedCatalog(kind, identifier, mode);
    const cards = result.ok ? result.data ?? [] : [];
    if (!result.ok || cards.length === 0) {
      return (
        <CatalogState
          name={componentName}
          message={!result.ok ? publicMessage(isEditing, result.error, emptyMessage) : emptyMessage}
        />
      );
    }
    return (
      <section className={`component bg-muted px-4 py-16 text-foreground ${params?.styles ?? ''}`} id={sectionId(params, rendering)}>
        <div className="mx-auto max-w-6xl">
          <CatalogHeading
            eyebrow={mode === 'similar' ? 'Similar' : 'Recommended'}
            heading={fields?.Heading}
            introduction={fields?.Introduction}
            isEditing={isEditing}
          />
          <CardGrid cards={cards} />
        </div>
      </section>
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Content Hub request failed';
    return <CatalogState name={componentName} message={publicMessage(isEditing, detail, emptyMessage)} />;
  }
}
