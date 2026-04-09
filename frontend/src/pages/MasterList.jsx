import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";

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
  };

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
      alert("Failed to remote passenger");
    }
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><Loader text="Loading your passenger list..." /></div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Passenger Master List</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your frequently traveling passengers to speed up your Tatkal checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Add new passenger form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Add Passenger</h2>
          </div>
          
          <form onSubmit={handleAddPassenger} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                placeholder="E.g., Rahul Sharma"
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                placeholder="E.g., 28"
                value={newPassenger.age}
                onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" isLoading={isAdding}>
                Save Passenger
              </Button>
            </div>
          </form>
        </div>

        {/* Passenger List */}
        <div className="lg:col-span-2">
          {masterList.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-12 text-center h-full">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Your list is empty</h3>
              <p className="text-slate-500 text-sm max-w-xs">Add standard travelers here. They'll be available instantly during the Tatkal checkout.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {masterList.map((passenger) => (
                <div key={passenger._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100 flex-shrink-0">
                      {passenger.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{passenger.name}</p>
                      <p className="text-sm font-medium text-slate-500">{passenger.age} Years Old</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemovePassenger(passenger._id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove Passenger"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
