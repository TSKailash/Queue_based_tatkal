import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

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
      alert(err.response?.data?.message || "Failed to joint queue");
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
    <div className="w-full flex-1 flex flex-col bg-slate-100 justify-center items-center p-4">
      <div className="max-w-2xl w-full">
        {!joined ? (
          <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a]">
            <div className="p-8 border-b-4 border-slate-900 bg-slate-900 text-white">
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Priority Sector Connection</h1>
              <div className="w-16 h-1 bg-emerald-600 mb-2"></div>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Select hardware identifier for standby protocol.</p>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-900 mb-2 uppercase tracking-widest">Locomotive Designation</label>
                <select
                  value={trainId}
                  onChange={(e) => setTrainId(e.target.value)}
                  className="w-full p-4 border-2 border-slate-900 bg-slate-100 focus:outline-none focus:bg-emerald-50 text-slate-900 font-black uppercase tracking-widest rounded-none transition-none"
                >
                  <option value="trainA">TRN-A :: SHATABDI EXP</option>
                  <option value="trainB">TRN-B :: RAJDHANI EXP</option>
                  <option value="trainC">TRN-C :: VANDE BHARAT</option>
                  <option value="trainD">TRN-D :: DURONTO EXP</option>
                  <option value="trainE">TRN-E :: GARIB RATH</option>
                </select>
              </div>

              <button 
                onClick={handleJoin} 
                disabled={loading || !trainId.trim()} 
                className="w-full bg-emerald-600 text-white font-black py-5 px-4 border-2 border-slate-900 hover:bg-slate-900 transition-none disabled:opacity-50 uppercase tracking-widest text-lg"
              >
                {loading ? "INITIALIZING..." : "CONNECT TO SECTOR"}
              </button>

              <div className="mt-8 p-4 bg-slate-900 text-white border-l-4 border-emerald-600">
                <p className="text-xs uppercase tracking-widest font-bold leading-relaxed">
                  [WARNING]: Terminating this window during standby will forfeit network priority. Stand by for auto-deployment to seat selection.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0_0_#059669]">
            <div className="text-center mb-8 pb-8 border-b-4 border-slate-900">
              <div className="inline-block bg-slate-900 text-emerald-500 font-black px-4 py-2 uppercase tracking-widest mb-4 border-2 border-slate-900">
                Connection Maintained
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sector Standby Active</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="flex-1 bg-slate-100 border-2 border-slate-900 p-6 flex flex-col justify-center items-center">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Priority Position</p>
                <div className="text-6xl font-black text-slate-900 tracking-tighter">
                  {position ? `#${position}` : "--"}
                </div>
              </div>
              
              <div className="flex-1 bg-slate-100 border-2 border-slate-900 p-6 flex flex-col justify-center items-center">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Server Status</p>
                <div className={`text-2xl font-black uppercase tracking-widest mt-2 ${status === 'WAITING' ? 'text-slate-900' : 'text-emerald-600'} bg-white px-4 py-2 border-2 border-slate-900`}>
                  {status || "SYNCING"}
                </div>
              </div>
            </div>

            <div className="flex justify-center bg-slate-900 text-white p-4">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
                AWAITING NETWORK TRIGGER SIGNAL...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
