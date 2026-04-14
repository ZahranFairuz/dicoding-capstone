import React from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, MoreVertical, Lightbulb, TrendingUp } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const SummaryCard = ({ title, amount, percentage, isIncome = true }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
    <div className="p-5 flex-1">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 text-sm font-semibold">{title}</p>
        <select className="text-[10px] border-none bg-slate-50 rounded-md px-1 py-0.5 text-slate-400 font-bold outline-none">
          <option>This Month</option>
        </select>
      </div>
      <p className="text-2xl font-black text-slate-800 tracking-tight mb-4">{amount}</p>
    </div>
    <div className={`px-5 py-2 flex items-center gap-2 ${isIncome ? 'bg-green-50' : 'bg-red-50'}`}>
      <TrendingUp size={14} className={isIncome ? 'text-green-500' : 'text-red-500 rotate-180'} />
      <span className={`text-[10px] font-black ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
        {percentage} <span className="text-slate-400 font-medium ml-1">In This Month</span>
      </span>
    </div>
  </div>
);

const categoryData = [
  { name: 'Financial', value: 42, color: '#ef4444' },
  { name: 'Entertainment', value: 25, color: '#38bdf8' },
  { name: 'Transport', value: 13, color: '#f59e0b' },
  { name: 'Food & Drink', value: 12, color: '#facc15' },
  { name: 'Others', value: 8, color: '#4ade80' },
];

const Category = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Category</h1>
          <button className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Category
          </button>
        </header>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Total Income" amount="Rp 650.000" percentage="12.4%" />
          <SummaryCard title="Total Expense" amount="Rp 318.000" percentage="10%" isIncome={false} />
          <SummaryCard title="Total Income" amount="Rp 650.000" percentage="12.4%" />
          <SummaryCard title="Total Income" amount="Rp 650.000" percentage="12.4%" />
        </div>

        {/* Middle Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Donut Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">All By Category</h3>
              <select className="text-[10px] bg-slate-50 rounded-lg px-3 py-1.5 text-slate-400 font-bold outline-none border-none">
                <option>This Month</option>
              </select>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-64 h-64 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-black text-slate-800">Rp 650.000</span>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-400 group-hover:text-[#2563eb] transition-colors">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-[#eff6ff] p-8 rounded-[2.5rem] shadow-sm border border-blue-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-[#2563eb] mb-2">
              <Lightbulb size={24} className="fill-blue-100" />
              <h3 className="text-lg font-black tracking-tight">Insight Bulan Ini</h3>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 flex gap-4">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                 <Lightbulb size={16} className="text-[#2563eb]" />
               </div>
               <p className="text-sm text-slate-700 leading-relaxed font-medium">
                 Di bulan ini, pendapatan anda lebih besar <span className="font-black text-[#2563eb]">8%</span> dibanding dengan bulan sebelumnya.
               </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 flex gap-4">
               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                 <TrendingUp size={16} className="text-green-600" />
               </div>
               <p className="text-sm text-slate-700 leading-relaxed font-medium">
                 Pengeluaran turun <span className="font-black text-green-600">3.5%</span> dibanding dengan bulan sebelumnya. Pertahankan kebiasan menabung dan hemat ini.
               </p>
            </div>
          </div>
        </div>

        {/* Bottom Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Category..."
                className="w-full pl-12 pr-6 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl w-full md:w-auto">
              {['All Types', 'Income', 'Expense'].map((type, i) => (
                <button 
                  key={type}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white shadow-sm text-[#2d346b]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 pl-4">Category</th>
                  <th className="pb-6">Date</th>
                  <th className="pb-6">Total Usage</th>
                  <th className="pb-6">Usage</th>
                  <th className="pb-6">Type</th>
                  <th className="pb-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'Financial', date: '2 March 2026', total: 'Rp 500.000', usage: '42%', type: 'INCOME', color: 'bg-[#86efac] text-[#166534]' },
                  { name: 'Food & Drink', date: '23 March 2026', total: 'Rp 30.000', usage: '12%', type: 'EXPENSE', color: 'bg-[#fca5a5] text-[#991b1b]' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-6 pl-4 text-sm font-bold text-slate-800">{row.name}</td>
                    <td className="py-6 text-sm font-bold text-slate-800">{row.date}</td>
                    <td className="py-6 text-sm font-bold text-slate-800">{row.total}</td>
                    <td className="py-6 text-sm font-bold text-slate-800">{row.usage}</td>
                    <td className="py-6">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-[0.15em] ${row.color}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-6 text-center">
                      <button className="text-slate-400 hover:text-slate-800">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
            <p className="text-xs font-bold text-slate-400">Showing 1 to 2 of 5 Category</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3">&lt;</button>
              <button className="w-10 h-10 rounded-lg bg-[#2563eb] text-white font-black text-xs shadow-lg shadow-blue-600/30">1</button>
              <button className="w-10 h-10 rounded-lg border border-slate-100 text-slate-400 font-black text-xs hover:bg-slate-50">2</button>
              <span className="px-2 text-slate-400">...</span>
              <button className="w-10 h-10 rounded-lg border border-slate-100 text-slate-400 font-black text-xs hover:bg-slate-50">12</button>
              <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3">&gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;
