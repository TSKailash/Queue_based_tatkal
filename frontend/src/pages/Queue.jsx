import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";

export default function Queue() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryTrain = new URLSearchParams(location.search).get("train");

  const [trainId, setTrainId] = useState(queryTrain || "trainA");
  const [joined, setJoined] = useState(false);
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Join Queue
  const handleJoin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/queue/join/${trainId}`);
      setJoined(true);
      setPosition(res.data.position);
      setStatus(res.data.status);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join queue");
    } finally {
      setLoading(false);
    }
  };

  // Poll queue status
  useEffect(() => {
    if (!joined) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/queue/status/${trainId}`);
        setPosition(res.data.position);
        setStatus(res.data.status);

        if (res.data.status === "ACTIVE") {
          clearInterval(interval);
          navigate(`/seats/${trainId}`);
        }
      } catch (err) {
        console.log("Polling error");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [joined, trainId, navigate]);

  return (
    <div className="w-full flex-1 flex flex-col pt-8">
      {!joined ? (
         <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-10 text-white">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Secure your Tatkal seat</h1>
                <p className="text-indigo-100 text-lg max-w-xl">Enter the Train ID below to join the priority queue. Once the window opens, you'll be redirected instantly to lock your seats.</p>
              </div>
              <div className="p-8 sm:p-10">
                <div className="max-w-md">
                   <div className="flex gap-4 items-end">
                     <div className="flex-1">
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-sm font-medium text-slate-700">Select Train</label>
                          <select
                            value={trainId}
                            onChange={(e) => setTrainId(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-800 font-semibold uppercase font-mono h-11"
                          >
                            <option value="trainA">Shatabdi Exp (trainA)</option>
                            <option value="trainB">Rajdhani Exp (trainB)</option>
                            <option value="trainC">Vande Bharat (trainC)</option>
                            <option value="trainD">Duronto Exp (trainD)</option>
                            <option value="trainE">Garib Rath (trainE)</option>
                          </select>
                        </div>
                     </div>
                     <Button 
                        onClick={handleJoin} 
                        disabled={loading || !trainId.trim()} 
                        variant="accent"
                        size="md"
                        className="mb-[2px] h-11"
                     >
                        {loading ? "Joining..." : "Join Queue"}
                     </Button>
                   </div>
                   <p className="mt-4 text-sm text-slate-500">
                     Our automated polling ensures you enter the seat selection map exactly when the booking window turns active.
                   </p>
                </div>
              </div>
            </div>
         </div>
      ) : (
         <div className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full text-center relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
              
              <Loader text="Waiting for Tatkal window..." />
              
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                  <p className={`text-xl font-bold ${status === 'WAITING' ? 'text-amber-500' : 'text-indigo-600'}`}>
                    {status || "POLLING..."}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Queue Pos</p>
                  <p className="text-xl font-bold text-slate-900">
                    #{position || "..."}
                  </p>
                </div>
              </div>
            </div>
         </div>
      )}
    </div>
  );
}
