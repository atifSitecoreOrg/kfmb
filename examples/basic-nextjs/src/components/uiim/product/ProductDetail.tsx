import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import { CatalogDetail } from '@/lib/content-hub/views';

export const Default = (props: ComponentProps): JSX.Element => (
  <CatalogDetail {...props} kind="product" componentName="ProductDetail" segment="products" />
);

export const Kfmb = (props: ComponentProps): JSX.Element => (
  <CatalogDetail {...props} kind="product" componentName="ProductDetail" segment="products" appearance="kfmb" />
);
