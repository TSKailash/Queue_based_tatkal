import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js"
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";

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
  const [passengerAssignments, setPassengerAssignments] = useState({}); // { [seatId]: passengerObj }
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
      setShowPassengerModal(true); // Open modal after locking
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
    const base = "relative flex items-center justify-center h-16 rounded-xl border-2 font-bold cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base select-none";
    
    if (!seat) return `${base} bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed`;

    if (seat.status === "BOOKED") return `${base} bg-rose-50 border-rose-200 text-rose-500 cursor-not-allowed hover:scale-100 opacity-60`;
    if (seat.status === "LOCKED_BY_OTHER") return `${base} bg-amber-50 border-amber-300 text-amber-600 cursor-not-allowed hover:scale-100 shadow-sm`;
    if (seat.status === "LOCKED_BY_ME") return `${base} bg-indigo-100 border-indigo-500 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10`;

    if (selectedSeats.includes(seatId)) return `${base} bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-200 z-10`;
    
    return `${base} bg-white border-green-400 text-slate-700 hover:border-green-500 hover:bg-green-50 hover:shadow-md`;
  };

  const seatIds = Array.from({ length: 20 }, (_, i) => `S${i + 1}`);

  if (initialLoad) return <Loader text="Loading live seat map..." />;

  return (
    <div className="flex-1 flex flex-col w-full pb-32">
       <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm transition-all">
         <div className="flex justify-between items-center max-w-7xl mx-auto gap-4">
           <div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Train <span className="text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">{trainId}</span></h2>
             <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Window Active
             </p>
           </div>
           
           <div className="flex items-center gap-2 sm:gap-4 bg-rose-50 border border-rose-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
             <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 animate-[spin_3s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <div className="text-xl sm:text-2xl font-mono font-bold text-rose-600 tracking-tighter w-12 sm:w-16 text-center">
               00:{remainingTime.toString().padStart(2, '0')}
             </div>
           </div>
         </div>
       </div>

       <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 text-xs sm:text-sm font-medium justify-center sm:justify-start">
         <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border-2 border-green-400"></div> Available</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-600 border-2 border-indigo-700"></div> Selected</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-100 border-2 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div> My Locks</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-rose-50 border-2 border-rose-200 opacity-70"></div> Booked</div>
         <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-50 border-2 border-amber-300"></div> Locked</div>
       </div>

       <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 sm:gap-4 mb-10 w-full max-w-5xl mx-auto">
         {seatIds.map((seatId) => (
           <div
             key={seatId}
             onClick={() => handleSeatClick(seatId)}
             className={getSeatStyle(seatId)}
           >
             {seatId}
             {seats[seatId]?.status === "LOCKED_BY_OTHER" && (
                <svg className="absolute -top-2 -right-2 w-5 h-5 text-amber-500 bg-white rounded-full border border-amber-200 shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
             )}
             {seats[seatId]?.status === "LOCKED_BY_ME" && (
                <svg className="absolute -top-2 -right-2 w-5 h-5 text-indigo-600 bg-white rounded-full border border-indigo-200 shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
             )}
           </div>
         ))}
       </div>

       {showPassengerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">Assign Passengers</h3>
              <button onClick={() => setShowPassengerModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">Master List</h4>
                <div className="flex gap-2 flex-wrap mb-4">
                  {masterList.length === 0 && <span className="text-slate-500 text-sm">No passengers saved.</span>}
                  {masterList.map((p, idx) => (
                    <div key={idx} className="bg-white border border-indigo-100 py-1.5 px-3 rounded-lg shadow-sm text-sm text-slate-700 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {p.name} ({p.age})
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newPassenger.name}
                    onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Age" 
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newPassenger.age}
                    onChange={(e) => setNewPassenger({...newPassenger, age: e.target.value})}
                  />
                  <Button onClick={handleAddPassengerToMasterList} variant="primary" size="sm" className="whitespace-nowrap px-4 bg-indigo-600 hover:bg-indigo-700">Add New</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Assign to Locked Seats</h4>
                {selectedSeats.map(seatId => (
                  <div key={seatId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 font-bold font-mono rounded-lg flex items-center justify-center border border-indigo-100">
                        {seatId}
                      </div>
                      <div className="text-sm">
                        {passengerAssignments[seatId] ? (
                          <span className="font-semibold text-slate-800">{passengerAssignments[seatId].name} <span className="text-slate-500 font-normal">({passengerAssignments[seatId].age} yrs)</span></span>
                        ) : (
                          <span className="text-rose-500 font-medium">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <select 
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs w-full sm:w-auto"
                      value={passengerAssignments[seatId]?._id || ""}
                      onChange={(e) => {
                        const selected = masterList.find(p => p._id === e.target.value);
                        if(selected) handleAssignPassenger(seatId, selected);
                      }}
                    >
                      <option value="" disabled>Select from Master List</option>
                      {masterList.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.age})</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
               <Button onClick={() => setShowPassengerModal(false)} variant="accent" className="bg-white">Close</Button>
               <Button onClick={confirmBooking} variant="primary" isLoading={loading} className="!bg-green-600 hover:!bg-green-700">Confirm Booking</Button>
            </div>
          </div>
        </div>
       )}

       <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 p-4 transform transition-transform">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex-1 w-full text-center sm:text-left">
              <span className="text-slate-500 text-sm font-medium block sm:inline">Selected:</span>
              <span className="font-bold text-lg ml-2 text-indigo-900">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              {selectedSeats.length > 0 && <span className="ml-2 text-sm text-slate-400">({selectedSeats.length} of 6 max)</span>}
           </div>
           
           <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="accent" 
                onClick={optOut} 
                isLoading={loading}
                className="flex-1 sm:flex-none text-sm sm:text-base py-3 !bg-rose-100 !text-rose-700 hover:!bg-rose-200 !border-rose-200 border"
              >
                Opt-out
              </Button>
              <Button 
                variant="accent" 
                onClick={lockSeats} 
                isLoading={loading}
                className="flex-1 sm:flex-none text-sm sm:text-base py-3"
              >
                Lock Checked
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  if (selectedSeats.length === 0) { alert("Select seats first"); return; }
                  setShowPassengerModal(true);
                }} 
                isLoading={loading}
                className="flex-1 sm:flex-none !bg-green-600 hover:!bg-green-700 shadow-green-200 text-sm sm:text-base py-3"
              >
                Confirm Now
              </Button>
           </div>
         </div>
       </div>
    </div>
  );
}
