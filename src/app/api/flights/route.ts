import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const key = process.env.AVIATIONSTACK_API_KEY;
  console.log('[flights route] ENV KEY =', key);

  if (!key) {
    console.error('Missing AVIATIONSTACK_API_KEY in process.env');
    return NextResponse.json(
      { error: 'Server misconfigured: missing API key' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const flight = searchParams.get('flight');
  if (!flight) {
    return NextResponse.json({ error: 'Missing flight query' }, { status: 400 });
  }

  const url = `https://api.aviationstack.com/v1/flights?access_key=${key}&flight_iata=${encodeURIComponent(flight)}`;
  console.log('[flights route] Fetching URL =', url);

  const res = await fetch(url);
  const data = await res.json();
  console.log('[flights route] External status:', res.status);

  if (!res.ok) {
    return NextResponse.json({ error: data.error || 'External API error' }, { status: res.status });
  }
  return NextResponse.json(data);
}
