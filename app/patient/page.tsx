'use client';

import { useState, useEffect } from 'react';

export default function PatientPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [customMedicine, setCustomMedicine] = useState<string>('');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/medicine-requests');
      const data = await res.json();
      if (Array.isArray(data)) setMyRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetch('/api/medicines')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMedicines(data);
          if (data.length > 0) setSelectedMedicine(data[0].id.toString());
        }
      });
    fetchRequests();
  }, []);

  useEffect(() => {
    if (!selectedMedicine || selectedMedicine === 'others') return;

    setLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(`/api/pharmacies?lat=${lat}&lng=${lng}&medicineId=${selectedMedicine}`);
          const data = await res.json();
          setPharmacies(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Failed to fetch pharmacies:', err);
          setPharmacies([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }, [selectedMedicine]);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMedicine.trim()) return;

    try {
      const res = await fetch('/api/medicine-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customMedicineName: customMedicine }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomMedicine('');
        fetchRequests();
      }
    } catch (err) {
      console.error('Failed to send request:', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Find Medicine Nearby</h1>
          <p className="text-slate-500 text-sm">Select a medicine to check local store stock or request a custom item.</p>
          
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Select Medicine
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {medicines.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name}
                </option>
              ))}
              <option value="others">Others (Type manually)</option>
            </select>
          </div>

          {/* Custom Medicine Form */}
          {selectedMedicine === 'others' && (
            <div className="space-y-4 pt-2">
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-600">Enter Medicine Name for Testing Pharmacy</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Pantoprazole 40mg"
                    value={customMedicine}
                    onChange={(e) => setCustomMedicine(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                  >
                    Send Request
                  </button>
                </div>
              </form>

              {/* Live Request Tracker */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700">Your Submitted Requests & Pharmacy Status</h3>
                  <button onClick={fetchRequests} className="text-xs text-blue-600 hover:underline">Refresh Status</button>
                </div>

                {myRequests.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {myRequests.map((req) => (
                      <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800">{req.custom_medicine_name}</span>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          req.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'Denied' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status === 'Confirmed' ? '✓ Confirmed by Pharmacy' :
                           req.status === 'Denied' ? '✕ Denied / Out of Stock' : '⏳ Pending Review'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No requests submitted yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {selectedMedicine !== 'others' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Available Pharmacies</h2>

            {loading ? (
              <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100">
                Locating nearby stores...
              </div>
            ) : pharmacies.length > 0 ? (
              <div className="space-y-3">
                {pharmacies.map((pharmacy: any, index: number) => (
                  <div
                    key={`${pharmacy.id}-${index}`}
                    className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex justify-between items-center transition hover:border-slate-200"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-800 text-lg">{pharmacy.name}</h3>
                      <p className="text-slate-500 text-sm">Phone: {pharmacy.phone || 'N/A'}</p>
                      <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">
                        In Stock
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">
                        {pharmacy.distance_km ? `${pharmacy.distance_km} km` : 'Nearby'}
                      </span>
                      <p className="text-xs text-slate-400">away</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100">
                No pharmacies found with this medicine in stock near you.
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}