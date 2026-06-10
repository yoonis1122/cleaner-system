import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowLeft, Smartphone } from 'lucide-react';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scheduleId, returnUrl } = location.state || {};
  
  const [accountNo, setAccountNo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!scheduleId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <p className="text-slate-600 mb-4">No payment session found.</p>
        <button onClick={() => navigate(returnUrl || '/')} className="text-emerald-700 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNo) {
      return toast.error("Please enter your mobile wallet number.");
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const res = await axios.post('/api/users/pay-waafi', {
        scheduleId,
        accountNo
      }, config);
      
      if (res.data.success) {
        toast.success('Payment successful! Your pickup is scheduled.');
        navigate(returnUrl || '/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please check your number and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8">
        <button onClick={() => navigate(returnUrl || '/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
            <p className="text-slate-500">Order #{scheduleId.substring(0, 8).toUpperCase()}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Mobile Money Payment</h3>
              <p className="text-sm text-slate-500">Complete your $10 flat fee payment via EVC Plus, Sahal, or Zaad to confirm the pickup.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Wallet Number</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                 </div>
                 <input 
                   type="text" 
                   value={accountNo}
                   onChange={(e) => setAccountNo(e.target.value)}
                   placeholder="25261XXXXXXX" 
                   className="pl-12 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-lg tracking-wide text-slate-800"
                 />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Please include the country code (e.g., 252...)</p>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 px-4 bg-[#047857] text-white font-bold rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 gap-2"
            >
              <Smartphone className="w-5 h-5" />
              {loading ? 'Processing Payment...' : 'Pay $10.00 Now'}
            </button>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-600" />
                 Payments are secure and processed by WaafiPay
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
