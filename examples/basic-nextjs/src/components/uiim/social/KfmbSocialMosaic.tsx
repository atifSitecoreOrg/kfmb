import React, { JSX } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';
import { KfmbSocialRow } from '@/components/uiim/kfmb/chrome';

interface MosaicTileFields {
  id: string;
  tileImage?: { jsonValue?: ImageField };
  tileLink?: { jsonValue?: LinkField };
}

interface MosaicDatasource {
  message?: { jsonValue?: Field<string> };
  hashtag?: { jsonValue?: Field<string> };
  children?: {
    results?: MosaicTileFields[];
  };
}

type MosaicProps = ComponentProps & {
  fields?: {
    data?: {
      datasource?: MosaicDatasource;
    };
  };
};

const MosaicEmpty = (): JSX.Element => (
  <div className="component kfmb-social-mosaic">
    <span className="is-empty-hint">KfmbSocialMosaic</span>
  </div>
);

function MosaicLayout({ fields, params, page }: MosaicProps): JSX.Element {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;
  if (!datasource) return <MosaicEmpty />;

  const tiles = datasource.children?.results ?? [];

  return (
    <div className={cn('component kfmb-social-mosaic', styles)} id={RenderingIdentifier}>
      <section className="relative w-full bg-white px-3 py-8 md:px-6 md:py-12">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {tiles.map((tile) => (
            <li key={tile.id} className="relative aspect-square overflow-hidden bg-[var(--brand-bg)]">
              {(tile.tileImage?.jsonValue?.value?.src || isEditing) && (
                <ContentSdkImage field={tile.tileImage?.jsonValue} className="h-full w-full object-cover" />
              )}
              {(tile.tileLink?.jsonValue?.value?.href || isEditing) && tile.tileLink?.jsonValue && (
                <ContentSdkLink
                  field={tile.tileLink.jsonValue}
                  className={isEditing ? 'block p-2 text-xs underline' : 'absolute inset-0'}
                  aria-label="Product moment"
                />
              )}
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="pointer-events-auto max-w-xl bg-white/95 px-6 py-8 text-center shadow-[0_8px_30px_rgba(12,81,155,0.08)]">
            {(datasource.message?.jsonValue?.value || isEditing) && (
              <Text
                field={datasource.message?.jsonValue}
                tag="p"
                className="text-base leading-7 md:text-lg"
                style={{ color: 'var(--brand-fg)', fontFamily: 'var(--brand-body-font)' }}
              />
            )}
            {(datasource.hashtag?.jsonValue?.value || isEditing) && (
              <Text
                field={datasource.hashtag?.jsonValue}
                tag="p"
                className="mt-4 text-sm font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}
              />
            )}
            <KfmbSocialRow className="mt-5 justify-center" />
          </div>
        </div>
      </section>
    </div>
  );
}

export const Default = (props: MosaicProps): JSX.Element => <MosaicLayout {...props} />;

export const Kfmb = (props: MosaicProps): JSX.Element => <MosaicLayout {...props} />;
