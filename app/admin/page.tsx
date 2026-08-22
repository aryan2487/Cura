"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPortal() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const toggleStock = async (medicineId: number, currentStatus: string) => {
    setUpdatingId(medicineId);
    const nextStatus = currentStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineId, status: nextStatus }),
      });
      if (res.ok) {
        await fetchInventory();
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
            Pharmacy Partner Portal
          </span>
          <Link href="/patient" className="text-xs text-slate-400 hover:text-white underline">
            Go to Patient View →
          </Link>
        </div>

        <h1 className="text-2xl font-extrabold mb-1">Test Pharmacy Inventory</h1>
        <p className="text-slate-400 text-sm mb-6">Manage stock status for individual medications</p>

        {loading ? (
          <p className="text-slate-400 text-center py-8">Loading inventory...</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {inventory.map((item) => (
              <div key={item.medicine_id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h2 className="text-md font-bold text-slate-100">{item.medicine_name}</h2>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    item.status === 'In Stock'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => toggleStock(item.medicine_id, item.status)}
                  disabled={updatingId === item.medicine_id}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition shadow-md ${
                    item.status === 'In Stock'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30'
                  }`}
                >
                  {updatingId === item.medicine_id ? 'Updating...' : item.status === 'In Stock' ? 'Mark Out of Stock' : 'Mark In Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}