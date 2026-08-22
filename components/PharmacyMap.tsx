"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pharmacy } from "@/app/data/mockPharmacies";

// Fix for default Leaflet marker icons in Next.js
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
  // Center map roughly around mock coordinates (e.g., Delhi/Central point)
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md z-0">
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
                <div className="p-1">
                  <h3 className="font-bold text-gray-900">{pharmacy.name}</h3>
                  <p className="text-xs text-gray-600">{pharmacy.address} ({pharmacy.distanceKm} km away)</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      status === "In Stock" ? "bg-green-100 text-green-700" :
                      status === "Low" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>
                      {status}
                    </span>
                    {status !== "Out of Stock" && (
                      <button
                        onClick={() => onReserve(pharmacy.id, selectedMedicine)}
                        className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 font-medium"
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