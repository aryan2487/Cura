'use client';

import React, { useState } from 'react';

export default function PharmacyPortal() {
  const [inventory, setInventory] = useState([
    { id: 'RX-1042', name: 'Insulin Glargine', category: 'Diabetes', status: 'In Stock' },
    { id: 'RX-1043', name: 'Albuterol Inhaler', category: 'Respiratory', status: 'Out of Stock' },
    { id: 'RX-1044', name: 'Amoxicillin 500mg', category: 'Antibiotics', status: 'Low' },
    { id: 'RX-1045', name: 'Lisinopril 10mg', category: 'Cardiovascular', status: 'In Stock' },
    { id: 'RX-1046', name: 'Atorvastatin 20mg', category: 'Cardiovascular', status: 'In Stock' },
  ]);

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = 
      currentStatus === 'In Stock' ? 'Low' : 
      currentStatus === 'Low' ? 'Out of Stock' : 'In Stock';
      
    setInventory(inventory.map((item) => 
      item.id === id ? { ...item, status: nextStatus } : item
    ));
  };

  const getButtonStyles = (status: string) => {
    if (status === 'In Stock') return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    if (status === 'Low') return 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-transparent';
    if (status === 'Out of Stock') return 'bg-white hover:bg-gray-50 text-gray-500 border-gray-300';
    return 'bg-gray-100 text-gray-900 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <main className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
              Cura Pharmacy Portal
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage live inventory levels and automated SMS fallbacks.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              System Online
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Essential Stock</h3>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {inventory.length} Records
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Medicine Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">
                      {item.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                      <button 
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`inline-flex items-center justify-center w-32 px-3 py-2 text-sm font-semibold rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all ${getButtonStyles(item.status)}`}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}