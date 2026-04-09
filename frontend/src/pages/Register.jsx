import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("/auth/register", form);
      setRegisteredEmail(form.email);
      setSuccess("Account instantiated. Verification required.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Verify input block.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("/auth/verify-email", { email: registeredEmail, code: otp });
      setSuccess("Verification acquired. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification code INVALID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 justify-center items-center p-4 py-12">
      
      <div className="w-full max-w-5xl bg-white border-4 border-slate-900 flex flex-col md:flex-row shadow-[8px_8px_0_0_#059669]">
        
        {/* Left Branding Panel */}
        <div className="w-full md:w-1/2 bg-slate-900 text-white p-12 border-r-4 border-slate-900 flex flex-col justify-between">
          <div>
            <div className="mb-8 inline-block bg-emerald-600 px-3 py-1 font-black uppercase tracking-widest text-sm border-2 border-slate-900">
              Registration
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Create <br/> Operator <br/> Instance
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Initialize a dedicated connection profile to access priority queue systems safely and reliably. 
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-slate-700">
             <div className="w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0djQwaC00em0xMCAwaDR2NDBoLTR6TTIwIDB2NDBoNHYtNDB6bTEwIDB2NDBoNHYtNDB6IiBmaWxsPSIjMzMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-30"></div>
          </div>
        </div>

        {/* Right Register Panel */}
        <div className="w-full md:w-1/2 p-12 bg-white">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">
               {step === 1 ? "Initialize Profile" : "Authenticate"}
            </h2>
            <div className="w-12 h-1 bg-emerald-600 mt-4"></div>
          </div>

          {error && (
            <div className="mb-8 bg-slate-900 text-white p-4 font-bold border-l-4 border-red-500 uppercase tracking-widest text-sm">
              Alert: {error}
            </div>
          )}
          
          {success && (
            <div className="mb-8 bg-slate-50 text-slate-900 p-4 font-bold border-l-4 border-emerald-600 uppercase tracking-widest text-sm">
              Status: {success}
            </div>
          )}

          {step === 1 ? (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Legal Identity</label>
                 <input
                   type="text"
                   name="name"
                   required
                   value={form.name}
                   onChange={handleChange}
                   placeholder="JOHN DOE"
                   className="w-full px-4 py-4 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 transition-none rounded-none text-slate-900 font-bold uppercase"
                 />
               </div>
               <div>
                 <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Operator ID (Email)</label>
                 <input
                   type="email"
                   name="email"
                   required
                   value={form.email}
                   onChange={handleChange}
                   placeholder="operator@system.com"
                   className="w-full px-4 py-4 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 transition-none rounded-none text-slate-900 font-bold"
                 />
               </div>
               <div>
                 <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Security Key</label>
                 <input
                   type="password"
                   name="password"
                   required
                   value={form.password}
                   onChange={handleChange}
                   placeholder="••••••••"
                   className="w-full px-4 py-4 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 transition-none rounded-none text-slate-900 font-bold tracking-widest"
                 />
               </div>
               
               <div className="pt-6">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 border-2 border-slate-900 hover:bg-emerald-600 transition-none disabled:opacity-50"
                 >
                   {loading ? "Processing..." : "Generate Instance"}
                 </button>
               </div>
             </form>
          ) : (
             <form onSubmit={handleVerify} className="space-y-6">
               <div>
                 <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Access Token</label>
                 <input
                   type="text"
                   name="otp"
                   required
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   placeholder="------"
                   maxLength={6}
                   className="w-full px-4 py-6 bg-slate-100 border-2 border-slate-900 focus:outline-none focus:bg-emerald-50 transition-none rounded-none text-center text-4xl tracking-[0.5em] font-mono font-black"
                 />
               </div>
               
               <div className="pt-6">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 border-2 border-slate-900 hover:bg-slate-900 transition-none disabled:opacity-50"
                 >
                   {loading ? "Verifying..." : "Validate Token"}
                 </button>
               </div>
             </form>
          )}

          {step === 1 && (
            <div className="mt-12 pt-8 border-t-2 border-slate-200">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Existing Identity?{" "}
                <Link to="/login" className="text-slate-900 hover:bg-slate-900 hover:text-white px-2 py-1 transition-none underline md:no-underline">
                  Return to Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
