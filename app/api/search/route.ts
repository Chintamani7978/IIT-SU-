import { NextRequest, NextResponse } from 'next/server';
import { searchCatalog } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const results = await searchCatalog(q);
  return NextResponse.json(results);
}
