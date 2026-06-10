import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Rocket, ShieldCheck, BarChart3, Building2, UserCircle2, Eye, Mail, Lock, User, Home } from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields');
    }


    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });
      
      toast.success('Registration successful!');
      
      // Store token (basic auth handling)
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* Left Sidebar */}
        <div className="md:w-5/12 bg-slate-800 p-10 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 bg-[url('/hero_waste_management.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="text-emerald-400">Empowering</span> the Circular Economy.
            </h2>
            <p className="text-slate-300 mb-12">
              Manage industrial-scale waste cycles with precision. Join our ecosystem of sustainable logistics today.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-emerald-400 mb-1">Rapid Onboarding</h4>
                    <p className="text-sm text-slate-400">Get your operations running in minutes.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-emerald-400 mb-1">Certified Compliance</h4>
                    <p className="text-sm text-slate-400">Regulatory reporting built into every step.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div>
                    <h4 className="font-semibold text-emerald-400 mb-1">Real-time Analytics</h4>
                    <p className="text-sm text-slate-400">Track waste reduction and carbon offsets live.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="md:w-7/12 p-10 md:p-14 bg-white flex flex-col justify-center relative">
           <Link to="/" className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-semibold transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
             <Home className="w-4 h-4" /> Back to Home
           </Link>
           <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-500 text-sm mb-8">Start managing your environmental footprint with Cleaners.</p>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Must be at least 6 characters.</p>
                </div>



                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg shadow-sm transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>



           </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
