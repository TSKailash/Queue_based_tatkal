import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Queue() {
  const navigate = useNavigate();

  const [trainId, setTrainId] = useState("trainA");
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
    }, 3000);

    return () => clearInterval(interval);
  }, [joined, trainId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Join Tatkal Queue
        </h2>

        {!joined ? (
          <>
            <label className="block mb-2 text-sm text-gray-600">
              Train ID
            </label>
            <input
              value={trainId}
              onChange={(e) => setTrainId(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Joining..." : "Join Queue"}
            </button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Status: <span className="font-semibold">{status}</span>
            </p>
            <p className="text-lg">
              Position: <span className="font-semibold">{position}</span>
            </p>
            <p className="text-sm text-gray-500">
              Checking status every 3 seconds...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
