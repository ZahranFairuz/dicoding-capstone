import React from 'react';
import Sidebar from '../components/Sidebar';
import { Plus } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const SummaryCard = ({ title, amount }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{amount}</p>
    <div className="h-4 w-3/4 bg-slate-50 rounded-full" />
  </div>
);

const historyData = [
  { item: 'Buy food & drink', category: 'TRANSPORT', color: 'bg-[#dbeafe] text-[#2563eb]', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'LIFESTYLE', color: 'bg-[#ecfccb] text-[#65a30d]', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'F&B', color: 'bg-[#ffedd5] text-[#ea580c]', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'F&B', color: 'bg-[#ffedd5] text-[#ea580c]', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'LIFESTYLE', color: 'bg-[#ecfccb] text-[#65a30d]', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'TRANSPORT', color: 'bg-[#dbeafe] text-[#2563eb]', date: '4 Apr 2026' },
];

const chartData = [
  { name: 'Mon', value: 110 },
  { name: 'Tue', value: 60 },
  { name: 'Wed', value: 90 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 85 },
  { name: 'Sat', value: 65 },
  { name: 'Sun', value: 65 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Today Income" amount="Rp 184.320,00" />
          <SummaryCard title="Today Expense" amount="Rp 184.320,00" />
          <SummaryCard title="Weekly Income" amount="Rp 184.320,00" />
          <SummaryCard title="Weekly Expense" amount="Rp 184.320,00" />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Outgoing History</h3>
            <div className="space-y-4">
              {historyData.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600 font-medium">{item.item}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${item.category === 'TRANSPORT' ? 'bg-[#dbeafe] text-[#1e40af]' : item.category === 'LIFESTYLE' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                    {item.category}
                  </span>
                  <span className="text-slate-400 text-xs">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Wishlist</h3>
              <button className="text-[#2563eb] text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div>
                    <h4 className="font-bold text-slate-800">Wishlist {i}</h4>
                    <p className="text-xs text-slate-400">Due to : 4 Apr 2026</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Daily Savings</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#1e40af" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Action</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input type="text" placeholder="15000" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm" />
                <select className="px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-black uppercase text-slate-500">
                  <option>INCOME</option>
                  <option>EXPENSE</option>
                </select>
              </div>
              <textarea placeholder="Description..." className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm resize-none" />
              <button className="w-full bg-[#1e40af] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Savings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
