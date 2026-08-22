"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pharmacy } from "@/app/data/mockPharmacies";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  onReserve: (pharmacyId: string, medicineName: string) => void;
  selectedMedicine: string;
}

export default function PharmacyMap({ pharmacies, onReserve, selectedMedicine }: PharmacyMapProps) {
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pharmacies.map((pharmacy) => {
          const med = pharmacy.medicines.find((m) => m.name.toLowerCase() === selectedMedicine.toLowerCase());
          const status = med ? med.status : "Out of Stock";

          return (
            <Marker key={pharmacy.id} position={[pharmacy.lat, pharmacy.lng]} icon={defaultIcon}>
              <Popup>
                <div className="p-2 font-sans">
                  <h3 className="font-bold text-slate-900 text-sm">{pharmacy.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pharmacy.address} • <span className="font-semibold text-slate-700">{pharmacy.distanceKm} km</span></p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      status === "In Stock" ? "bg-emerald-100 text-emerald-700" :
                      status === "Low" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {status}
                    </span>
                    {status !== "Out of Stock" && (
                      <button
                        onClick={() => onReserve(pharmacy.id, selectedMedicine)}
                        className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm transition"
                      >
                        Reserve 60m
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}