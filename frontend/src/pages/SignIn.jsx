import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Leaf, Mail, Lock, Eye, ArrowRight, Home } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter both email and password');
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      });
      
      toast.success('Login successful!');
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if (res.data.role === 'cleaner') {
        navigate('/cleaner');
      } else if (res.data.role === 'admin') {
        navigate('/manager');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#e2e8f0] flex flex-col items-center justify-center font-sans">
      
      <div className="w-full flex-1 flex flex-col md:flex-row bg-white">
        
        {/* Left Side - Green Hero */}
        <div className="md:w-1/2 bg-emerald-800 p-12 md:p-20 text-white relative overflow-hidden flex flex-col justify-center min-h-[500px]">
          {/* Abstract background elements */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 max-w-lg">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-10 border border-white/20">
               <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.1]">
              Revolutionizing Sustainable Logistics
            </h1>
            <p className="text-emerald-50 text-lg mb-16 leading-relaxed">
              Join Cleaners in building a cleaner future. Manage your environmental footprint with our state-of-the-art logistics management system.
            </p>

            <div className="flex items-center gap-16">
               <div>
                  <p className="text-3xl font-bold mb-1">98%</p>
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">Efficiency Rate</p>
               </div>
               <div>
                  <p className="text-3xl font-bold mb-1">1.2M</p>
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">Trees Saved</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center bg-white relative">
           <Link to="/" className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-semibold transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
             <Home className="w-4 h-4" /> Back to Home
           </Link>
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Welcome Back</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="pl-11 w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-sm font-medium text-slate-700">Password</label>
                   <button type="button" onClick={() => toast.info('Password reset instructions sent to your email.')} className="text-sm font-medium text-emerald-700 hover:text-emerald-800">Forgot password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="pl-11 w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus:ring-emerald-500" />
                <label htmlFor="remember" className="text-sm text-slate-600">
                  Remember this device
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#047857] hover:bg-[#065f46] text-white font-medium rounded-xl shadow-sm transition-colors mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>



            <p className="mt-10 text-sm text-slate-600">
              Don't have an account? <Link to="/signup" className="text-emerald-700 font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
