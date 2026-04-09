import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function MasterList() {
  const [masterList, setMasterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPassenger, setNewPassenger] = useState({ name: "", age: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchMasterList();
  }, []);

  const fetchMasterList = async () => {
    try {
      const res = await api.get("/user/masterlist");
      setMasterList(res.data.masterList);
    } catch (err) {
      console.error("Failed to fetch master list", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPassenger = async (e) => {
    e.preventDefault();
    if (!newPassenger.name || !newPassenger.age) return;
    try {
      setIsAdding(true);
      const res = await api.post("/user/masterlist", newPassenger);
      setMasterList(res.data.masterList);
      setNewPassenger({ name: "", age: "" });
    } catch (err) {
      alert("Failed to add passenger");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePassenger = async (id) => {
    try {
      const res = await api.delete(`/user/masterlist/${id}`);
      setMasterList(res.data.masterList);
    } catch (err) {
      alert("Failed to remove passenger");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-slate-100">
        <div className="bg-slate-900 text-white font-black uppercase tracking-widest px-6 py-3 border-2 border-slate-900">Syncing Identity Data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      
      {/* Brutalist Title Header */}
      <div className="bg-slate-900 border-b-8 border-slate-800 text-white p-8 sm:p-12">
        <div className="max-w-7xl mx-auto w-full">
           <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-4">Identity Manifest</h1>
           <div className="w-16 h-2 bg-emerald-600 mb-4"></div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Operator Fast-Access Identity Cache</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Passenger Form */}
          <div className="w-full lg:w-1/3 border-4 border-slate-900 bg-white">
            <h2 className="text-lg font-black text-white bg-slate-900 p-4 uppercase tracking-widest mb-4">Append Identity</h2>
            <div className="p-6 pt-0">
               <form onSubmit={handleAddPassenger} className="space-y-6">
                 <div>
                   <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Legal Name</label>
                   <input 
                     type="text" 
                     required
                     className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 rounded-none transition-none text-slate-900 font-bold uppercase"
                     placeholder="DATA ENTRY"
                     value={newPassenger.name}
                     onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Recorded Age</label>
                   <input 
                     type="number" 
                     required
                     min="1"
                     max="120"
                     className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 rounded-none transition-none text-slate-900 font-bold"
                     placeholder="XX"
                     value={newPassenger.age}
                     onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
                   />
                 </div>
                 <div className="pt-2">
                   <button 
                     type="submit" 
                     disabled={isAdding}
                     className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 border-2 border-slate-900 hover:bg-slate-900 transition-none disabled:opacity-50"
                   >
                     {isAdding ? "Writing Data..." : "Execute Append"}
                   </button>
                 </div>
               </form>
            </div>
          </div>

          {/* Passenger Data Table */}
          <div className="w-full lg:w-2/3 border-4 border-slate-900 bg-white">
            <div className="p-4 bg-slate-900 border-b-4 border-slate-900 flex items-center justify-between">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Active Manifest</h2>
              <span className="bg-emerald-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_0_#94a3b8]">
                {masterList.length} Entries
              </span>
            </div>
            
            {masterList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest bg-slate-100">
                NO IDENTITY DATA FOUND ON THIS NODE.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left bg-white min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-200 border-b-4 border-slate-900 text-xs text-slate-900 font-black uppercase tracking-widest">
                      <th className="px-6 py-4 border-r-2 border-slate-300">Identity Tag</th>
                      <th className="px-6 py-4 border-r-2 border-slate-300">Life Factor</th>
                      <th className="px-6 py-4 text-center">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-300">
                    {masterList.map((passenger, idx) => (
                      <tr key={passenger._id} className={`hover:bg-emerald-50 transition-none ${idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <td className="px-6 py-4 text-base font-black text-slate-900 uppercase border-r-2 border-slate-300 align-middle">
                          {passenger.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 uppercase border-r-2 border-slate-300 align-middle">
                          {passenger.age} YRS
                        </td>
                        <td className="px-6 py-4 align-middle bg-slate-100 text-center">
                          <button 
                            onClick={() => handleRemovePassenger(passenger._id)}
                            className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-red-600 border-2 border-slate-900 transition-none"
                          >
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
