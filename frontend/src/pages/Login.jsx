import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed。Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 justify-center items-center p-4">
      
      <div className="w-full max-w-5xl bg-white border-4 border-slate-900 flex flex-col md:flex-row shadow-[8px_8px_0_0_#059669]">
        
        {/* Left Branding Panel */}
        <div className="w-full md:w-1/2 bg-slate-900 text-white p-12 border-r-4 border-slate-900 flex flex-col justify-between">
          <div>
            <div className="mb-8 inline-block bg-emerald-600 px-3 py-1 font-black uppercase tracking-widest text-sm border-2 border-slate-900">
              Operations
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              TatkalSync<br/> Authorization<br/> Required.
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Access the high-priority booking infrastructure. 
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-slate-700">
             <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Systems Note</div>
             <div className="font-mono text-sm text-emerald-500">
               Connection secured.<br/> Latency minimal.
             </div>
          </div>
        </div>

        {/* Right Login Panel */}
        <div className="w-full md:w-1/2 p-12 bg-white">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Sign In</h2>
            <div className="w-12 h-1 bg-emerald-600 mt-4"></div>
          </div>

          {error && (
            <div className="mb-8 bg-slate-900 text-white p-4 font-bold border-l-4 border-red-500 uppercase tracking-widest text-sm">
              Failed: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Security Key (Password)</label>
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
                className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 border-2 border-slate-900 hover:bg-slate-900 transition-none"
              >
                {loading ? "Authenticating..." : "Authorize Access"}
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t-2 border-slate-200">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Unregistered Operator?{" "}
              <Link to="/register" className="text-slate-900 hover:bg-emerald-600 hover:text-white px-2 py-1 transition-none underline md:no-underline">
                Register Instance
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
