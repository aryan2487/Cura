'use client';

import { useState, useEffect } from 'react';

export default function AdminPortal() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const invRes = await fetch('/api/inventory');
      const invData = await invRes.json();
      if (Array.isArray(invData)) setInventory(invData);

      const reqRes = await fetch('/api/medicine-requests');
      const reqData = await reqRes.json();
      if (Array.isArray(reqData)) setRequests(reqData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (medicineId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const res = await fetch('/api/medicine-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const deleteRequest = async (requestId: number) => {
    try {
      const res = await fetch('/api/medicine-requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error('Failed to delete request:', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <h1 className="text-2xl font-bold">Testing Pharmacy Owner Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage live stock and review incoming patient custom medicine requests.</p>
        </div>

        {/* Incoming Patient Custom Requests Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold text-amber-400">Incoming Patient Requests ("Others")</h2>

          {requests.length > 0 ? (
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
              {requests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100 text-md">{req.custom_medicine_name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      req.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                      req.status === 'Denied' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Denied')}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition"
                        >
                          Deny
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No incoming custom requests right now.</p>
          )}
        </div>

        {/* Standard Inventory List Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold">Standard Inventory Items</h2>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading inventory...</div>
          ) : inventory.length > 0 ? (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {inventory.map((item, index) => (
                <div 
                  key={`${item.medicine_id}-${index}`} 
                  className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-md font-bold text-slate-100">{item.medicine_name}</h2>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      item.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleStatus(item.medicine_id, item.status)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      item.status === 'In Stock'
                        ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                        : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                    }`}
                  >
                    Mark {item.status === 'In Stock' ? 'Out of Stock' : 'In Stock'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">No inventory found.</div>
          )}
        </div>

      </div>
    </main>
  );
}