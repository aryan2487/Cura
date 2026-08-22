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
    name: "CityCare Apex Pharmacy",
    distanceKm: 0.8,
    lat: 28.6139,
    lng: 77.2090,
    address: "Shop 12, Main Market Road",
    medicines: [
      { name: "Insulin", status: "In Stock", price: 450 },
      { name: "Inhaler", status: "In Stock", price: 280 },
      { name: "Paracetamol", status: "In Stock", price: 40 },
    ],
  },
  {
    id: "2",
    name: "HealthFirst Chemist & Wellness",
    distanceKm: 2.1,
    lat: 28.6200,
    lng: 77.2150,
    address: "Block C-4, Central Avenue",
    medicines: [
      { name: "Insulin", status: "Low", price: 460 },
      { name: "Inhaler", status: "Out of Stock", price: 300 },
      { name: "Paracetamol", status: "In Stock", price: 35 },
    ],
  },
  {
    id: "3",
    name: "Lifeline 24/7 Pharmacy",
    distanceKm: 3.5,
    lat: 28.6050,
    lng: 77.1980,
    address: "Near Metro Station Gate 3",
    medicines: [
      { name: "Insulin", status: "In Stock", price: 440 },
      { name: "Inhaler", status: "Low", price: 275 },
    ],
  },
];