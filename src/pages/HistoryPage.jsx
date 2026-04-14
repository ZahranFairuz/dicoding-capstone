import React from 'react';
import Sidebar from '../components/Sidebar';
import { Download, Search, MoreVertical, TrendingUp, ChevronDown } from 'lucide-react';

const SummaryCard = ({ title, amount, percentage, isIncome = true }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1 min-w-[240px]">
    <div className="flex justify-between items-start mb-4">
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black ${isIncome ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
        <TrendingUp size={12} className={isIncome ? '' : 'rotate-180'} />
        {percentage}%
      </div>
    </div>
    <p className="text-2xl font-black text-slate-800 tracking-tight">{amount}</p>
  </div>
);

const HistoryPage = () => {
  const transactions = [
    { name: 'Indomaret', category: 'Food & Drink', date: '22 March 2026', amount: '- Rp 30.000', type: 'EXPENSE', color: 'bg-red-100 text-red-600' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE', color: 'bg-red-100 text-red-600' },
    { name: 'Freelance', category: 'Financial', date: '15 March 2026', amount: '+ Rp 150.000', type: 'INCOME', color: 'bg-green-100 text-green-600' },
    { name: 'Savings', category: 'Financial', date: '2 March 2026', amount: '+ Rp 500.000', type: 'INCOME', color: 'bg-green-100 text-green-600' },
    { name: 'Transfer', category: 'Financial', date: '12 March 2026', amount: '- Rp 150.000', type: 'EXPENSE', color: 'bg-red-100 text-red-600' },
    { name: 'Concert Ticket', category: 'Entertainment', date: '19 March 2026', amount: '- Rp 100.000', type: 'EXPENSE', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">History</h1>
          <button className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-3 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20">
            <Download size={18} /> Download History
          </button>
        </header>

        {/* Summary Boxes */}
        <div className="flex flex-wrap gap-6 mb-10">
          <SummaryCard title="Total Income" amount="Rp 650.000" percentage="51" />
          <SummaryCard title="Total Expense" amount="Rp 318.000" percentage="49" isIncome={false} />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search History Transaction..."
              className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>
          <div className="flex gap-2 h-fit">
            <button className="px-6 py-3 rounded-xl border border-slate-100 bg-white shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              All Dates
            </button>
            <button className="px-6 py-3 rounded-xl border border-slate-100 bg-white shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-between min-w-[140px]">
              All Categories <ChevronDown size={14} />
            </button>
            <button className="px-6 py-3 rounded-xl border border-slate-100 bg-white shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-between min-w-[100px]">
              Types <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="py-6 pl-10">Name</th>
                <th className="py-6">Category</th>
                <th className="py-6">Date</th>
                <th className="py-6">Amount</th>
                <th className="py-6">Type</th>
                <th className="py-6 text-center pr-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-6 pl-10 text-sm font-bold text-slate-700">{tx.name}</td>
                  <td className="py-6 text-sm font-medium text-slate-500">{tx.category}</td>
                  <td className="py-6 text-sm font-bold text-slate-500">{tx.date}</td>
                  <td className={`py-6 text-sm font-black tracking-tight ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.amount}
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest ${tx.color.includes('green') ? 'bg-green-200/50 text-green-700' : 'bg-red-200/50 text-red-700'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-6 text-center pr-10">
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12">
          <p className="text-sm font-bold text-slate-400">Showing 1 to 6 of 12 transactions</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 px-4">&lt;</button>
            <button className="w-10 h-10 rounded-xl bg-[#2563eb] text-white font-black text-sm shadow-lg shadow-blue-600/30">1</button>
            <button className="w-10 h-10 rounded-xl border border-slate-100 text-slate-400 font-black text-sm hover:bg-slate-50">2</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-10 h-10 rounded-xl border border-slate-100 text-slate-400 font-black text-sm hover:bg-slate-50">12</button>
            <button className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 px-4">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
