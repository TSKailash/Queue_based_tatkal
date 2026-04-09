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
      <div className="flex-1 flex justify-center items-center bg-slate-100">
        <div className="bg-slate-900 text-white font-black uppercase tracking-widest px-6 py-3 border-2 border-slate-900">Retrieving Archive...</div>
      </div>
    );
  }

  const getTrainName = (id) => {
    const map = {
      trainA: 'SHATABDI EXP',
      trainB: 'RAJDHANI EXP',
      trainC: 'VANDE BHARAT',
      trainD: 'DURONTO EXP',
      trainE: 'GARIB RATH'
    };
    return map[id] || id;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      
      <div className="bg-slate-900 border-b-8 border-slate-800 text-white p-8 sm:p-12 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-4">Operation Ledger</h1>
              <div className="w-16 h-2 bg-emerald-600 mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Historical validation of past network reservations.</p>
           </div>
           <button 
             onClick={() => navigate('/')} 
             className="bg-emerald-600 text-white font-black uppercase tracking-widest py-3 px-6 border-2 border-emerald-600 hover:bg-slate-900 transition-none shadow-[4px_4px_0_0_#94a3b8] sm:shadow-[4px_4px_0_0_#0f172a]"
           >
             Initialize New Request
           </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pb-24">
        {bookings.length === 0 ? (
          <div className="bg-white p-12 border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a]">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">ARCHIVE EMPTY</h2>
            <p className="text-slate-600 font-bold text-sm uppercase tracking-widest mb-8">No historical ticket data registered by this operational instance.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-slate-900 text-white font-black uppercase tracking-widest py-3 px-8 border-2 border-slate-900 hover:bg-emerald-600 transition-none"
            >
              QUERY SECTORS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {bookings.map((booking) => (
              booking.passengers && booking.passengers.length > 0 ? (
                booking.passengers.map((passenger, idx) => (
                  <div key={`${booking._id}-${idx}`} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#059669] flex flex-col sm:flex-row relative">
                    
                    {/* Security Band */}
                    <div className="hidden lg:block w-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0djQwaC00em0xMCAwaDR2NDBoLTR6TTIwIDB2NDBoNHYtNDB6bTEwIDB2NDBoNHYtNDB6IiBmaWxsPSIjY2JkNWUxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] border-r-4 border-slate-900"></div>

                    {/* Meta Data Block */}
                    <div className="bg-slate-900 sm:w-64 p-6 sm:p-8 border-b-4 sm:border-b-0 sm:border-r-4 border-slate-900 flex flex-col justify-between text-white relative overflow-hidden">
                      <div className="z-10 relative">
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 shadow-black">IDENTIFIER / PNR</div>
                        <div className="text-2xl font-mono font-black tracking-tight">{booking._id.substring(booking._id.length - 10).toUpperCase()}</div>
                      </div>
                      
                      <div className="mt-8 z-10 relative">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AUTH STATUS</div>
                        <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-sm font-black uppercase tracking-widest border-2 border-white">
                          APPROVED
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t-2 border-slate-700 z-10 relative">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TXN HASH</div>
                         <div className="text-xs font-mono text-slate-300 truncate">{booking._id}</div>
                      </div>
                      
                      {/* Big watermark inside dark block */}
                      <div className="absolute right-[-40px] bottom-[-40px] text-slate-800 opacity-50 font-black text-9xl pointer-events-none select-none overflow-hidden">TK</div>
                    </div>

                    {/* Primary Output Block */}
                    <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
                       <div className="flex flex-col md:flex-row md:justify-between items-start mb-8 gap-6 border-b-4 border-slate-900 pb-8">
                          <div>
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SECTOR / LOCOMOTIVE</div>
                             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{getTrainName(booking.trainId)}</h2>
                             <span className="inline-block mt-3 text-xs font-black text-white bg-slate-900 px-2 py-1 uppercase tracking-widest border border-slate-900">{booking.trainId}</span>
                          </div>
                          
                          <div className="md:text-right">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">TIMESTAMP</div>
                             <div className="text-xl font-black text-slate-900 tracking-tight">{new Date(booking.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="md:col-span-2">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">IDENTITY MARKER</div>
                             <div className="text-2xl font-black text-slate-900 uppercase leading-none">{passenger.name}</div>
                             <div className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">{passenger.age} EARTH YEARS</div>
                          </div>

                          <div>
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">TARGET CLS</div>
                             <div className="text-3xl font-black text-slate-900 leading-none">CC</div>
                          </div>

                          <div className="bg-slate-100 border-2 border-slate-900 p-3 text-center">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE</div>
                             <div className="text-3xl font-mono font-black text-emerald-600 tracking-tighter">{passenger.seat}</div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div key={booking._id} className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#cbd5e1] p-8 flex flex-col">
                    <div className="border-b-4 border-slate-900 pb-6 mb-6">
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">LEGACY CORRUPTED RECORD</div>
                       <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{getTrainName(booking.trainId)} <span className="text-sm font-mono bg-slate-200 text-slate-900 px-2 py-1 ml-2">{booking.trainId}</span></h2>
                    </div>
                    <div>
                       <div className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-widest">Metadata retained. Identity signatures lost.</div>
                       <div className="flex gap-4 flex-wrap">
                          {booking.seats.map(seat => (
                             <span key={seat} className="bg-slate-900 text-white px-4 py-2 text-lg font-black font-mono border-2 border-slate-900">
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
