import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const trains = [
    { id: "trainA", name: "Shatabdi Express", number: "12001", from: "NDLS", to: "BPL", dep: "06:00", arr: "14:25", class: "CC, EC", quota: "TATKAL" },
    { id: "trainB", name: "Rajdhani Express", number: "12951", from: "MMCT", to: "NDLS", dep: "17:00", arr: "08:32", class: "1A, 2A", quota: "TATKAL" },
    { id: "trainC", name: "Vande Bharat", number: "22436", from: "NDLS", to: "BSB", dep: "06:00", arr: "14:00", class: "CC, EC", quota: "TATKAL" },
    { id: "trainD", name: "Duronto Express", number: "12239", from: "BCT", to: "HWH", dep: "23:15", arr: "19:40", class: "1A, 2A, 3A", quota: "TATKAL" },
    { id: "trainE", name: "Garib Rath", number: "12215", from: "DEE", to: "BDTS", dep: "08:55", arr: "08:10", class: "3A, CC", quota: "TATKAL" },
  ];

  const handleBookTrain = (trainId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/queue?train=${trainId}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* Modern Clean Header */}
      <section className="bg-slate-900 border-b border-slate-800 text-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 text-emerald-400 text-sm font-medium">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Tatkal Booking System Online
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Secure your priority travel seats.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Reserve waitlist priority securely across all national lines. Please browse the verified train catalog and proceed to book.
          </p>
        </div>
      </section>

      {/* Main Table Interface */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-5 px-6 flex justify-between items-center">
             <div>
               <h2 className="text-lg font-bold text-slate-800">Available Trains</h2>
               <p className="text-sm text-slate-500 mt-0.5">Select a train to access the booking engine queue.</p>
             </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left bg-white text-sm">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                  <th className="py-4 px-6 font-semibold">Train Service</th>
                  <th className="py-4 px-6 font-semibold">Origin</th>
                  <th className="py-4 px-6 font-semibold">Destination</th>
                  <th className="py-4 px-6 font-semibold">Timings</th>
                  <th className="py-4 px-6 font-semibold">Classes</th>
                  <th className="py-4 px-6 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6 align-middle">
                      <div className="font-semibold text-slate-900 text-base">{train.name}</div>
                      <div className="text-slate-500 font-mono mt-1 text-xs">NO. {train.number}</div>
                    </td>

                    <td className="py-5 px-6 align-middle">
                      <div className="font-semibold text-slate-900 text-base">{train.from}</div>
                      <div className="text-slate-500 text-xs mt-1">Departure</div>
                    </td>

                    <td className="py-5 px-6 align-middle">
                      <div className="font-semibold text-slate-900 text-base">{train.to}</div>
                      <div className="text-slate-500 text-xs mt-1">Arrival</div>
                    </td>

                    <td className="py-5 px-6 align-middle text-slate-900">
                      <div className="flex items-center gap-3">
                         <div className="font-medium">{train.dep}</div>
                         <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                         <div className="font-medium">{train.arr}</div>
                      </div>
                    </td>

                    <td className="py-5 px-6 align-middle">
                      <div className="font-medium text-slate-800">{train.class}</div>
                      <div className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
                        {train.quota}
                      </div>
                    </td>

                    <td className="py-5 px-6 align-middle text-right">
                      <button 
                        onClick={() => handleBookTrain(train.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-5 rounded-md transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full sm:w-auto"
                      >
                        Book Now
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </section>
    </div>
  );
}
