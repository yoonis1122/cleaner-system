import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Search, FileText } from 'lucide-react';

const EarningsPanel = ({ schedules }) => {
  const FEE_PER_PICKUP = 10;

  // Calculate metrics
  const totalRevenue = schedules.filter(s => ['accepted', 'assigned', 'completed'].includes(s.status)).length * FEE_PER_PICKUP;
  const completedPayouts = schedules.filter(s => s.status === 'completed').length * FEE_PER_PICKUP;
  const pendingRevenue = schedules.filter(s => ['pending', 'accepted', 'assigned'].includes(s.status || 'pending')).length * FEE_PER_PICKUP;

  // Mock chart data (we use a simple array to generate CSS bars)
  const chartData = [40, 70, 45, 90, 65, 85, 110, 80, 100, 130, 95, 120];

  return (
    <div className="p-8 h-full flex flex-col font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Earnings & Financials</h2>
          <p className="text-slate-500 mt-1">Track your revenue, payouts, and financial performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
          <FileText className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="bg-gradient-to-br from-[#047857] to-emerald-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <DollarSign className="w-6 h-6 text-emerald-100" />
              </div>
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md text-xs font-bold text-emerald-50 border border-white/10">
                +12.5% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-emerald-100/80 text-sm font-medium mb-1">Total Revenue</p>
            <h3 className="text-4xl font-extrabold tracking-tight">${totalRevenue.toLocaleString()}.00</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Available to Payout</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">${completedPayouts.toLocaleString()}.00</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Pending Revenue</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">${pendingRevenue.toLocaleString()}.00</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8 flex-1 min-h-0">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Monthly breakdown of gross income</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end gap-3 px-2 h-48 mt-auto pb-6 relative border-b border-slate-100">
            {/* Y-axis markers */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between w-full pointer-events-none">
               <div className="w-full border-t border-slate-100 border-dashed"></div>
               <div className="w-full border-t border-slate-100 border-dashed"></div>
               <div className="w-full border-t border-slate-100 border-dashed"></div>
            </div>
            
            {chartData.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative z-10 h-full">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity pointer-events-none whitespace-nowrap">
                  ${val * 10}
                </div>
                <div 
                  className="w-full bg-emerald-100 rounded-t-sm group-hover:bg-[#047857] transition-colors relative"
                  style={{ height: `${(val / 130) * 100}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#047857]/10 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 pt-4 text-xs font-bold text-slate-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Transactions summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
             <div className="divide-y divide-slate-100">
                {schedules.slice(0, 8).map((schedule, i) => (
                  <div key={schedule._id || i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${schedule.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                         <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{schedule.name}</p>
                        <p className="text-xs text-slate-500">{new Date(schedule.createdAt || schedule.timeSlot).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">+${FEE_PER_PICKUP}.00</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${schedule.status === 'completed' ? 'text-[#047857]' : schedule.status === 'cancelled' ? 'text-red-500' : 'text-amber-500'}`}>
                        {schedule.status || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
                {schedules.length === 0 && (
                   <div className="p-8 text-center text-slate-500 text-sm">
                     No transactions found.
                   </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EarningsPanel;
