import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const SummaryCard = ({ title, amount, subtext }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className={`font-bold text-slate-800 tracking-tight ${amount.includes('Rp') ? 'text-2xl' : 'text-3xl'}`}>
      {amount}
    </p>
    {subtext && <div className="h-4 w-3/4 bg-slate-50 rounded-full" />}
  </div>
);

const WishlistCard = ({ type, title, date, priority, color }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="aspect-[4/3] bg-slate-100 rounded-2xl mb-5 overflow-hidden" />
    <div className="space-y-1 mb-4">
      <h4 className="font-bold text-slate-800 text-sm leading-snug">
        <span className="text-slate-500">{type}:</span> {title}
      </h4>
      <p className="text-[10px] text-slate-400 font-medium">Due on : {date}</p>
    </div>
    <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest ${color}`}>
      {priority}
    </span>
  </div>
);

const pieData = [
  { name: 'Needs', value: 75, color: '#1e40af' },
  { name: 'Wants', value: 25, color: '#c2410c' },
];

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Wishlist</h1>
        </header>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Wishlist" amount="Rp 184.320,00" subtext />
          <SummaryCard title="On Going" amount="25" />
          <SummaryCard title="Finished" amount="7" />
          <SummaryCard title="Total" amount="32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist Items Grid */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Wishlist Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <WishlistCard 
                type="Needs"
                title="Buy New Laptop Lenovo Legion"
                date="12 Apr 2026"
                priority="HIGH"
                color="bg-[#fee2e2] text-[#991b1b]"
              />
              <WishlistCard 
                type="Wants"
                title="Buy New Laptop Lenovo Legion"
                date="12 Apr 2026"
                priority="LOW"
                color="bg-[#dcfce7] text-[#166534]"
              />
              <WishlistCard 
                type="Wants"
                title="Buy New Laptop Lenovo Legion"
                date="12 Apr 2026"
                priority="MEDIUM"
                color="bg-[#fef9c3] text-[#854d0e]"
              />
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-fit sticky top-12">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Wishlist Category</h3>
            <div className="h-64 w-full flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-6">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
