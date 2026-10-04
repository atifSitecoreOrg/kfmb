export type CatalogKind = 'product' | 'factory' | 'recipe';

export type ContentCard = {
  id: string;
  identifier: string;
  title: string;
  summary: string;
  imageUrl: string;
  href: string;
  category: string;
};

export type ContentDetail = ContentCard & {
  body: string;
  properties: { label: string; value: string }[];
};

export type ContentHubResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type SchemaMapping = {
  productDefinition: string;
  factoryDefinition: string;
  recipeDefinition: string;
  productUrlIdentifier: string;
  factoryUrlIdentifier: string;
  recipeUrlIdentifier: string;
  similarProductsRelation: string;
  factoryProductsRelation: string;
  recipeProductsRelation: string;
};
