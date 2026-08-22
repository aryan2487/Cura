'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export interface Pharmacy {
  id: string | number;
  name: string;
  phone?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  onReserve: (pharmacyId: string | number, medicineName: string) => void;
  selectedMedicine: string;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PharmacyMap({ pharmacies, onReserve, selectedMedicine }: PharmacyMapProps) {
  const defaultCenter: [number, number] = [22.7196, 75.8577];

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pharmacies && pharmacies.map((pharmacy) => {
          // Fallback check for different possible database column names
          const latitude = pharmacy.lat ?? pharmacy.latitude ?? 22.7196;
          const longitude = pharmacy.lng ?? pharmacy.longitude ?? 75.8577;

          return (
            <Marker 
              key={pharmacy.id} 
              position={[latitude, longitude]} 
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2 font-sans">
                  <h3 className="font-bold text-slate-900 text-sm">{pharmacy.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📞 {pharmacy.phone || 'N/A'} • <span className="font-semibold text-slate-700">{pharmacy.distance_km ?? '1.2'} km</span>
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => onReserve(pharmacy.id, selectedMedicine)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm transition"
                    >
                      Reserve 60m
                    </button>
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