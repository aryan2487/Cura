"use client";

import { useState } from "react";
import { MOCK_PHARMACIES, Pharmacy } from "./data/mockPharmacies";
import dynamic from "next/dynamic";
import { Search, MapPin, Navigation, Clock, CheckCircle2, AlertCircle } from "lucide-react";

// Dynamically load the map to prevent SSR window errors
const PharmacyMap = dynamic(() => import("@/components/PharmacyMap"), { ssr: false });

export default function PatientApp() {
  const [searchTerm, setSearchTerm] = useState("Insulin");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(MOCK_PHARMACIES);
  const [reservation, setReservation] = useState<{ pharmacyName: string; medicine: string } | null>(null);

  // Handle 60-minute hold reservation logic
  const handleReserve = (pharmacyId: string, medicineName: string) => {
    const targetPharmacy = pharmacies.find((p) => p.id === pharmacyId);
    if (targetPharmacy) {
      setReservation({
        pharmacyName: targetPharmacy.name,
        medicine: medicineName,
      });
      // Optional: Trigger a state change to decrement stock locally for demo impact
    }
  };

  // Filter pharmacies that carry the searched medicine
  const filteredPharmacies = pharmacies.filter((p) =>
    p.medicines.some((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pb-12">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl flex flex-col relative">
        
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 sticky top-0 z-20 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold tracking-tight">MedSpot 🩺</h1>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full font-medium">Last-Mile Access</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicine (e.g., Insulin, Inhaler)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-inner"
            />
          </div>
        </header>

        {/* Active Reservation Banner Alert */}
        {reservation && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-4 flex items-center justify-between text-emerald-800 animate-pulse">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Reserved: {reservation.medicine}</p>
                <p className="text-emerald-700">Held at {reservation.pharmacyName} for 60 mins.</p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        )}

        {/* View Switcher Tabs (List vs Map) */}
        <div className="flex border-b border-gray-200 bg-white sticky top-[116px] z-10">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
              viewMode === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            List View ({filteredPharmacies.length})
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
              viewMode === "map" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            Map View
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col space-y-4">
          {filteredPharmacies.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
              <p className="font-medium">No nearby pharmacies have this medicine right now.</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for "Insulin" or "Inhaler"</p>
            </div>
          ) : viewMode === "map" ? (
            <PharmacyMap pharmacies={filteredPharmacies} onReserve={handleReserve} selectedMedicine={searchTerm} />
          ) : (
            <div className="space-y-3">
              {filteredPharmacies.map((pharmacy) => {
                const med = pharmacy.medicines.find((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
                const status = med ? med.status : "Out of Stock";
                const price = med ? med.price : 0;

                return (
                  <div key={pharmacy.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">{pharmacy.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center mt-0.5">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {pharmacy.address} • <span className="font-semibold text-gray-700 ml-1">{pharmacy.distanceKm} km away</span>
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        status === "In Stock" ? "bg-green-100 text-green-700" :
                        status === "Low" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block">Price</span>
                        <span className="font-bold text-gray-900">₹{price}</span>
                      </div>

                      <div className="flex space-x-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg text-xs font-medium flex items-center"
                        >
                          <Navigation className="w-4 h-4 mr-1 text-blue-600" /> Navigate
                        </a>
                        {status !== "Out of Stock" && (
                          <button
                            onClick={() => handleReserve(pharmacy.id, med?.name || searchTerm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow"
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