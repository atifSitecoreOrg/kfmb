import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import { CatalogListing } from '@/lib/content-hub/views';

export const Default = (props: ComponentProps): JSX.Element => (
  <CatalogListing {...props} kind="factory" componentName="FactoryListing" />
);

export const Kfmb = (props: ComponentProps): JSX.Element => (
  <CatalogListing {...props} kind="factory" componentName="FactoryListing" appearance="kfmb" />
);
