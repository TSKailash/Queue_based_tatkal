import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";
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
      alert(err.response?.data?.message || "Failed to join queue");
    } finally {
      setLoading(false);
    }
  };

  // Leave Queue
  const handleLeave = async () => {
    try {
      setLoading(true);
      await axios.post(`/queue/optout/${trainId}`);
      setJoined(false);
      setPosition(null);
      setStatus(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave queue");
    } finally {
      setLoading(false);
    }
  };

  const statusRef = useRef(status);
  const joinedRef = useRef(joined);
  
  useEffect(() => {
    statusRef.current = status;
    joinedRef.current = joined;
  }, [status, joined]);

  // Handle tab close or component unmount
  useEffect(() => {
    const leaveQueue = () => {
      if (joinedRef.current && statusRef.current !== "ACTIVE") {
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
      }
    };

    window.addEventListener("beforeunload", leaveQueue);
    return () => {
      window.removeEventListener("beforeunload", leaveQueue);
      leaveQueue(); // Fire on component unmount if they navigate away
    };
  }, [trainId]);

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
    <div className="w-full flex-1 flex flex-col bg-slate-50 justify-center items-center px-4 py-12">
      <div className="max-w-xl w-full">
        {!joined ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Queue Registration</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Select your train designation to enter the priority waiting lobby.</p>
            </div>
            
            <div className="p-8 bg-slate-50/50">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Train Designation</label>
                <select
                  value={trainId}
                  onChange={(e) => setTrainId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 text-sm font-medium shadow-sm bg-white"
                >
                  <option value="trainA">Shatabdi Exp (trainA)</option>
                  <option value="trainB">Rajdhani Exp (trainB)</option>
                  <option value="trainC">Vande Bharat (trainC)</option>
                  <option value="trainD">Duronto Exp (trainD)</option>
                  <option value="trainE">Garib Rath (trainE)</option>
                </select>
              </div>

              <button 
                onClick={handleJoin} 
                disabled={loading || !trainId.trim()} 
                className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-emerald-700 transition duration-150 shadow-sm disabled:opacity-70 text-base"
              >
                {loading ? "Registering..." : "Enter Waitlist"}
              </button>

              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-md">
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                  <strong>Notice:</strong> Once registered, do not close this window. You will be automatically transitioned to the booking portal when the status is ACTIVE.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Priority Queue Status</h2>
            <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">Polling server for Tatkal window activation</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-5 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Queue Position</p>
                <div className="text-4xl font-bold text-slate-900 tracking-tight">
                  {position ? `#${position}` : "--"}
                </div>
              </div>
              
              <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-5 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Server Status</p>
                <div className={`text-xl font-bold uppercase tracking-wider mt-3 ${status === 'WAITING' ? 'text-orange-500' : 'text-emerald-600'}`}>
                  {status || "SYNCING"}
                </div>
              </div>
            </div>

            <div className="flex justify-center text-slate-500 mb-6">
              <div className="flex items-center gap-3 text-sm font-medium">
                <svg className="w-5 h-5 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Waiting for network active signal...
              </div>
            </div>

            <button
              onClick={handleLeave}
              disabled={loading}
              className="w-full bg-red-50 text-red-600 border border-red-200 font-semibold py-3 px-4 rounded-md hover:bg-red-100 transition duration-150 shadow-sm disabled:opacity-70 text-base"
            >
              {loading ? "Leaving..." : "Leave the Queue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
