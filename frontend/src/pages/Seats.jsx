import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js"
import { AuthContext } from "../context/AuthContext";

export default function SeatPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Master List State
  const [masterList, setMasterList] = useState([]);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passengerAssignments, setPassengerAssignments] = useState({});
  const [newPassenger, setNewPassenger] = useState({ name: "", age: "" });

  const fetchSeats = async () => {
    try {
      const res = await api.get(`/seats/status/${trainId}`);
      setSeats(res.data.seats);
    } catch (err) {
      console.error("Failed to fetch seats");
    } finally {
      setInitialLoad(false);
    }
  };

  const fetchActiveStatus = async () => {
    try {
      const res = await api.get(`/queue/status/${trainId}`);
      if (res.data.status !== "ACTIVE") {
        navigate("/queue");
      } else {
        setRemainingTime(res.data.remainingTime);
      }
    } catch (err) {
      console.error("Failed to fetch active status");
    }
  };

  const fetchMasterList = async () => {
    try {
      const res = await api.get("/user/masterlist");
      setMasterList(res.data.masterList);
    } catch (err) {
      console.error("Failed to fetch master list");
    }
  };

  useEffect(() => {
    fetchSeats();
    fetchActiveStatus();
    fetchMasterList();

    const interval = setInterval(() => {
      fetchSeats();
      fetchActiveStatus();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatClick = (seatId) => {
    const seat = seats[seatId];
    if (!seat || seat.status !== "AVAILABLE") return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      const newAssignments = { ...passengerAssignments };
      delete newAssignments[seatId];
      setPassengerAssignments(newAssignments);
    } else {
      if (selectedSeats.length >= 6) {
        alert("Maximum 6 seats allowed");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const lockSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Select seats first");
      return;
    }
    try {
      setLoading(true);
      await api.post(`/seats/lock/${trainId}`, { seats: selectedSeats });
      fetchSeats();
      setShowPassengerModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Lock failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Select seats first");
      return;
    }

    const passengers = selectedSeats.map((seat) => {
      const p = passengerAssignments[seat];
      return { seat, name: p?.name, age: p?.age };
    });

    if (passengers.some((p) => !p.name || !p.age)) {
      alert("Please assign all passengers to your selected seats.");
      setShowPassengerModal(true);
      return;
    }

    try {
      setLoading(true);
      await api.post(`/booking/confirm/${trainId}`, { seats: selectedSeats, passengers });
      navigate("/history");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const optOut = async () => {
    try {
      setLoading(true);
      await api.post(`/queue/optout/${trainId}`);
      navigate("/queue");
    } catch (err) {
      alert(err.response?.data?.message || "Opt-out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassengerToMasterList = async () => {
    if (!newPassenger.name || !newPassenger.age) return;
    try {
      const res = await api.post("/user/masterlist", newPassenger);
      setMasterList(res.data.masterList);
      setNewPassenger({ name: "", age: "" });
    } catch (err) {
      alert("Failed to add passenger");
    }
  };

  const handleAssignPassenger = (seatId, passenger) => {
    setPassengerAssignments({
      ...passengerAssignments,
      [seatId]: passenger,
    });
  };

  const getSeatStyle = (seatId) => {
    const seat = seats[seatId];
    const base = "relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 border-2 font-black cursor-pointer transition-none text-xs sm:text-sm select-none uppercase tracking-widest";
    
    // Status Logic
    if (!seat) return `${base} bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed`;

    if (seat.status === "BOOKED") return `${base} bg-slate-800 border-slate-900 text-slate-400 cursor-not-allowed opacity-40`;
    if (seat.status === "LOCKED_BY_OTHER") return `${base} bg-orange-500 border-slate-900 text-slate-900 cursor-not-allowed shadow-[2px_2px_0_0_#0f172a]`;
    if (seat.status === "LOCKED_BY_ME") return `${base} bg-white border-emerald-600 text-emerald-700 underline shadow-[4px_4px_0_0_#059669] z-10`;

    if (selectedSeats.includes(seatId)) return `${base} bg-emerald-600 border-slate-900 text-white shadow-[4px_4px_0_0_#0f172a] z-10`;
    
    // Available
    return `${base} bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-100 hover:shadow-[4px_4px_0_0_#0f172a] z-0`;
  };

  const seatIds = Array.from({ length: 40 }, (_, i) => `S${i + 1}`);

  if (initialLoad) return (
     <div className="flex-1 flex justify-center items-center bg-slate-100">
        <div className="bg-slate-900 text-white font-black uppercase tracking-widest px-6 py-3 border-2 border-slate-900">FETCHING TOPOLOGY...</div>
     </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-100 relative pb-32">
       {/* High Contrast Top Bar */}
       <div className="bg-slate-900 border-b-4 border-emerald-600 sticky top-0 z-40 py-4 px-4 sm:px-8">
         <div className="w-full flex justify-between items-center text-white">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Sector</span>
             <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest">{trainId}-BLOCK</h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 block">Time to Auto-Close</span>
                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest pulse-slow">Window Live</span>
             </div>
             <div className="bg-white text-slate-900 text-3xl font-black px-4 py-2 border-2 border-slate-900 shadow-[4px_4px_0_0_#059669]">
               00:{remainingTime.toString().padStart(2, '0')}
             </div>
           </div>
         </div>
       </div>

       {/* Main Grid/Control Split */}
       <div className="w-full mx-auto px-4 sm:px-8 py-8 flex flex-col xl:flex-row gap-8">
          
          {/* Seat Grid Block */}
          <div className="flex-1">
             <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0_0_#0f172a]">
                
                {/* Heavy Legend */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 pb-6 border-b-4 border-slate-900 text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-slate-300 bg-white shadow-[2px_2px_0_0_#cbd5e1]"></div> OPEN</div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-slate-900 bg-emerald-600 shadow-[2px_2px_0_0_#0f172a]"></div> ASSIGNED TO YOU</div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-emerald-600 bg-white underline shadow-[2px_2px_0_0_#059669]"></div> YOUR LOCK</div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-slate-900 bg-orange-500 shadow-[2px_2px_0_0_#0f172a]"></div> EXTERNAL LOCK</div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-slate-900 bg-slate-800 opacity-40"></div> INVALID/PURCHASED</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-5 justify-items-center">
                  {seatIds.map((seatId) => (
                    <div
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      className={getSeatStyle(seatId)}
                    >
                      {seatId}
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Passenger Injection Control */}
          <div className="w-full xl:w-[400px]">
             <div className="bg-slate-900 border-4 border-slate-900 p-px shadow-[8px_8px_0_0_#059669] sticky top-32">
                <h3 className="bg-slate-900 text-white font-black uppercase tracking-widest p-4">Passenger Binding</h3>
                
                <div className="bg-white p-6">
                  {selectedSeats.length === 0 ? (
                     <div className="bg-slate-100 border-2 border-slate-900 p-6 text-center">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest">No target slots selected</span>
                     </div>
                  ) : (
                     <div className="space-y-4">
                       {selectedSeats.map(seatId => (
                          <div key={seatId} className="bg-slate-50 border-2 border-slate-900 p-4">
                             <div className="flex justify-between items-center mb-3">
                                <span className="font-black text-lg text-slate-900">{seatId}</span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-600 px-1">TGT ENABLED</span>
                             </div>
                             <select 
                               className="w-full px-3 py-3 bg-white border-2 border-slate-900 text-xs font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:bg-emerald-50 rounded-none cursor-pointer"
                               value={passengerAssignments[seatId]?._id || ""}
                               onChange={(e) => {
                                 const selected = masterList.find(p => p._id === e.target.value);
                                 if(selected) handleAssignPassenger(seatId, selected);
                               }}
                             >
                               <option value="" disabled>-- SELECT IDENTITY --</option>
                               {masterList.map(p => (
                                 <option key={p._id} value={p._id}>{p.name} (AGE {p.age})</option>
                               ))}
                             </select>
                          </div>
                       ))}
                     </div>
                  )}

                  <div className="mt-8 pt-6 border-t-4 border-slate-900">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Manual Override - Add Identity</h4>
                      <div className="flex flex-col gap-3">
                         <input 
                           type="text" 
                           placeholder="FULL NAME" 
                           className="px-4 py-3 bg-slate-100 border-2 border-slate-900 rounded-none text-xs font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:bg-white"
                           value={newPassenger.name}
                           onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                         />
                         <div className="flex gap-3">
                           <input 
                             type="number" 
                             placeholder="AGE" 
                             className="w-24 px-4 py-3 bg-slate-100 border-2 border-slate-900 rounded-none text-xs font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:bg-white"
                             value={newPassenger.age}
                             onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
                           />
                           <button 
                             onClick={handleAddPassengerToMasterList} 
                             className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-none border-2 border-slate-900"
                           >
                             Inject
                           </button>
                         </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
       </div>

       {/* Heavy Execution Bar */}
       <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t-8 border-emerald-600 p-4 sm:p-6 z-50">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="text-white text-xs font-black tracking-widest uppercase">
              Targets Captured: <strong className="ml-2 text-lg text-emerald-400 font-mono tracking-tighter bg-slate-800 px-3 py-1 border border-emerald-600">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'NONE'}</strong>
           </div>
           
           <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={optOut} 
                disabled={loading}
                className="flex-1 sm:flex-none border-2 border-slate-400 text-slate-300 hover:bg-slate-800 font-black py-4 px-6 uppercase tracking-widest text-xs transition-none"
              >
                Abort
              </button>
              <button 
                onClick={lockSeats} 
                disabled={loading}
                className="flex-1 sm:flex-none bg-slate-800 border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-900 hover:text-white font-black py-4 px-6 uppercase tracking-widest text-xs transition-none"
              >
                Engage Locks
              </button>
              <button 
                onClick={confirmBooking} 
                disabled={loading}
                className="flex-[2] sm:flex-none bg-emerald-600 hover:bg-white hover:text-slate-900 text-white border-2 border-emerald-600 font-black py-4 px-10 uppercase tracking-widest text-sm transition-none"
              >
                Execute Transaction
              </button>
           </div>
         </div>
       </div>
    </div>
  );
}
