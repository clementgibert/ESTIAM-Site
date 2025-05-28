'use client';

import { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '@/contexts/jwt-context';

interface Flight {
  flight: {
    iata: string;
    number: string;
  };
  departure: { airport: string; scheduled: string };
  arrival: { airport: string; scheduled: string };
  airline: { name: string };
  flight_status: string;
}

export default function AvionPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [flightNo, setFlightNo] = useState('');
  const [result, setResult] = useState<Flight[]|null>(null);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return <p>Please sign in to look up flights.</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/flights?flight=${flightNo}`);
      const json = await res.json();
      if (res.status === 401) {
        throw new Error('Flight lookup currently unavailable (invalid API key).');
      }
      if (json.error) throw new Error(json.error);
      setResult(json.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flight Lookup</h1>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={flightNo}
          onChange={e => setFlightNo(e.target.value)}
          placeholder="e.g. BA283"
          className="flex-grow border rounded p-2"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {result && result.length === 0 && <p>No flights found.</p>}
      {result && result.length > 0 && (
        <ul className="space-y-4">
          {result.map((f, i) => (
            <li key={i} className="border p-4 rounded shadow">
              <p><strong>{f.airline.name} {f.flight.number}</strong> – {f.flight_status}</p>
              <p>Departs: {f.departure.airport} @ {new Date(f.departure.scheduled).toLocaleString()}</p>
              <p>Arrives: {f.arrival.airport} @ {new Date(f.arrival.scheduled).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
