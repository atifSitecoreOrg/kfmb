import 'server-only';

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  catalogPath,
  definitionFor,
  identifierFieldFor,
  loadSchemaMapping,
} from './mapping';
import type { CatalogKind, ContentCard, ContentDetail, ContentHubResult, SchemaMapping } from './types';

type Token = { value: string; mode: 'bearer' | 'xauth' };

type ChEntity = {
  id?: number | string;
  identifier?: string;
  properties?: Record<string, unknown>;
  relations?: Record<string, { href?: string; parent?: { href?: string } }>;
  renditions?: Record<string, { href?: string }[] | { href?: string }>;
};

const TITLE_KEYS = ['Title', 'ProductName', 'Name', 'DisplayName', 'RecipeName', 'FactoryName', 'FileName'];
const SUMMARY_KEYS = ['ShortDescription', 'Summary', 'Description', 'ProductDescription', 'Intro'];
const BODY_KEYS = ['LongDescription', 'Body', 'Content', 'Story', 'Ingredients', 'Method', 'Description'];
const CATEGORY_KEYS = ['Category', 'ProductCategory', 'FactoryType', 'Cuisine', 'Type'];
const IMAGE_KEYS = ['ImageUrl', 'PublicLink', 'ThumbnailUrl', 'HeroImage'];

let cachedToken: Token | null = null;
let cachedDefinitions: { name: string; role: CatalogKind | 'related' }[] | null = null;

function loadCreds() {
  const fromEnv = {
    host: (process.env.CH_HOST || '').replace(/\/+$/, ''),
    user: process.env.CH_USER || '',
    password: process.env.CH_PASSWORD || '',
    clientId: process.env.CH_CLIENT_ID || '',
    clientSecret: process.env.CH_CLIENT_SECRET || '',
    token: process.env.CH_TOKEN || '',
  };
  try {
    const raw = readFileSync(join(process.cwd(), 'docs/ai/config/credentials.local.yaml'), 'utf8');
    const pick = (key: string) => raw.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1] || '';
    return {
      host: (fromEnv.host || pick('host')).replace(/\/+$/, ''),
      user: fromEnv.user || pick('user'),
      password: fromEnv.password || pick('password'),
      clientId: fromEnv.clientId || pick('clientId'),
      clientSecret: fromEnv.clientSecret || pick('clientSecret'),
      token: fromEnv.token || pick('token'),
    };
  } catch {
    return fromEnv;
  }
}

async function authenticate(): Promise<Token> {
  if (cachedToken) return cachedToken;
  const creds = loadCreds();
  if (!creds.host) throw new Error('Content Hub host is not configured');
  if (creds.token) {
    cachedToken = creds.token.startsWith('Bearer ')
      ? { value: creds.token, mode: 'bearer' }
      : { value: creds.token, mode: 'xauth' };
    return cachedToken;
  }
  if (creds.clientId && creds.clientSecret) {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
    });
    const res = await fetch(`${creds.host}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) throw new Error(`Content Hub OAuth failed (${res.status})`);
    const json = (await res.json()) as { access_token?: string };
    if (!json.access_token) throw new Error('Content Hub OAuth returned no access token');
    cachedToken = { value: `Bearer ${json.access_token}`, mode: 'bearer' };
    return cachedToken;
  }
  if (creds.user && creds.password) {
    const res = await fetch(`${creds.host}/api/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ user_name: creds.user, password: creds.password }),
    });
    if (!res.ok) throw new Error(`Content Hub sign-in failed (${res.status})`);
    const json = (await res.json()) as { token?: string };
    if (!json.token) throw new Error('Content Hub sign-in returned no token');
    cachedToken = json.token.startsWith('Bearer ')
      ? { value: json.token, mode: 'bearer' }
      : { value: json.token, mode: 'xauth' };
    return cachedToken;
  }
  throw new Error('Content Hub credentials are missing');
}

function authHeaders(token: Token): HeadersInit {
  return token.mode === 'bearer' ? { Authorization: token.value } : { 'X-Auth-Token': token.value };
}

async function chFetch(path: string, init?: RequestInit): Promise<Response> {
  const creds = loadCreds();
  const token = await authenticate();
  return fetch(`${creds.host}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...authHeaders(token),
      ...(init?.headers || {}),
    },
  });
}

function textValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';
  const record = value as Record<string, unknown>;
  const preferred = record['en-US'] ?? record['en'] ?? record.value ?? record.Value;
  if (typeof preferred === 'string' || typeof preferred === 'number') return String(preferred);
  const first = Object.values(record).find((entry) => typeof entry === 'string' || typeof entry === 'number');
  return first != null ? String(first) : '';
}

function firstProperty(entity: ChEntity, keys: string[]): string {
  const properties = entity.properties ?? {};
  for (const key of keys) {
    const value = textValue(properties[key]);
    if (value) return value;
  }
  return '';
}

function imageFromEntity(entity: ChEntity): string {
  const direct = firstProperty(entity, IMAGE_KEYS);
  if (direct.startsWith('http')) return direct;
  const renditions = entity.renditions ?? {};
  for (const value of Object.values(renditions)) {
    const list = Array.isArray(value) ? value : [value];
    const href = list.find((item) => item?.href)?.href;
    if (href) return href;
  }
  return '';
}

function classifyName(name: string): CatalogKind | 'related' | null {
  if (/recipe|cookbook/i.test(name)) return 'recipe';
  if (/factory|mill|plant|bakery/i.test(name)) return 'factory';
  if (/product|sku|pcm/i.test(name) && !/recipe/i.test(name)) return 'product';
  return null;
}

async function resolveDefinition(kind: CatalogKind, mapping: SchemaMapping): Promise<string> {
  const configured = definitionFor(kind, mapping);
  if (configured) return configured;
  if (!cachedDefinitions) {
    const res = await chFetch('/api/entitydefinitions?skip=0&take=100');
    if (!res.ok) throw new Error(`Content Hub definitions request failed (${res.status})`);
    const json = (await res.json()) as { items?: { name?: string }[] };
    cachedDefinitions = (json.items ?? [])
      .map((item) => ({ name: item.name || '', role: classifyName(item.name || '') }))
      .filter((item): item is { name: string; role: CatalogKind | 'related' } => Boolean(item.name && item.role));
  }
  return cachedDefinitions.find((item) => item.role === kind)?.name || '';
}

function toCard(entity: ChEntity, kind: CatalogKind, identifierField: string): ContentCard {
  const identifier =
    (identifierField !== 'id' ? firstProperty(entity, [identifierField]) : '') ||
    entity.identifier ||
    String(entity.id ?? '');
  const title = firstProperty(entity, TITLE_KEYS) || identifier || 'Untitled';
  return {
    id: String(entity.id ?? identifier),
    identifier,
    title,
    summary: firstProperty(entity, SUMMARY_KEYS),
    imageUrl: imageFromEntity(entity),
    href: `/${catalogPath(kind)}/${encodeURIComponent(identifier)}`,
    category: firstProperty(entity, CATEGORY_KEYS),
  };
}

function entitiesFromPayload(payload: unknown): ChEntity[] {
  if (!payload || typeof payload !== 'object') return [];
  const record = payload as { items?: ChEntity[]; children?: ChEntity[] };
  return record.items || record.children || [];
}

async function queryEntities(definition: string, fullText: string, take: number): Promise<ChEntity[]> {
  const textClause = fullText ? ` AND FullText == '${fullText.replace(/'/g, '')}'` : '';
  const query = `Definition.Name == '${definition.replace(/'/g, '')}'${textClause}`;
  const res = await chFetch(`/api/entities?query=${encodeURIComponent(query)}&take=${take}`);
  if (!res.ok) throw new Error(`Content Hub query failed (${res.status})`);
  return entitiesFromPayload(await res.json());
}

export async function searchCatalog(
  kind: CatalogKind,
  fullText = '',
  take = 12
): Promise<ContentHubResult<ContentCard[]>> {
  try {
    const mapping = loadSchemaMapping();
    const definition = await resolveDefinition(kind, mapping);
    if (!definition) {
      return { ok: false, error: `No Content Hub ${kind} definition is mapped yet.` };
    }
    const identifierField = identifierFieldFor(kind, mapping);
    const entities = await queryEntities(definition, fullText, take);
    return { ok: true, data: entities.map((entity) => toCard(entity, kind, identifierField)) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Content Hub request failed' };
  }
}

async function findEntity(kind: CatalogKind, identifier: string): Promise<ChEntity | null> {
  const mapping = loadSchemaMapping();
  const definition = await resolveDefinition(kind, mapping);
  if (!definition || !identifier) return null;
  const field = identifierFieldFor(kind, mapping);
  if (/^\d+$/.test(identifier) && (field === 'id' || !field)) {
    const byId = await chFetch(`/api/entities/${identifier}`);
    if (byId.ok) return (await byId.json()) as ChEntity;
  }
  const query = `Definition.Name == '${definition.replace(/'/g, '')}' AND (${field} == '${identifier.replace(/'/g, '')}' OR Identifier == '${identifier.replace(/'/g, '')}')`;
  const res = await chFetch(`/api/entities?query=${encodeURIComponent(query)}&take=1`);
  if (!res.ok) throw new Error(`Content Hub entity lookup failed (${res.status})`);
  return entitiesFromPayload(await res.json())[0] ?? null;
}

function detailProperties(entity: ChEntity): { label: string; value: string }[] {
  const properties = entity.properties ?? {};
  return Object.entries(properties)
    .map(([label, value]) => ({ label, value: textValue(value) }))
    .filter((entry) => entry.value && entry.value.length < 280)
    .slice(0, 8);
}

async function relatedCards(entity: ChEntity, relationName: string, kind: CatalogKind): Promise<ContentCard[]> {
  if (!relationName || !entity.id) return [];
  const res = await chFetch(`/api/entities/${entity.id}/relations/${encodeURIComponent(relationName)}?take=4`);
  if (!res.ok) return [];
  const mapping = loadSchemaMapping();
  const identifierField = identifierFieldFor(kind, mapping);
  return entitiesFromPayload(await res.json()).map((item) => toCard(item, kind, identifierField));
}

export async function getCatalogDetail(
  kind: CatalogKind,
  identifier: string
): Promise<ContentHubResult<ContentDetail>> {
  try {
    const entity = await findEntity(kind, identifier);
    if (!entity) return { ok: false, error: 'This item is not in Content Hub yet.' };
    const mapping = loadSchemaMapping();
    const card = toCard(entity, kind, identifierFieldFor(kind, mapping));
    return {
      ok: true,
      data: {
        ...card,
        body: firstProperty(entity, BODY_KEYS) || card.summary,
        properties: detailProperties(entity).filter((entry) => entry.value !== card.title),
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Content Hub request failed' };
  }
}

export async function getRelatedCatalog(
  kind: CatalogKind,
  identifier: string,
  mode: 'similar' | 'recommended'
): Promise<ContentHubResult<ContentCard[]>> {
  try {
    const mapping = loadSchemaMapping();
    const entity = identifier ? await findEntity(kind, identifier) : null;
    const relation =
      mode === 'similar'
        ? mapping.similarProductsRelation
        : mapping.similarProductsRelation || mapping.factoryProductsRelation;
    if (entity && relation) {
      const related = await relatedCards(entity, relation, kind);
      const filtered = related.filter((card) => card.identifier !== identifier).slice(0, 4);
      if (filtered.length > 0) return { ok: true, data: filtered };
    }
    const listing = await searchCatalog(kind, '', 8);
    if (!listing.ok) return listing;
    return {
      ok: true,
      data: listing.data.filter((card) => card.identifier !== identifier).slice(0, 4),
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Content Hub request failed' };
  }
}

export function routeIdentifier(
  context: Record<string, unknown> | undefined,
  segment: string,
  previewIdentifier?: string
): string {
  if (previewIdentifier) return previewIdentifier;
  const raw = [context?.itemPath, context?.requestedPath, context?.path]
    .filter((value): value is string => typeof value === 'string')
    .join(' ');
  const match = raw.match(new RegExp(`/${segment}/([^/?#*\\s]+)`, 'i'));
  return match ? decodeURIComponent(match[1]) : '';
}
