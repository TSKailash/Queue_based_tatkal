import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SeatPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Fetch Seat Status
  // -------------------------
  const fetchSeats = async () => {
    try {
      const res = await api.get(`/seats/status/${trainId}`);
      setSeats(res.data.seats);
    } catch (err) {
      console.error("Failed to fetch seats");
    }
  };

  // -------------------------
  // Fetch ACTIVE status
  // -------------------------
  const fetchActiveStatus = async () => {
    try {
      const res = await api.get(`/queue/status/${trainId}`);
      if (res.data.status !== "ACTIVE") {
        alert("ACTIVE window expired");
        navigate("/queue");
      } else {
        setRemainingTime(res.data.remainingTime);
      }
    } catch (err) {
      console.error("Failed to fetch active status");
    }
  };

  // -------------------------
  // Auto Refresh
  // -------------------------
  useEffect(() => {
    fetchSeats();
    fetchActiveStatus();

    const interval = setInterval(() => {
      fetchSeats();
      fetchActiveStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // Countdown
  // -------------------------
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // -------------------------
  // Seat Selection Logic
  // -------------------------
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

  // -------------------------
  // Lock Seats
  // -------------------------
  const lockSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Select seats first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/seats/lock/${trainId}`, {
        seats: selectedSeats,
      });

      alert("Seats locked successfully");
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.message || "Lock failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Confirm Booking
  // -------------------------
  const confirmBooking = async () => {
    try {
      setLoading(true);
      await api.post(`/booking/confirm/${trainId}`, {
        seats: selectedSeats,
      });

      alert("Booking successful");
      navigate("/bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Seat Color Logic
  // -------------------------
  const getSeatColor = (seatId) => {
    const seat = seats[seatId];
    if (!seat) return "bg-gray-200";

    if (seat.status === "BOOKED") return "bg-red-500 cursor-not-allowed";
    if (seat.status === "LOCKED_BY_ME") return "bg-blue-500";
    if (seat.status === "LOCKED_BY_OTHER") return "bg-yellow-400";

    if (selectedSeats.includes(seatId)) return "bg-blue-500";
    if (seat.status === "AVAILABLE") return "bg-green-500 hover:bg-green-600";

    return "bg-gray-200";
  };

  // Generate 20 seats
  const seatIds = Array.from({ length: 20 }, (_, i) => `S${i + 1}`);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Train: {trainId}</h2>

        <p className="mb-4 text-lg">
          ⏳ Time Remaining:{" "}
          <span className="font-bold text-red-600">
            {remainingTime}s
          </span>
        </p>

        {/* Seat Grid */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {seatIds.map((seatId) => (
            <div
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`p-4 text-center text-white rounded cursor-pointer transition ${getSeatColor(
                seatId
              )}`}
            >
              {seatId}
            </div>
          ))}
        </div>

        {/* Selected */}
        <div className="mb-4">
          <p className="font-semibold">
            Selected Seats: {selectedSeats.join(", ") || "None"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={lockSeats}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Lock Seats
          </button>

          <button
            onClick={confirmBooking}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Booking
          </button>

          <button
            onClick={logout}
            className="ml-auto bg-gray-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
