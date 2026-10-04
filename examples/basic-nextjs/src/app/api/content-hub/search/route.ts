import { NextRequest, NextResponse } from 'next/server';
import { searchCatalog } from '@/lib/content-hub/client';
import type { CatalogKind } from '@/lib/content-hub/types';

const KINDS = new Set<CatalogKind>(['product', 'factory', 'recipe']);

export async function GET(request: NextRequest) {
  const kindParam = request.nextUrl.searchParams.get('kind') || 'product';
  const query = request.nextUrl.searchParams.get('q') || '';
  if (!KINDS.has(kindParam as CatalogKind)) {
    return NextResponse.json({ items: [], error: 'Unknown catalog.' }, { status: 400 });
  }
  const result = await searchCatalog(kindParam as CatalogKind, query, 8);
  if (!result.ok) {
    return NextResponse.json({ items: [], error: result.error }, { status: 200 });
  }
  return NextResponse.json({ items: result.data });
}
