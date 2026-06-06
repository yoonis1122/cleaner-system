import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

// Replace the hardcoded key with your actual Stripe Publishable Key or use an environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret, scheduleId, location }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardNumberElement);
    
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    setLoading(false);

    if (paymentResult.error) {
      toast.error(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Your pickup is scheduled.');
        // Record payment in database (this happens via webhook or we can just go back)
        navigate(location.state?.returnUrl || '/'); // Go back to dashboard
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Information</h3>
        <p className="text-sm text-slate-500">Complete your $10 flat fee payment to confirm the pickup.</p>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
            <CardNumberElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#334155',
                  '::placeholder': { color: '#94a3b8' },
                },
              },
            }} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Expiration Date</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
              <CardExpiryElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#334155',
                    '::placeholder': { color: '#94a3b8' },
                  },
                },
              }} />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">CVC</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
              <CardCvcElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#334155',
                    '::placeholder': { color: '#94a3b8' },
                  },
                },
              }} />
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full py-4 px-4 bg-[#047857] text-white font-bold rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 gap-2"
      >
        <CreditCard className="w-5 h-5" />
        {loading ? 'Processing...' : 'Pay $10.00'}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Payments are secure and encrypted by Stripe
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, scheduleId, returnUrl } = location.state || {};

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <p className="text-slate-600 mb-4">No payment session found.</p>
        <button onClick={() => navigate(returnUrl || '/')} className="text-emerald-700 font-bold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

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
            <p className="text-slate-500">Order #{scheduleId?.substring(0, 8).toUpperCase()}</p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} scheduleId={scheduleId} location={location} />
          </Elements>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
