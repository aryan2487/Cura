'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// Dynamically import PharmacyMap with SSR disabled to fix the 'window is not defined' error
const PharmacyMap = dynamic(() => import('@/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
      Loading interactive map...
    </div>
  ),
});

export interface Pharmacy {
  id: string | number;
  name: string;
  phone?: string;
  address?: string;
  lat: number;
  lng: number;
  distance_km?: number;
  distanceKm?: number;
}

export default function PatientApp() {
  const [searchTerm, setSearchTerm] = useState("Insulin Glargine");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<{ pharmacyName: string; medicine: string } | null>(null);

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

  const handleReserve = (pharmacyId: string | number, medicineName: string) => {
    const found = pharmacies.find(p => p.id === pharmacyId);
    if (found) {
      setReservation({ pharmacyName: found.name, medicine: medicineName });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cura Patient Finder</h1>
          <p className="text-sm text-slate-600 mt-1">Real-time inventory mapping powered by your MySQL database.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl self-start sm:self-auto">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Interactive Map
          </button>
        </div>
      </div>

      {reservation && (
        <div className="max-w-4xl mx-auto mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
          <span>Successfully reserved <b>{reservation.medicine}</b> at <b>{reservation.pharmacyName}</b> for 60 minutes!</span>
          <button onClick={() => setReservation(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {viewMode === 'map' ? (
          <PharmacyMap 
            pharmacies={pharmacies} 
            onReserve={handleReserve} 
            selectedMedicine={searchTerm} 
          />
        ) : (
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-slate-500 py-12">Loading nearby stock...</p>
            ) : pharmacies.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No pharmacies found with this medicine in stock.</p>
            ) : (
              pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center transition hover:shadow-md">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{pharmacy.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pharmacy.address || pharmacy.phone || 'Verified Pharmacy'} • <span className="font-semibold text-emerald-600">{pharmacy.distance_km ?? pharmacy.distanceKm ?? '1.2'} km away</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      In Stock
                    </span>
                    <button
                      onClick={() => handleReserve(pharmacy.id, searchTerm)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl font-medium shadow-sm transition"
                    >
                      Reserve 60m
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}