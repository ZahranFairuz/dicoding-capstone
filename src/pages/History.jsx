import React from 'react';
import Sidebar from '../components/Sidebar';

const SummaryCard = ({ title, amount }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{amount}</p>
    <div className="h-4 w-3/4 bg-slate-50 rounded-full" />
  </div>
);

const historyData = [
  { item: 'Buy food & drink', category: 'TRANSPORT', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'LIFESTYLE', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'F&B', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'F&B', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'LIFESTYLE', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
  { item: 'Buy food & drink', category: 'TRANSPORT', amount: '- Rp 35.000,00', date: '4 Apr 2026' },
];

const History = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Finance / History</h1>
        </header>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Weekly Income" amount="Rp 184.320,00" />
          <SummaryCard title="Weekly Expense" amount="Rp 184.320,00" />
          <SummaryCard title="Monthly Income" amount="Rp 184.320,00" />
          <SummaryCard title="Monthly Expense" amount="Rp 184.320,00" />
        </div>

        {/* Full History Table */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-100 pb-6">Outgoing History</h3>
          <div className="space-y-6">
            {historyData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="w-1/3">
                  <span className="text-slate-700 font-bold text-sm">{item.item}</span>
                </div>
                
                <div className="w-1/4 flex justify-center">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest ${
                    item.category === 'TRANSPORT' ? 'bg-[#dbeafe] text-[#1e40af]' : 
                    item.category === 'LIFESTYLE' ? 'bg-[#dcfce7] text-[#166534]' : 
                    'bg-[#fee2e2] text-[#991b1b]'
                  }`}>
                    {item.category}
                  </span>
                </div>

                <div className="w-1/4 flex justify-end">
                  <span className="text-[#991b1b] font-bold text-sm tracking-tight">
                    {item.amount}
                  </span>
                </div>

                <div className="w-1/5 flex justify-end">
                  <span className="text-slate-400 text-xs font-medium">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
