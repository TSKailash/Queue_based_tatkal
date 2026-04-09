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
    return <div className="flex-1 flex justify-center items-center"><Loader text="Loading your boarding passes..." /></div>;
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
    <div className="flex-1 flex flex-col p-4 sm:p-8 w-full max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Boarding Passes</h1>
        <Button onClick={() => navigate('/queue')} variant="primary" className="shadow-lg shadow-indigo-200">Book New</Button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 mt-4 rounded-3xl shadow-sm border border-slate-100 max-w-lg w-full mx-auto text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-500 hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Boarding Passes</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Your travel history is empty. Your flight-styled train tickets will securely appear here once booked.
          </p>
          <Button onClick={() => navigate('/queue')} variant="accent" size="lg" className="w-full sm:w-auto">
            Find a Train
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full block">
          {bookings.map((booking) => (
            booking.passengers && booking.passengers.length > 0 ? (
              booking.passengers.map((passenger, idx) => (
                <div key={`${booking._id}-${idx}`} className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden relative transition-transform hover:-translate-y-1 duration-300 w-full group">
                  
                  {/* Left Stub - Barcode */}
                  <div className="bg-indigo-600 sm:w-48 p-6 flex flex-col justify-between relative overflow-hidden group-hover:bg-indigo-700 transition-colors">
                    {/* Decorative Perforation Line */}
                    <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-[2px] border-r-2 border-dashed border-white/40"></div>
                    
                    <div className="z-10">
                      <p className="text-indigo-200 text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmed
                      </p>
                      <h3 className="text-white text-2xl font-bold font-mono tracking-tight leading-none mb-4">{booking.trainId}</h3>
                      <div className="bg-white/20 px-2 py-1 inline-block rounded text-white text-xs font-mono font-medium backdrop-blur-sm">
                        {booking._id.substring(booking._id.length - 6).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Mock Barcode */}
                    <div className="mt-8 opacity-80 z-10 flex flex-col gap-1 w-full mix-blend-overlay">
                       <svg className="w-full h-12" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <rect x="0" y="0" width="4" height="100" fill="white"/>
                          <rect x="6" y="0" width="2" height="100" fill="white"/>
                          <rect x="10" y="0" width="8" height="100" fill="white"/>
                          <rect x="22" y="0" width="2" height="100" fill="white"/>
                          <rect x="26" y="0" width="6" height="100" fill="white"/>
                          <rect x="36" y="0" width="6" height="100" fill="white"/>
                          <rect x="46" y="0" width="2" height="100" fill="white"/>
                          <rect x="52" y="0" width="10" height="100" fill="white"/>
                          <rect x="66" y="0" width="4" height="100" fill="white"/>
                          <rect x="74" y="0" width="2" height="100" fill="white"/>
                          <rect x="80" y="0" width="8" height="100" fill="white"/>
                          <rect x="92" y="0" width="8" height="100" fill="white"/>
                       </svg>
                       <div className="text-[10px] text-white/70 font-mono tracking-widest text-center">{booking._id}</div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  </div>

                  {/* Right Main Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 relative">
                     {/* Watermark logo */}
                     <svg className="absolute w-40 h-40 text-slate-100 -right-10 -bottom-10 opacity-50 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                     </svg>
                     
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                           <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Passenger Name</p>
                           <h2 className="text-2xl font-black text-slate-800 tracking-tight">{passenger.name}</h2>
                           <p className="text-slate-500 font-medium">{passenger.age} Years Old</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Seat</p>
                           <div className="text-3xl font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 shadow-inner">
                              {passenger.seat}
                           </div>
                        </div>
                     </div>

                     <div className="border-t border-slate-200/60 pt-4 flex justify-between items-end relative z-10">
                        <div>
                           <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Train</p>
                           <p className="text-lg font-bold text-slate-700">{getTrainName(booking.trainId)}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Date</p>
                           <p className="text-sm font-semibold text-slate-700">{new Date(booking.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                     </div>
                  </div>
                  
                  {/* Outer cutouts styling */}
                  <div className="hidden sm:block absolute top-0 -mt-3 right-[calc(100%-12rem-12px)] w-6 h-6 bg-slate-50 border-b border-slate-200 rounded-full"></div>
                  <div className="hidden sm:block absolute bottom-0 -mb-3 right-[calc(100%-12rem-12px)] w-6 h-6 bg-slate-50 border-t border-slate-200 rounded-full"></div>
                </div>
              ))
            ) : (
              <div key={booking._id} className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden relative transition-transform hover:-translate-y-1 duration-300 w-full group">
                  <div className="bg-slate-400 sm:w-48 p-6 flex flex-col justify-between relative overflow-hidden group-hover:bg-slate-500 transition-colors">
                    <div className="z-10">
                      <p className="text-white text-xs font-bold tracking-widest uppercase mb-1">Legacy Booking</p>
                      <h3 className="text-white text-2xl font-bold font-mono tracking-tight leading-none mb-4">{booking.trainId}</h3>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex justify-between items-center bg-gradient-to-br from-white to-slate-50 relative">
                     <div>
                        <p className="text-slate-500 font-medium">Legacy Booking (No Passenger Details)</p>
                        <div className="flex gap-2 mt-4 flex-wrap">
                           {booking.seats.map(seat => (
                              <span key={seat} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm font-bold font-mono border border-slate-200">
                                 {seat}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
