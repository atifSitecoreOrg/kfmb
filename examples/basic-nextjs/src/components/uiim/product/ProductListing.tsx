import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import { CatalogListing } from '@/lib/content-hub/views';

export const Default = (props: ComponentProps): JSX.Element => (
  <CatalogListing {...props} kind="product" componentName="ProductListing" />
);
