'use client';

import { useState, useEffect } from 'react';
import PharmacyMap from '@/components/PharmacyMap';

export interface Pharmacy {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
  distance_km: number;
}

export default function Home() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedMedicine = 'Insulin Glargine';

  useEffect(() => {
    async function loadDatabasePharmacies() {
      try {
        const response = await fetch('/api/pharmacies?lat=22.7196&lng=75.8577&medicineId=1');
        const data = await response.json();
        if (Array.isArray(data)) {
          setPharmacies(data);
        }
      } catch (error) {
        console.error("Failed to load live pharmacies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDatabasePharmacies();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Cura Patient Finder</h1>
        <p className="text-sm text-slate-600 mt-1">Live inventory from MySQL database.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <PharmacyMap 
          pharmacies={pharmacies} 
          onReserve={(id, med) => alert(`Reserved ${med} at pharmacy ID: ${id}`)} 
          selectedMedicine={selectedMedicine} 
        />
      </div>

      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        {loading ? (
          <p className="text-center text-slate-500">Loading nearby stock...</p>
        ) : pharmacies.length === 0 ? (
          <p className="text-center text-slate-500">No pharmacies found.</p>
        ) : (
          pharmacies.map((pharmacy: Pharmacy) => (
            <div key={pharmacy.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{pharmacy.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                    📞 {pharmacy.phone} • <span className="font-semibold text-emerald-600">{pharmacy.distance_km} km away</span>
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold uppercase">
                In Stock
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}