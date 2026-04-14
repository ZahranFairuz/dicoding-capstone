import React from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, MoreVertical } from 'lucide-react';

const Transaction = () => {
  const transactions = [
    { name: 'Indomaret', category: 'Food & Drink', date: '22 March 2026', amount: '- Rp 30.000', type: 'EXPENSE' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE' },
    { name: 'Grab', category: 'Transport', date: '23 March 2026', amount: '- Rp 28.000', type: 'EXPENSE' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transaction</h1>
          <button className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Transaction
          </button>
        </header>

        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Transaction..."
            className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="py-6 pl-10">Name</th>
                  <th className="py-6">Category</th>
                  <th className="py-6">Date</th>
                  <th className="py-6">Amount</th>
                  <th className="py-6 text-center">Type</th>
                  <th className="py-6 text-center pr-10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx, i) => (
                  <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="py-6 pl-10 text-sm font-bold text-slate-800">{tx.name}</td>
                    <td className="py-6 text-sm font-medium text-slate-500">{tx.category}</td>
                    <td className="py-6 text-sm font-bold text-slate-700">{tx.date}</td>
                    <td className="py-6 text-sm font-black text-[#ef4444] tracking-tight">{tx.amount}</td>
                    <td className="py-6 text-center">
                      <span className="text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest bg-[#fca5a5] text-[#991b1b]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-6 text-center pr-10">
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
          <p className="text-xs font-bold text-slate-400">Showing 1 to 4 of 7 Transaction</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3 transition-colors">&lt;</button>
            <button className="w-10 h-10 rounded-lg bg-[#2563eb] text-white font-black text-xs shadow-lg shadow-blue-600/30">1</button>
            <button className="w-10 h-10 rounded-lg border border-slate-100 text-slate-400 font-black text-xs hover:bg-slate-50 transition-colors">2</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-10 h-10 rounded-lg border border-slate-100 text-slate-400 font-black text-xs hover:bg-slate-50 transition-colors">7</button>
            <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3 transition-colors">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
