import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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
      setSuccess("Account created! Please check your email for the verification code.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900">
      {/* Left side brand area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-600 opacity-90 mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500 blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-orange-500 blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 w-full max-w-2xl mx-auto h-full text-white">
          <div className="flex items-center gap-2 mb-8 cursor-pointer">
            <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-bold text-3xl tracking-tight">Tatkal<span className="text-orange-400">Sync</span></span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Join the winning queue.
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl leading-relaxed">
            Create an account to access our optimized Tatkal booking engine. Beat the rush with our streamlined interface and instant validations.
          </p>
        </div>
      </div>

      {/* Right side form area */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile brand header */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Tatkal<span className="text-indigo-600">Sync</span></span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {step === 1 ? "Create an account" : "Verify your email"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {step === 1 ? "Enter your details to register." : "Enter the 6-digit code sent to your email."}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
              <Input
                label="Full name"
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              <Input
                label="Email address"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              
              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={loading} variant="primary" size="lg">
                  Create Account
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5 flex flex-col">
              <Input
                label="Verification Code"
                type="text"
                name="otp"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="text-center tracking-widest text-xl font-bold"
              />
              
              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={loading} variant="primary" size="lg">
                  Verify Code
                </Button>
              </div>
              <p className="mt-4 text-center text-sm text-slate-600">
                Didn't receive the code? Wait a moment or check your spam folder.
              </p>
            </form>
          )}

          {step === 1 && (
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
