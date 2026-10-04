import { readFileSync } from 'fs';
import { join } from 'path';
import type { CatalogKind, SchemaMapping } from './types';

const EMPTY_MAPPING: SchemaMapping = {
  productDefinition: '',
  factoryDefinition: '',
  recipeDefinition: '',
  productUrlIdentifier: 'id',
  factoryUrlIdentifier: 'id',
  recipeUrlIdentifier: 'id',
  similarProductsRelation: '',
  factoryProductsRelation: '',
  recipeProductsRelation: '',
};

const KIND_PATH: Record<CatalogKind, string> = {
  product: 'products',
  factory: 'factories',
  recipe: 'recipes',
};

export function catalogPath(kind: CatalogKind): string {
  return KIND_PATH[kind];
}

export function loadSchemaMapping(): SchemaMapping {
  try {
    const raw = readFileSync(join(process.cwd(), 'docs/ai/catalog/content-hub-schema.yaml'), 'utf8');
    const mapping: SchemaMapping = { ...EMPTY_MAPPING };
    const section = raw.split(/^mapping:\s*$/m)[1] ?? '';
    for (const key of Object.keys(EMPTY_MAPPING) as (keyof SchemaMapping)[]) {
      const match = section.match(new RegExp(`^\\s*${key}:\\s*"([^"]*)"`, 'm'));
      if (match) mapping[key] = match[1];
    }
    return mapping;
  } catch {
    return EMPTY_MAPPING;
  }
}

export function definitionFor(kind: CatalogKind, mapping: SchemaMapping): string {
  if (kind === 'product') return mapping.productDefinition;
  if (kind === 'factory') return mapping.factoryDefinition;
  return mapping.recipeDefinition;
}

export function identifierFieldFor(kind: CatalogKind, mapping: SchemaMapping): string {
  if (kind === 'product') return mapping.productUrlIdentifier || 'id';
  if (kind === 'factory') return mapping.factoryUrlIdentifier || 'id';
  return mapping.recipeUrlIdentifier || 'id';
}
