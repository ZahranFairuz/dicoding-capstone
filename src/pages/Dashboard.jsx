import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Calendar, Eye } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { DashboardRepositoryImpl } from '../infrastructure/repositories/DashboardRepositoryImpl';
import { GetDashboard } from '../application/use-cases/GetDashboard';
import CONFIG from '../config';

const SummaryCard = ({ title, amount, period = '' }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-all">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{amount}</p>
    {period && <p className="text-xs text-slate-400">{period}</p>}
  </div>
);

const getCategoryColor = (categoryName) => {
  const colors = {
    'makanan': { bg: 'bg-orange-50', text: 'text-orange-600' },
    'gaji': { bg: 'bg-green-50', text: 'text-green-600' },
    'transport': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'entertainment': { bg: 'bg-purple-50', text: 'text-purple-600' },
  };
  const key = categoryName?.toLowerCase();
  return colors[key] || { bg: 'bg-slate-50', text: 'text-slate-600' };
};

const Dashboard = () => {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const dashboardRepo = new DashboardRepositoryImpl(CONFIG.API_BASE_URL, token);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const getDashboardUseCase = new GetDashboard(dashboardRepo);
        const data = await getDashboardUseCase.execute();
        setDashboard(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
        console.error('Load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {dashboard && (
          <>
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <SummaryCard 
                title="Today Income" 
                amount={`Rp ${Math.round(dashboard.summary.todayIncome).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Today Expense" 
                amount={`Rp ${Math.round(dashboard.summary.todayExpense).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Weekly Income" 
                amount={`Rp ${Math.round(dashboard.summary.weeklyIncome).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Weekly Expense" 
                amount={`Rp ${Math.round(dashboard.summary.weeklyExpense).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Monthly Income" 
                amount={`Rp ${Math.round(dashboard.summary.monthlyIncome).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Monthly Expense" 
                amount={`Rp ${Math.round(dashboard.summary.monthlyExpense).toLocaleString('id-ID')}`}
              />
              <SummaryCard 
                title="Monthly Savings" 
                amount={`Rp ${dashboard.summary.monthlySavings.toLocaleString('id-ID')}`}
              />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Transactions</h3>
                {dashboard.recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {dashboard.recentTransactions.map((transaction) => {
                      const colors = getCategoryColor(transaction.categoryName);
                      return (
                        <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors">
                          <div className="flex-1">
                            <p className="text-slate-800 font-medium">{transaction.name}</p>
                            <p className="text-xs text-slate-400">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                          </div>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                            {transaction.categoryName}
                          </span>
                          <span className={`text-sm font-bold ml-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'} Rp {Math.round(transaction.amount).toLocaleString('id-ID')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No transactions yet</p>
                )}
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Wishlist Stats</h3>
                </div>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-600 mb-1">{dashboard.wishlistStats.total}</div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Wishlist</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-black text-blue-600">{dashboard.wishlistStats.ongoing}</div>
                      <p className="text-xs text-slate-500 uppercase font-bold mt-1">Ongoing</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-black text-green-600">{dashboard.wishlistStats.finished}</div>
                      <p className="text-xs text-slate-500 uppercase font-bold mt-1">Finished</p>
                    </div>
                  </div>
                  <button className="w-full text-blue-600 font-bold text-sm hover:underline">View All Wishlist</button>
                </div>
              </div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-8">Financial Summary</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div>
                      <p className="text-sm text-green-600 font-bold">Monthly Income</p>
                      <p className="text-2xl font-black text-green-700 mt-1">Rp {Math.round(dashboard.summary.monthlyIncome).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-4xl font-black text-green-200">💰</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
                    <div>
                      <p className="text-sm text-red-600 font-bold">Monthly Expense</p>
                      <p className="text-2xl font-black text-red-700 mt-1">Rp {Math.round(dashboard.summary.monthlyExpense).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-4xl font-black text-red-200">💸</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div>
                      <p className="text-sm text-blue-600 font-bold">Monthly Savings</p>
                      <p className="text-2xl font-black text-blue-700 mt-1">Rp {dashboard.summary.monthlySavings.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-4xl font-black text-blue-200">🎯</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Action</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Amount..." 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm focus:ring-2 focus:ring-blue-100"
                    />
                    <select className="px-3 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-bold uppercase text-slate-600">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Description..." 
                    className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm resize-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                    <Plus size={16} /> Add Transaction
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
