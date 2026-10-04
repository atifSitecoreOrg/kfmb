import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import { RelatedRail } from '@/lib/content-hub/views';

export const Default = (props: ComponentProps): JSX.Element | null => (
  <RelatedRail {...props} kind="product" componentName="ProductRecommendations" segment="products" mode="recommended" />
);
