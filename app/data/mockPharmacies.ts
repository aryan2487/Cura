export interface Pharmacy {
  id: string;
  name: string;
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  medicines: {
    name: string;
    status: "In Stock" | "Low" | "Out of Stock";
    price: number;
  }[];
}

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "1",
    name: "CityCare Pharmacy",
    distanceKm: 1.2,
    lat: 28.6139,
    lng: 77.2090,
    address: "124 Market Street",
    medicines: [
      { name: "Insulin", status: "In Stock", price: 450 },
      { name: "Inhaler", status: "In Stock", price: 280 },
    ],
  },
  {
    id: "2",
    name: "HealthPlus Chemist",
    distanceKm: 3.4,
    lat: 28.6200,
    lng: 77.2150,
    address: "45 Block C, Central Avenue",
    medicines: [
      { name: "Insulin", status: "Low", price: 460 },
      { name: "Inhaler", status: "Out of Stock", price: 300 },
    ],
  },
];