import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flight = searchParams.get('flight');
  if (!flight) {
    return NextResponse.json({ error: 'Missing flight query' }, { status: 400 });
  }

  const res = await fetch(
    `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&flight_iata=${encodeURIComponent(flight)}`
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'External API error' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
