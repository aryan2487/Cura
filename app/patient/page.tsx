"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PharmacyMap = dynamic(() => import('../../components/PharmacyMap'), { ssr: false });

export default function Home() {
  const [pharmacies, setPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  // Modular fetcher function
  const fetchPharmacies = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/pharmacies?lat=${lat}&lng=${lng}&medicineId=1`);
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      console.error("Failed to fetch pharmacies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Get location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          fetchPharmacies(lat, lng);
        },
        (error) => {
          console.error("Location error:", error);
          setErrorMsg("Please allow location access to find pharmacies near you.");
          setLoading(false);
        }
      );
    } else {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [fetchPharmacies]);

  // 2. Poll every 3 seconds so status changes reflect immediately
  useEffect(() => {
    if (!userLocation) return;
    const interval = setInterval(() => {
      fetchPharmacies(userLocation.lat, userLocation.lng);
    }, 3000);

    return () => clearInterval(interval);
  }, [userLocation, fetchPharmacies]);

  return (
    <main className="min-h-screen p-8 bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              Cura Patient Finder
            </h1>
            <p className="text-slate-500 text-sm mt-1 tracking-wide font-medium">
              Real-time inventory mapping powered by live location.
            </p>
          </div>

          <div className="flex items-center gap-3">
            
            <div className="inline-flex rounded-lg bg-slate-200/80 p-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  activeTab === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive Map
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="text-slate-600 font-medium">Finding your exact location...</p>}
        {errorMsg && <p className="text-red-500 font-semibold">{errorMsg}</p>}

        {!loading && !errorMsg && (
          <>
            {activeTab === 'list' && (
              <div className="space-y-4">
                {pharmacies.length > 0 ? (
                  pharmacies.map((pharmacy: any) => (
                    <div
                      key={pharmacy.id}
                      className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex justify-between items-center transition hover:border-slate-200"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-normal font-sans">
                          {pharmacy.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 font-medium">
                          {pharmacy.phone} •{" "}
                          <span className="font-semibold text-emerald-600">
                            {pharmacy.distance_km} km away
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                          IN STOCK
                        </span>
                        <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
                          Reserve 60m
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No pharmacies found near your current location.</p>
                )}
              </div>
            )}

            {activeTab === 'map' && userLocation && (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <PharmacyMap
                  pharmacies={pharmacies}
                  center={[userLocation.lat, userLocation.lng]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}