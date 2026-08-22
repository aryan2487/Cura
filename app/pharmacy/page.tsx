'use client';
import { useState } from 'react';

const initialInventory = [
  { id: 1, name: 'Insulin Glargine', status: 'In Stock' },
  { id: 2, name: 'Albuterol Inhaler', status: 'Out of Stock' },
];

export default function PharmacyPortal() {
  const [inventory] = useState(initialInventory);

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cura Pharmacy Dashboard</h1>
      <div className="space-y-4">
        {inventory.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
            <span className="font-semibold">{item.name}</span>
            <button className="px-4 py-2 rounded-md font-medium text-white bg-blue-600">
              {item.status}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}