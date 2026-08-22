import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="max-w-3xl w-full bg-white p-10 sm:p-14 rounded-3xl shadow-xl border border-slate-100 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to Cura
        </h1>
        <p className="text-slate-500 mb-12 text-lg font-medium">
          Please select your portal to continue.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Patient Portal Button */}
          <Link 
            href="/patient" 
            className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-indigo-50 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">👤</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">I am a Patient</h2>
            <p className="text-sm text-slate-500 font-medium">Find medicines and pharmacies near you.</p>
          </Link>

          {/* Pharmacy Admin Portal Button */}
          <Link 
            href="/admin" 
            className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-emerald-50 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">🏥</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Pharmacy Owner</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your live inventory and status.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}