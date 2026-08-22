"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPortal() {
  const [status, setStatus] = useState<string>('In Stock');
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch current database status on mount
  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setStatus(data.status);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleStock = async () => {
    setUpdating(true);
    const nextStatus = status === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setStatus(nextStatus);
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
            Pharmacy Partner Portal
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
            Go to Patient View →
          </Link>
        </div>

        <h1 className="text-2xl font-extrabold mb-1">Test Pharmacy</h1>
        <p className="text-slate-400 text-sm mb-6">Live Inventory Control System</p>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 mb-6">
          <p className="text-xs text-slate-400 mb-1">Managed Item</p>
          <h2 className="text-lg font-bold text-slate-100">Insulin Glargine 100IU/ml</h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Status:</span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                status === 'In Stock'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={toggleStock}
          disabled={loading || updating}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition shadow-lg ${
            status === 'In Stock'
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30'
          }`}
        >
          {updating
            ? 'Updating Database...'
            : status === 'In Stock'
            ? 'Mark as Out of Stock'
            : 'Mark as In Stock'}
        </button>
      </div>
    </main>
  );
}