"use client";

import { useState } from "react";
import { MOCK_PHARMACIES, Pharmacy } from "./data/mockPharmacies";
import dynamic from "next/dynamic";
import { Search, MapPin, Navigation, Clock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

const PharmacyMap = dynamic(() => import("@/components/PharmacyMap"), { ssr: false });

export default function PatientApp() {
  const [searchTerm, setSearchTerm] = useState("Insulin");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [pharmacies] = useState<Pharmacy[]>(MOCK_PHARMACIES);
  const [reservation, setReservation] = useState<{ pharmacyName: string; medicine: string } | null>(null);

  const handleReserve = (pharmacyId: string, medicineName: string) => {
    const targetPharmacy = pharmacies.find((p) => p.id === pharmacyId);
    if (targetPharmacy) {
      setReservation({
        pharmacyName: targetPharmacy.name,
        medicine: medicineName,
      });
    }
  };

  const filteredPharmacies = pharmacies.filter((p) =>
    p.medicines.some((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-0 sm:py-6">
      {/* Mobile App Container Frame */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden border border-slate-200">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 sticky top-0 z-20 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Cura <span className="text-emerald-300">MedSpot</span></h1>
                <p className="text-[11px] text-indigo-100 font-medium">Real-time emergency access</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Live Sync
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search medicine (e.g., Insulin, Inhaler)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-900 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-medium shadow-inner transition"
            />
          </div>
        </header>

        {/* Active Reservation Banner */}
        {reservation && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3.5 px-5 flex items-center justify-between text-emerald-900 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-xs">
                <p className="font-bold">Reserved: {reservation.medicine}</p>
                <p className="text-emerald-700 text-[11px]">Held for 60 mins at {reservation.pharmacyName}</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          </div>
        )}

        {/* View Tabs */}
        <div className="flex border-b border-slate-100 bg-white sticky top-[132px] z-10 px-4 pt-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all ${
              viewMode === "list" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            List View ({filteredPharmacies.length})
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all ${
              viewMode === "map" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Interactive Map
          </button>
        </div>

        {/* Main Body */}
        <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto bg-slate-50/50">
          {filteredPharmacies.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-4 rounded-full mb-3">
                <AlertCircle className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-700">No pharmacies found nearby.</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Insulin" or "Paracetamol"</p>
            </div>
          ) : viewMode === "map" ? (
            <PharmacyMap pharmacies={filteredPharmacies} onReserve={handleReserve} selectedMedicine={searchTerm} />
          ) : (
            <div className="space-y-3 pb-6">
              {filteredPharmacies.map((pharmacy) => {
                const med = pharmacy.medicines.find((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
                const status = med ? med.status : "Out of Stock";
                const price = med ? med.price : 0;

                return (
                  <div key={pharmacy.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm tracking-tight">{pharmacy.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                          {pharmacy.address} • <span className="font-semibold text-slate-700 ml-1">{pharmacy.distanceKm} km away</span>
                        </p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider ${
                        status === "In Stock" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        status === "Low" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Unit Price</span>
                        <span className="font-black text-slate-900 text-base">₹{price}</span>
                      </div>

                      <div className="flex space-x-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center transition"
                        >
                          <Navigation className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Directions
                        </a>
                        {status !== "Out of Stock" && (
                          <button
                            onClick={() => handleReserve(pharmacy.id, med?.name || searchTerm)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm shadow-indigo-200 transition"
                          >
                            Reserve 60m
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}