import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const trains = [
    { id: "trainA", name: "SHATABDI EXP", number: "12001", from: "NDLS", to: "BPL", dep: "06:00", arr: "14:25", class: "CC, EC", quota: "TATKAL" },
    { id: "trainB", name: "RAJDHANI EXP", number: "12951", from: "MMCT", to: "NDLS", dep: "17:00", arr: "08:32", class: "1A, 2A", quota: "TATKAL" },
    { id: "trainC", name: "VANDE BHARAT", number: "22436", from: "NDLS", to: "BSB", dep: "06:00", arr: "14:00", class: "CC, EC", quota: "TATKAL" },
    { id: "trainD", name: "DURONTO EXP", number: "12239", from: "BCT", to: "HWH", dep: "23:15", arr: "19:40", class: "1A, 2A, 3A", quota: "TATKAL" },
    { id: "trainE", name: "GARIB RATH", number: "12215", from: "DEE", to: "BDTS", dep: "08:55", arr: "08:10", class: "3A, CC", quota: "TATKAL" },
  ];

  const handleBookTrain = (trainId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/queue?train=${trainId}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-100 min-h-screen">
      
      {/* Heavy Header Block */}
      <section className="bg-slate-900 border-b-8 border-slate-800 text-white p-8 sm:p-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="inline-block bg-emerald-600 text-white font-black text-xs px-2 py-1 uppercase tracking-widest mb-4">
            Network Status: Operational
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            Priority Railway <br/> Booking Interface
          </h1>
          <div className="w-24 h-2 bg-emerald-600 mb-6"></div>
          <p className="text-lg text-slate-300 max-w-3xl font-medium leading-relaxed">
            Execute secure and immediate train queries. All services listed below are currently available for priority queuing.
          </p>
        </div>
      </section>

      {/* Main Table Interface */}
      <section className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
        
        <div className="w-full border-4 border-slate-900 bg-white">
          <div className="bg-slate-900 p-4 border-b-4 border-slate-900 flex justify-between items-center">
             <h2 className="text-white font-black uppercase tracking-widest text-lg">Active Train Registry</h2>
             <span className="bg-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase">5 Registers Active</span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-200 border-b-4 border-slate-900 text-xs font-black text-slate-900 uppercase tracking-widest">
                  <th className="py-4 px-6 border-r-2 border-slate-300">Identifier</th>
                  <th className="py-4 px-6 border-r-2 border-slate-300">Origin</th>
                  <th className="py-4 px-6 border-r-2 border-slate-300">Destination</th>
                  <th className="py-4 px-6 border-r-2 border-slate-300">Timing</th>
                  <th className="py-4 px-6 border-r-2 border-slate-300 bg-slate-300">Specs</th>
                  <th className="py-4 px-6 text-center w-48">Execution</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {trains.map((train, idx) => (
                  <tr key={train.id} className={`border-b-2 border-slate-300 hover:bg-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    
                    <td className="py-5 px-6 border-r-2 border-slate-300 align-middle">
                      <div className="font-black text-slate-900 text-lg uppercase leading-none">{train.name}</div>
                      <div className="text-sm text-slate-500 font-mono font-bold mt-1 tracking-widest">LOC-{train.number}</div>
                    </td>

                    <td className="py-5 px-6 border-r-2 border-slate-300 align-middle">
                      <div className="text-2xl font-black text-slate-900 font-mono">{train.from}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Depart</div>
                    </td>

                    <td className="py-5 px-6 border-r-2 border-slate-300 align-middle">
                      <div className="text-2xl font-black text-slate-900 font-mono">{train.to}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Arrive</div>
                    </td>

                    <td className="py-5 px-6 border-r-2 border-slate-300 align-middle">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-black text-slate-900 text-lg">{train.dep}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">OUT</div>
                        </div>
                        <div className="text-slate-300 font-mono">&rarr;</div>
                        <div>
                          <div className="font-black text-slate-900 text-lg">{train.arr}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">IN</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6 border-r-2 border-slate-300 align-middle bg-slate-50">
                      <div className="text-sm font-black text-slate-900">{train.class}</div>
                      <div className="inline-block mt-1 px-1 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-widest border border-emerald-900">
                        {train.quota}
                      </div>
                    </td>

                    <td className="py-5 px-6 align-middle bg-emerald-50">
                      <button 
                        onClick={() => handleBookTrain(train.id)}
                        className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-3 border-2 border-slate-900 hover:border-emerald-600 transition-none"
                      >
                        Execute
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
