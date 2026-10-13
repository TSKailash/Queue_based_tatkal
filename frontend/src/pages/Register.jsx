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
      setSuccess("Account created successfully. Please check your email for verification.");
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
      setSuccess("Verification successful. Redirecting to login portal...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification code INVALID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50">
      
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 max-w-lg w-full">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-md shadow-sm flex items-center justify-center">
                 <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                 </svg>
             </div>
             <span className="text-3xl font-bold tracking-tight">TatkalSync</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Onboard to Priority Queue.</h1>
          <p className="text-lg text-slate-300 font-normal leading-relaxed">Streamline your travel bookings with our highly optimized and reliable infrastructure designed strictly for performance.</p>
        </div>
      </div>

      {/* Right Register Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
               {step === 1 ? "Create an account" : "Two-Step Verification"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
               {step === 1 ? "Please complete your details down below to register." : "Input the verification code dispatched to your email."}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200 font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-800 p-4 rounded-md text-sm border border-emerald-200 font-medium">
              {success}
            </div>
          )}

          {step === 1 ? (
             <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                 <input
                   type="text"
                   name="name"
                   required
                   value={form.name}
                   onChange={handleChange}
                   placeholder="John Doe"
                   className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                 <input
                   type="email"
                   name="email"
                   required
                   value={form.email}
                   onChange={handleChange}
                   placeholder="you@corporate.com"
                   className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                 <input
                   type="password"
                   name="password"
                   required
                   value={form.password}
                   onChange={handleChange}
                   placeholder="••••••••"
                   className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
                 />
               </div>
               
               <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-slate-900 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                 >
                   {loading ? "Registering..." : "Create Account"}
                 </button>
               </div>
             </form>
          ) : (
             <form onSubmit={handleVerify} className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Auth Code</label>
                 <input
                   type="text"
                   name="otp"
                   required
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   placeholder="------"
                   maxLength={6}
                   className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-center text-3xl tracking-[0.25em] font-mono font-bold text-slate-800"
                 />
               </div>
               
               <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-emerald-700 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                 >
                   {loading ? "Verifying..." : "Validate Token"}
                 </button>
               </div>
             </form>
          )}

          {step === 1 && (
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-slate-800 hover:text-emerald-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
