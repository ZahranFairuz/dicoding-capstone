import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { SavingsRepositoryImpl } from '../infrastructure/repositories/SavingsRepositoryImpl';
import CONFIG from '../config';

const fmt = (val) => `Rp ${parseFloat(val || 0).toLocaleString('id-ID')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const SummaryCard = ({ title, amount, green }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className={`text-2xl font-bold tracking-tight ${green ? 'text-green-600' : green === false ? 'text-red-500' : 'text-slate-800'}`}>{amount}</p>
  </div>
);

const Savings = () => {
  const { token } = useAuth();
  const [savings, setSavings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick action form
  const [form, setForm] = useState({ amount: '', type: 'income', description: '', date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const repo = new SavingsRepositoryImpl(CONFIG.API_BASE_URL, token);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [savingsData, summaryData, chart] = await Promise.all([
        repo.getAll(),
        repo.getSummary(),
        repo.getChart(chartPeriod),
      ]);
      setSavings(savingsData);
      setSummary(summaryData);
      setChartData(chart);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const loadChart = async (period) => {
    try {
      const chart = await repo.getChart(period);
      setChartData(chart);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    loadChart(period);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');
    try {
      await repo.create({ ...form, amount: Number(form.amount) });
      setForm({ amount: '', type: 'income', description: '', date: '' });
      setFormSuccess('Saving added successfully!');
      await loadData();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pie chart: income vs expense from savings list
  const totalIncome = savings.filter(s => s.type === 'income').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const totalExpense = savings.filter(s => s.type === 'expense').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const pieData = [
    { name: 'Income', value: totalIncome, color: '#16a34a' },
    { name: 'Expense', value: totalExpense, color: '#dc2626' },
  ].filter(d => d.value > 0);

  // Bar chart: map API chart data
  const barData = chartData.map(d => ({
    name: d.label || d.date || d.month || d.period || '',
    value: parseFloat(d.amount || d.total || d.value || 0),
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Finance / Savings</h1>
        </header>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 font-medium">{error}</p></div>}

        {/* Summary Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard title="Total Income" amount={fmt(summary?.total_income)} green={true} />
              <SummaryCard title="Total Expense" amount={fmt(summary?.total_expense)} green={false} />
              <SummaryCard title="Total Savings" amount={fmt(summary?.total_savings)} green={null} />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-800">Savings Chart</h3>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    {['daily', 'monthly'].map(p => (
                      <button key={p} onClick={() => handlePeriodChange(p)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${chartPeriod === p ? 'bg-white shadow-sm text-[#2d346b]' : 'text-slate-400 hover:text-slate-600'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64 w-full">
                  {barData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 font-medium">No chart data available</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Bar dataKey="value" fill="#1e40af" radius={[6, 6, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Income vs Expense</h3>
                <div className="flex-1 flex flex-col items-center justify-center">
                  {pieData.length === 0 ? (
                    <p className="text-slate-400 font-medium text-sm">No data available</p>
                  ) : (
                    <>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(v) => fmt(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-4 mt-4">
                        {pieData.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-bold text-slate-600">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Savings History */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Savings History</h3>
                {savings.length === 0 ? (
                  <p className="text-slate-400 text-center py-8 font-medium">No savings records yet</p>
                ) : (
                  <div className="space-y-4">
                    {savings.map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-slate-700 font-semibold text-sm">{s.description || '-'}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{fmtDate(s.date)}</p>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                          s.type === 'income' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'
                        }`}>
                          {s.type}
                        </span>
                        <span className={`font-black text-sm ${s.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                          {s.type === 'income' ? '+' : '-'} {fmt(s.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Action</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                  {formError && <p className="text-red-600 text-sm font-medium">{formError}</p>}
                  {formSuccess && <p className="text-green-600 text-sm font-medium">{formSuccess}</p>}
                  <div className="flex gap-3">
                    <input type="number" placeholder="Amount" value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm" required min="0" />
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-black uppercase text-slate-500">
                      <option value="income">INCOME</option>
                      <option value="expense">EXPENSE</option>
                    </select>
                  </div>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm" required />
                  <textarea placeholder="Description..." value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full h-28 px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm resize-none" />
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-[#1e40af] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <Plus size={16} /> {isSubmitting ? 'Saving...' : 'Add Saving'}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Savings;
