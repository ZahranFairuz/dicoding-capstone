import React from 'react';
import Sidebar from '../components/Sidebar';
import { Search, TrendingUp } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AnalysisCard = ({ title, amount, percentage, isPositive = true }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between mb-6 group hover:shadow-md transition-all">
    <div>
      <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{amount}</p>
    </div>
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
      <TrendingUp size={14} className={isPositive ? '' : 'rotate-180'} />
      <span className="text-[10px] font-black">{percentage}%</span>
    </div>
  </div>
);

const analysisPieData = [
  { name: 'Investment', value: 25, color: '#818cf8' },
  { name: 'Education', value: 20, color: '#f87171' },
  { name: 'Term Life', value: 15, color: '#38bdf8' },
  { name: 'Whole Life', value: 25, color: '#fb923c' },
  { name: 'Insurance', value: 15, color: '#6366f1' },
];

const Analysis = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Analysis</h1>
        </header>

        <div className="relative mb-12 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Analysis..."
            className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Stat Cards */}
          <div className="w-full lg:w-1/3">
            <AnalysisCard title="Total Income" amount="Rp 650.000" percentage="51" />
            <AnalysisCard title="Total Expense" amount="Rp 318.000" percentage="49" isPositive={false} />
            <AnalysisCard title="Total Savings" amount="Rp 322.000" percentage="51" />
          </div>

          {/* Right Column: Large Donut Chart */}
          <div className="flex-1 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-800 mb-10 w-full text-left">Expenses By Category</h3>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysisPieData}
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {analysisPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Centered Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {analysisPieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
