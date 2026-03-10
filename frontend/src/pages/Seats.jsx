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

  const fetchSeats = async () => {
    try {
      const res = await api.get(`/seats/status/${trainId}`);
      setSeats(res.data.seats);
    } catch (err) {
      console.error("Failed to fetch seats");
    } finally {
      if(initialLoad) setInitialLoad(false);
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

  useEffect(() => {
    fetchSeats();
    fetchActiveStatus();

    const interval = setInterval(() => {
      fetchSeats();
      fetchActiveStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleSeatClick = (seatId) => {
    const seat = seats[seatId];
    if (!seat || seat.status !== "AVAILABLE") return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
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
    try {
      setLoading(true);
      await api.post(`/booking/confirm/${trainId}`, { seats: selectedSeats });
      navigate("/history");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
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
                onClick={lockSeats} 
                isLoading={loading}
                className="flex-1 sm:flex-none text-sm sm:text-base py-3"
              >
                Lock Checked
              </Button>
              <Button 
                variant="primary" 
                onClick={confirmBooking} 
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
