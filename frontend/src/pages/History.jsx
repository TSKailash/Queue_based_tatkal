import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    return (
      <div className="flex-1 flex justify-center items-center bg-slate-50">
        <div className="text-slate-500 font-medium">Fetching booking history...</div>
      </div>
    );
  }

  const getTrainName = (id) => {
    const map = {
      trainA: 'Shatabdi Express',
      trainB: 'Rajdhani Express',
      trainC: 'Vande Bharat',
      trainD: 'Duronto Express',
      trainE: 'Garib Rath'
    };
    return map[id] || id;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4 sm:px-6 lg:px-8 py-8">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">My Bookings</h1>
              <p className="text-slate-500 font-medium text-sm">View and manage your confirmed train tickets.</p>
           </div>
           <button 
             onClick={() => navigate('/')} 
             className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors shadow-sm text-sm"
           >
             Book Another Ticket
           </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {bookings.length === 0 ? (
          <div className="bg-white p-12 border border-slate-200 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Bookings Found</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">You haven't made any train reservations yet. Your confirmed tickets will appear here.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-slate-800 text-white font-semibold py-2 px-6 rounded-md hover:bg-slate-900 transition-colors text-sm shadow-sm"
            >
              Search Trains
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              booking.passengers && booking.passengers.length > 0 ? (
                booking.passengers.map((passenger, idx) => (
                  <div key={`${booking._id}-${idx}`} className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col sm:flex-row overflow-hidden">
                    
                    {/* Meta Data Block (Left column on desktop) */}
                    <div className="bg-slate-50 sm:w-56 p-6 border-b sm:border-b-0 sm:border-r border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">PNR Number</div>
                        <div className="text-lg font-mono font-bold text-slate-800 tracking-tight">{booking._id.substring(booking._id.length - 10).toUpperCase()}</div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</div>
                        <div className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200 rounded">
                          Confirmed
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Ref</div>
                         <div className="text-xs font-mono text-slate-500 truncate">{booking._id}</div>
                      </div>
                    </div>

                    {/* Primary Output Block */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                       <div className="flex flex-col md:flex-row md:justify-between items-start mb-6 gap-4">
                          <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Train Details</div>
                             <h2 className="text-xl font-bold text-slate-900 leading-tight">{getTrainName(booking.trainId)}</h2>
                             <span className="inline-block mt-2 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{booking.trainId}</span>
                          </div>
                          
                          <div className="md:text-right">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date of Booking</div>
                             <div className="text-sm font-semibold text-slate-800">{new Date(booking.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                          <div className="col-span-2">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passenger Name</div>
                             <div className="text-base font-bold text-slate-900">{passenger.name}</div>
                             <div className="text-xs text-slate-500 mt-1">{passenger.age} Years</div>
                          </div>

                          <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class</div>
                             <div className="text-base font-bold text-slate-900">CC</div>
                          </div>

                          <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seat Pos.</div>
                             <div className="text-xl font-mono font-bold text-emerald-600">{passenger.seat}</div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div key={booking._id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col">
                    <div className="border-b border-slate-100 pb-4 mb-4">
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Legacy Record</div>
                       <h2 className="text-lg font-bold text-slate-900">{getTrainName(booking.trainId)} <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded ml-2 border border-slate-200">{booking.trainId}</span></h2>
                    </div>
                    <div>
                       <div className="text-sm font-medium text-slate-500 mb-3">Legacy database entry (No passenger details mapped)</div>
                       <div className="flex gap-2 flex-wrap">
                          {booking.seats.map(seat => (
                             <span key={seat} className="bg-slate-50 text-slate-800 px-3 py-1.5 text-sm font-bold font-mono border border-slate-200 rounded-md">
                                {seat}
                             </span>
                          ))}
                       </div>
                    </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
