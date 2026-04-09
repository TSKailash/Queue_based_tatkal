import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import api from '../api/axios';

export default function History() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/booking/my');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><Loader text="Loading your bookings..." /></div>;
  }

  const getTrainName = (id) => {
    const map = {
      trainA: 'Shatabdi Exp',
      trainB: 'Rajdhani Exp',
      trainC: 'Vande Bharat',
      trainD: 'Duronto Exp',
      trainE: 'Garib Rath'
    };
    return map[id] || id;
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <Button onClick={() => navigate('/queue')} variant="primary">New Booking</Button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 mt-4 rounded-3xl shadow-sm border border-slate-100 max-w-lg w-full mx-auto text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Bookings Yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
            You haven't made any Tatkal bookings. Your confirmed tickets will appear here once you successfully lock and book seats.
          </p>
          <Button onClick={() => navigate('/queue')} variant="accent" size="lg" className="w-full sm:w-auto">
            Find a Train
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Confirmed</p>
                  <h3 className="text-xl font-bold text-slate-900">{getTrainName(booking.trainId)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium mb-1">Train ID</p>
                  <p className="text-sm font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{booking.trainId}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-sm text-slate-500 font-medium mb-2">Booked Seats ({booking.seats.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map(seat => (
                      <span key={seat} className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-sm font-bold font-mono shadow-sm">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span>Booking ID:</span>
                  <span className="font-mono text-slate-500">{booking._id.substring(booking._id.length - 8)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
