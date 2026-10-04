#!/usr/bin/env node

/**
 * content-hub-discover.mjs
 *
 * Read-only discovery of Content Hub entity definitions for product, factory,
 * and recipe content. Writes docs/ai/catalog/content-hub-schema.yaml.
 * Never prints tokens, passwords, or raw credential files.
 *
 * Usage (from the starter root):
 *   node docs/ai/scripts/content-hub-discover.mjs
 *   node docs/ai/scripts/content-hub-discover.mjs --dry-run
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const starterRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const INTEREST =
  /product|factory|recipe|pcm|cookbook|bakery|ingredient|sku|article|kfmb|mill/i;

function loadCreds() {
  const credsPath = join(starterRoot, 'docs/ai/config/credentials.local.yaml');
  const raw = readFileSync(credsPath, 'utf-8');
  const pick = (key) => raw.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1] || '';
  return {
    host: (pick('host') || process.env.CH_HOST || '').replace(/\/+$/, ''),
    user: pick('user'),
    password: pick('password'),
    clientId: pick('clientId'),
    clientSecret: pick('clientSecret'),
    token: pick('token') || process.env.CH_TOKEN || '',
  };
}

async function authenticate(creds) {
  if (creds.token) {
    return creds.token.startsWith('Bearer ') ? creds.token : `Bearer ${creds.token}`;
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
    if (!res.ok) throw new Error(`OAuth failed: HTTP ${res.status}`);
    const json = await res.json();
    return `Bearer ${json.access_token}`;
  }
  if (creds.user && creds.password) {
    const res = await fetch(`${creds.host}/api/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ user_name: creds.user, password: creds.password }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 180);
      throw new Error(`Simple auth failed: HTTP ${res.status}${detail ? ` ${detail}` : ''}`);
    }
    const json = await res.json();
    return json.token;
  }
  throw new Error('No Content Hub credentials available');
}

function authHeaders(token) {
  if (token.startsWith('Bearer ')) return { Authorization: token };
  return { 'X-Auth-Token': token };
}

async function chGet(host, token, path) {
  const res = await fetch(`${host}${path}`, { headers: { ...authHeaders(token), Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed: HTTP ${res.status} ${text.slice(0, 180)}`);
  }
  return res.json();
}

function yamlEscape(value) {
  const text = String(value ?? '').replace(/"/g, '\\"');
  return `"${text}"`;
}

function memberKind(member) {
  const type = member.type || member.member_type || '';
  if (/relation/i.test(type) || member.associated) return 'relation';
  return 'property';
}

function summarizeMember(member) {
  return {
    name: member.name,
    label: member.labels?.['en-US'] || member.label || member.name,
    type: member.type || member.member_type || member.datasource || 'unknown',
    role: member.role || '',
    cardinality: member.cardinality || '',
    associated: member.associated_entitydefinition?.href
      ? member.associated_entitydefinition.href.split('/').pop()
      : member.associated_entitydefinition || '',
  };
}

function collectMembers(definition) {
  const groups = definition.member_groups || definition.memberGroups || [];
  const members = [];
  for (const group of groups) {
    const list = group.members || [];
    for (const member of list) {
      members.push(summarizeMember(member));
    }
  }
  if (members.length === 0 && Array.isArray(definition.members)) {
    for (const member of definition.members) members.push(summarizeMember(member));
  }
  return members;
}

function pickIdentifier(properties) {
  const names = properties.map((p) => p.name);
  const preferred = ['ProductName', 'RecipeName', 'FactoryName', 'Title', 'Name', 'DisplayName', 'SKU', 'ProductNumber'];
  return preferred.find((name) => names.includes(name)) || names.find((name) => /name|title|sku/i.test(name)) || 'id';
}

function classify(name) {
  if (/recipe|cookbook/i.test(name)) return 'recipe';
  if (/factory|mill|plant|bakery/i.test(name)) return 'factory';
  if (/product|sku|pcm/i.test(name) && !/recipe/i.test(name)) return 'product';
  return 'related';
}

async function listDefinitions(host, token) {
  const first = await chGet(host, token, '/api/entitydefinitions?skip=0&take=100');
  const items = [...(first.items || first.Items || [])];
  let next = first.next?.href || first.Next?.href;
  let guard = 0;
  while (next && guard < 20) {
    guard += 1;
    const page = await chGet(host, token, next.startsWith('http') ? new URL(next).pathname + new URL(next).search : next);
    items.push(...(page.items || page.Items || []));
    next = page.next?.href || page.Next?.href;
  }
  return items;
}

async function loadDefinition(host, token, summary) {
  const name = summary.name;
  try {
    return await chGet(host, token, `/api/entitydefinitions/${encodeURIComponent(name)}`);
  } catch {
    if (summary.self?.href) {
      const url = new URL(summary.self.href, host);
      return chGet(host, token, url.pathname + url.search);
    }
    throw new Error(`Could not load definition ${name}`);
  }
}

function toYaml(schema) {
  const lines = [
    '# Content Hub entity schema discovered for the KFMB demo.',
    '# Generated by docs/ai/scripts/content-hub-discover.mjs. Do not put secrets in this file.',
    `discoveredAt: ${yamlEscape(schema.discoveredAt)}`,
    `host: ${yamlEscape(schema.host)}`,
    'definitions:',
  ];
  for (const def of schema.definitions) {
    lines.push(`  - name: ${yamlEscape(def.name)}`);
    lines.push(`    id: ${def.id ?? 'null'}`);
    lines.push(`    role: ${yamlEscape(def.role)}`);
    lines.push(`    label: ${yamlEscape(def.label)}`);
    lines.push(`    urlIdentifier: ${yamlEscape(def.urlIdentifier)}`);
    lines.push('    properties:');
    if (def.properties.length === 0) lines.push('      []');
    for (const prop of def.properties) {
      lines.push(`      - name: ${yamlEscape(prop.name)}`);
      lines.push(`        label: ${yamlEscape(prop.label)}`);
      lines.push(`        type: ${yamlEscape(prop.type)}`);
    }
    lines.push('    relations:');
    if (def.relations.length === 0) lines.push('      []');
    for (const rel of def.relations) {
      lines.push(`      - name: ${yamlEscape(rel.name)}`);
      lines.push(`        label: ${yamlEscape(rel.label)}`);
      lines.push(`        role: ${yamlEscape(rel.role)}`);
      lines.push(`        cardinality: ${yamlEscape(rel.cardinality)}`);
      lines.push(`        associatedDefinition: ${yamlEscape(rel.associated)}`);
    }
  }
  lines.push('mapping:');
  lines.push(`  productDefinition: ${yamlEscape(schema.mapping.productDefinition)}`);
  lines.push(`  factoryDefinition: ${yamlEscape(schema.mapping.factoryDefinition)}`);
  lines.push(`  recipeDefinition: ${yamlEscape(schema.mapping.recipeDefinition)}`);
  lines.push(`  productUrlIdentifier: ${yamlEscape(schema.mapping.productUrlIdentifier)}`);
  lines.push(`  factoryUrlIdentifier: ${yamlEscape(schema.mapping.factoryUrlIdentifier)}`);
  lines.push(`  recipeUrlIdentifier: ${yamlEscape(schema.mapping.recipeUrlIdentifier)}`);
  lines.push(`  similarProductsRelation: ${yamlEscape(schema.mapping.similarProductsRelation)}`);
  lines.push(`  factoryProductsRelation: ${yamlEscape(schema.mapping.factoryProductsRelation)}`);
  lines.push(`  recipeProductsRelation: ${yamlEscape(schema.mapping.recipeProductsRelation)}`);
  lines.push('');
  return lines.join('\n');
}

function preferDefinition(definitions, names) {
  for (const name of names) {
    const found = definitions.find((def) => def.name === name);
    if (found) return found;
  }
  return undefined;
}

function chooseRelation(source, target, hints) {
  if (!source) return '';
  const towardTarget = target?.name
    ? source.relations.filter((rel) => String(rel.associated) === target.name)
    : source.relations;
  const hinted = towardTarget.find((rel) =>
    hints.some((hint) => new RegExp(hint, 'i').test(`${rel.name} ${rel.label}`))
  );
  return hinted?.name || towardTarget[0]?.name || '';
}

async function main() {
  const creds = loadCreds();
  if (!creds.host) throw new Error('Content Hub host missing from credentials.local.yaml');
  console.log(`[discover] Host ${creds.host}`);
  if (dryRun) {
    console.log('[discover] Dry run — credentials file is readable. No API calls.');
    return;
  }
  const token = await authenticate(creds);
  console.log('[discover] Authenticated');
  const summaries = await listDefinitions(creds.host, token);
  console.log(`[discover] ${summaries.length} entity definitions`);
  const interesting = summaries.filter((item) => INTEREST.test(item.name || ''));
  console.log(`[discover] ${interesting.length} match product/factory/recipe`);

  const definitions = [];
  for (const summary of interesting) {
    const full = await loadDefinition(creds.host, token, summary);
    const members = collectMembers(full);
    const properties = members.filter((member) => memberKind(member) === 'property');
    const relations = members.filter((member) => memberKind(member) === 'relation');
    const role = classify(full.name || summary.name);
    definitions.push({
      name: full.name || summary.name,
      id: full.id ?? summary.id ?? null,
      role,
      label: full.labels?.['en-US'] || full.label || summary.name,
      urlIdentifier: pickIdentifier(properties),
      properties,
      relations,
    });
    console.log(`[discover] ${full.name || summary.name} (${role}) props=${properties.length} rels=${relations.length}`);
  }

  const product = preferDefinition(definitions, ['M.PCM.Product', 'KFMB.ProductLine']);
  const factory = preferDefinition(definitions, ['KFMB.Factory']);
  const recipe = preferDefinition(definitions, ['KFMB.Recipe']);
  const schema = {
    discoveredAt: new Date().toISOString(),
    host: creds.host,
    definitions,
    mapping: {
      productDefinition: product?.name || '',
      factoryDefinition: factory?.name || '',
      recipeDefinition: recipe?.name || '',
      productUrlIdentifier: product?.urlIdentifier || 'id',
      factoryUrlIdentifier: factory?.urlIdentifier || 'id',
      recipeUrlIdentifier: recipe?.urlIdentifier || 'id',
      similarProductsRelation: chooseRelation(product, product, ['variant', 'similar', 'related']),
      factoryProductsRelation: chooseRelation(factory, product, ['product']),
      recipeProductsRelation: chooseRelation(recipe, product, ['product']),
    },
  };

  const outPath = join(starterRoot, 'docs/ai/catalog/content-hub-schema.yaml');
  writeFileSync(outPath, toYaml(schema), 'utf-8');
  console.log(`[discover] Wrote ${outPath}`);
}

function writeUnauthorizedSchema(host, message) {
  const schema = {
    discoveredAt: new Date().toISOString(),
    host,
    definitions: [],
    mapping: {
      productDefinition: '',
      factoryDefinition: '',
      recipeDefinition: '',
      productUrlIdentifier: 'id',
      factoryUrlIdentifier: 'id',
      recipeUrlIdentifier: 'id',
      similarProductsRelation: '',
      factoryProductsRelation: '',
      recipeProductsRelation: '',
    },
  };
  const body = [
    toYaml(schema).trimEnd(),
    `discoveryStatus: "unauthorized"`,
    `discoveryError: ${yamlEscape(message)}`,
    'cultures:',
    '  - "en-US"',
    '  - "ar-SA"',
    'notes:',
    '  - "Re-run this script after Content Hub accepts credentials.local.yaml. The read client resolves product, factory, and recipe definitions at runtime when this mapping is empty."',
    '',
  ].join('\n');
  const outPath = join(starterRoot, 'docs/ai/catalog/content-hub-schema.yaml');
  writeFileSync(outPath, body, 'utf-8');
  console.log(`[discover] Wrote ${outPath} with discoveryStatus unauthorized`);
}

main().catch((error) => {
  console.error(`[discover] ${error.message}`);
  try {
    const creds = loadCreds();
    writeUnauthorizedSchema(creds.host, error.message);
  } catch (writeError) {
    console.error(`[discover] Could not write schema: ${writeError.message}`);
  }
  process.exitCode = 1;
});
