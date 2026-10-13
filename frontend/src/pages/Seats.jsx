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

    const leaveActive = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`http://localhost:5000/queue/optout/${trainId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          keepalive: true
        }).catch(console.error);
      }
    };

    window.addEventListener("beforeunload", leaveActive);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", leaveActive);
      // Wait we don't want to call leaveActive on standard unmount like when navigating to history after successful booking
      // Let's only handle tab close here.
    };
  }, [trainId]);

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
    const base = "relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-md border text-sm font-semibold cursor-pointer transition-colors select-none shadow-sm";
    
    // Status Logic
    if (!seat) return `${base} bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed shadow-none`;

    if (seat.status === "BOOKED") return `${base} bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60 shadow-none`;
    if (seat.status === "LOCKED_BY_OTHER") return `${base} bg-amber-500 border-amber-600 text-white cursor-not-allowed shadow-none`;
    if (seat.status === "LOCKED_BY_ME") return `${base} bg-white border-2 border-emerald-500 text-emerald-700 z-10`;

    if (selectedSeats.includes(seatId)) return `${base} bg-emerald-600 border-emerald-700 text-white z-10 shadow-md transform scale-105 transition-transform duration-150`;
    
    // Available
    return `${base} bg-white border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 z-0`;
  };

  const seatIds = Array.from({ length: 40 }, (_, i) => `S${i + 1}`);

  if (initialLoad) return (
     <div className="flex-1 flex justify-center items-center bg-slate-50">
        <div className="text-slate-500 font-medium">Loading seat availability...</div>
     </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative pb-32">
       {/* Clean Top Bar */}
       <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm py-4 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-900">
           <div className="flex flex-col">
             <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Train: {trainId}</h2>
             <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-1 flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                 Booking Active
             </span>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
                <span className="text-xs font-medium text-slate-500 block">Session closes in</span>
             </div>
             <div className="bg-slate-50 text-red-600 font-mono text-2xl font-bold px-4 py-1.5 rounded-md border border-slate-200">
               00:{remainingTime.toString().padStart(2, '0')}
             </div>
           </div>
         </div>
       </div>

       {/* Main Grid/Control Split */}
       <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
          
          {/* Seat Grid Block */}
          <div className="flex-1">
             <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                
                {/* Neat Legend */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 pb-6 border-b border-slate-100 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded border border-slate-300 bg-white"></div> Available</div>
                  <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded border border-emerald-700 bg-emerald-600"></div> Selected</div>
                  <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded border-2 border-emerald-500 bg-white"></div> Locked by you</div>
                  <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded border border-amber-600 bg-amber-500"></div> Booked by others</div>
                  <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded border border-slate-300 bg-slate-200"></div> Unavailable</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
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

          {/* Passenger Assignment Sidebar */}
          <div className="w-full xl:w-[380px]">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm sticky top-32 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                  <h3 className="text-sm font-semibold text-slate-800">Passenger Assignment</h3>
                </div>
                
                <div className="p-6">
                  {selectedSeats.length === 0 ? (
                     <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center">
                       <span className="text-sm text-slate-500 font-medium">Please select seats from the map to assign passengers.</span>
                     </div>
                  ) : (
                     <div className="space-y-4">
                       {selectedSeats.map(seatId => (
                          <div key={seatId} className="border border-slate-200 rounded-md p-4">
                             <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-sm text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{seatId}</span>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Selected</span>
                             </div>
                             <select 
                               className="w-full px-3 py-2 bg-white border border-slate-300 text-sm text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                               value={passengerAssignments[seatId]?._id || ""}
                               onChange={(e) => {
                                 const selected = masterList.find(p => p._id === e.target.value);
                                 if(selected) handleAssignPassenger(seatId, selected);
                               }}
                             >
                               <option value="" disabled>-- Select passenger --</option>
                               {masterList.map(p => (
                                 <option key={p._id} value={p._id}>{p.name} (Age {p.age})</option>
                               ))}
                             </select>
                          </div>
                       ))}
                     </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Add Passenger</h4>
                      <div className="flex flex-col gap-3">
                         <input 
                           type="text" 
                           placeholder="Full Name" 
                           className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                           value={newPassenger.name}
                           onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                         />
                         <div className="flex gap-3">
                           <input 
                             type="number" 
                             placeholder="Age" 
                             className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                             value={newPassenger.age}
                             onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
                           />
                           <button 
                             onClick={handleAddPassengerToMasterList} 
                             className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-md transition-colors border border-slate-200"
                           >
                             Add
                           </button>
                         </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
       </div>

       {/* Professional Sticky Action Bar */}
       <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="text-slate-600 text-sm font-medium">
              Selected Seats: <strong className="ml-1 text-slate-900 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
           </div>
           
           <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={optOut} 
                disabled={loading}
                className="flex-1 sm:flex-none bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 font-semibold py-2 px-6 rounded-md text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={lockSeats} 
                disabled={loading}
                className="flex-1 sm:flex-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold py-2 px-6 rounded-md text-sm transition-colors"
              >
                Lock Assigned
              </button>
              <button 
                onClick={confirmBooking} 
                disabled={loading}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-8 rounded-md text-sm transition-colors shadow-sm"
              >
                Confirm Payment
              </button>
           </div>
         </div>
       </div>
    </div>
  );
}
