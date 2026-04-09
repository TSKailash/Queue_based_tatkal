import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const trains = [
    { id: "trainA", name: "Shatabdi Exp", number: "12001", from: "NDLS", to: "BPL", dep: "06:00", arr: "14:25", class: "CC, EC" },
    { id: "trainB", name: "Rajdhani Exp", number: "12951", from: "MMCT", to: "NDLS", dep: "17:00", arr: "08:32", class: "1A, 2A, 3A" },
    { id: "trainC", name: "Vande Bharat", number: "22436", from: "NDLS", to: "BSB", dep: "06:00", arr: "14:00", class: "CC, EC" },
    { id: "trainD", name: "Duronto Exp", number: "12239", from: "BCT", to: "HWH", dep: "23:15", arr: "19:40", class: "1A, 2A, 3A" },
    { id: "trainE", name: "Garib Rath", number: "12215", from: "DEE", to: "BDTS", dep: "08:55", arr: "08:10", class: "3A, CC" },
  ];

  const handleBookTrain = (trainId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Navigate strictly to Queue to wait for active portal, passing the selected train.
    // Instead of forcing the user to pick again, we pass it via state or query param.
    navigate(`/queue?train=${trainId}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900 pb-32 pt-20 sm:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black z-0"></div>
        {/* Subtle decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-200">Tatkal Window Open</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Tatkal</span> Tickets.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Skip the manual rush. Create your master list, auto-click to lock your preferred seats, and securely travel with India's fastest auto-polling Tatkal engine.
          </p>
        </div>
      </section>

      {/* Available Trains Section overlapping the Hero */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-20 lg:-mt-24 pb-32">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-10">
          <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Available Tatkal Trains</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Select your train to enter the premium priority queue</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {trains.map((train) => (
              <div key={train.id} className="group relative bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-between gap-6 cursor-default">
                
                {/* Left: Train Info */}
                <div className="flex w-full sm:w-auto items-center gap-5 flex-1">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center border border-indigo-100 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      {train.name}
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-mono font-bold tracking-wider">{train.number}</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mt-1">
                      <span className="text-slate-700 font-bold">{train.from}</span>
                      <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      <span className="text-slate-700 font-bold">{train.to}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Timing */}
                <div className="hidden md:flex flex-col justify-center items-center px-8 border-x border-slate-100 relative">
                   <div className="text-base font-bold text-slate-800">{train.dep}</div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Departure</div>
                </div>

                {/* Right: Actions */}
                <div className="w-full sm:w-auto flex flex-col justify-center gap-3">
                  <div className="flex gap-2 text-xs font-semibold text-slate-500 justify-end">
                    Class: <span className="text-slate-800">{train.class}</span>
                  </div>
                  <Button onClick={() => handleBookTrain(train.id)} variant="primary" className="shadow-md bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                    Book Tatkal
                  </Button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
