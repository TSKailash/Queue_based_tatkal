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
      <div className="flex-1 flex justify-center items-center bg-slate-50">
        <div className="text-slate-500 font-medium">Fetching Passenger List...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      
      {/* Clean Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Master Passenger List</h1>
           <p className="text-slate-500 font-medium text-sm">Manage your frequently traveling passengers for faster Tatkal checkout.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Passenger Form */}
          <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h2 className="text-base font-semibold text-slate-800 p-5 border-b border-slate-100">Add New Passenger</h2>
            <div className="p-5">
               <form onSubmit={handleAddPassenger} className="space-y-4">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                   <input 
                     type="text" 
                     required
                     className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm text-slate-900"
                     placeholder="John Doe"
                     value={newPassenger.name}
                     onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                   <input 
                     type="number" 
                     required
                     min="1"
                     max="120"
                     className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm text-slate-900"
                     placeholder="28"
                     value={newPassenger.age}
                     onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
                   />
                 </div>
                 <div className="pt-2">
                   <button 
                     type="submit" 
                     disabled={isAdding}
                     className="w-full bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-slate-900 transition duration-150 disabled:opacity-70 text-sm shadow-sm"
                   >
                     {isAdding ? "Saving..." : "Save Passenger"}
                   </button>
                 </div>
               </form>
            </div>
          </div>

          {/* Passenger Data Table */}
          <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Saved Operations</h2>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold rounded-full border border-emerald-200">
                {masterList.length} Entries
              </span>
            </div>
            
            {masterList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm font-medium">
                No passengers added to Master List yet.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left bg-white min-w-full">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Age Limit</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {masterList.map((passenger) => (
                      <tr key={passenger._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 align-middle">
                          {passenger.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 align-middle">
                          {passenger.age} Years
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <button 
                            onClick={() => handleRemovePassenger(passenger._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Remove
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
