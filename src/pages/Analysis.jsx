import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, TrendingUp, Lightbulb, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { AnalysisRepositoryImpl } from '../infrastructure/repositories/AnalysisRepositoryImpl';
import { GetAnalysisSummary } from '../application/use-cases/GetAnalysisSummary';
import { GetCategoryAnalysis } from '../application/use-cases/GetCategoryAnalysis';
import { GetAnalysisInsights } from '../application/use-cases/GetAnalysisInsights';
import CONFIG from '../config';

const AnalysisCard = ({ title, amount, percentage, isPositive = true, trend = null }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between mb-6 group hover:shadow-md transition-all">
    <div className="flex-1">
      <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{amount}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      {trend !== null && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span className="text-[10px] font-black">{Math.abs(trend)}%</span>
        </div>
      )}
      {percentage && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          <TrendingUp size={14} className={isPositive ? '' : 'rotate-180'} />
          <span className="text-[10px] font-black">{percentage}%</span>
        </div>
      )}
    </div>
  </div>
);

const Analysis = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const analysisRepo = new AnalysisRepositoryImpl(CONFIG.API_BASE_URL, token);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const summaryUseCase = new GetAnalysisSummary(analysisRepo);
      const categoryUseCase = new GetCategoryAnalysis(analysisRepo);
      const insightsUseCase = new GetAnalysisInsights(analysisRepo);

      const [summaryData, categoryData, insightsData] = await Promise.all([
        summaryUseCase.execute(),
        categoryUseCase.execute(selectedMonth),
        insightsUseCase.execute(),
      ]);

      setSummary(summaryData);
      setCategoryAnalysis(categoryData);
      setInsights(insightsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load analysis data');
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  // Prepare chart data
  const expenseData = categoryAnalysis
    .filter(cat => cat.type === 'expense')
    .map((cat, index) => ({
      name: cat.name,
      value: cat.totalAmount,
      color: ['#ef4444', '#38bdf8', '#f59e0b', '#facc15', '#4ade80'][index % 5],
    }));

  const incomeData = categoryAnalysis
    .filter(cat => cat.type === 'income')
    .map((cat, index) => ({
      name: cat.name,
      value: cat.totalAmount,
      color: ['#86efac', '#3b82f6', '#fbbf24', '#f87171', '#a78bfa'][index % 5],
    }));

  // Calculate savings percentage
  const savingsPercent = summary && summary.thisMonthIncome > 0
    ? Math.round((summary.thisMonthSavings / summary.thisMonthIncome) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Analysis</h1>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
          />
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading analysis data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Stat Cards */}
              <div className="w-full lg:w-1/3">
                {summary && (
                  <>
                    <AnalysisCard 
                      title="Total Income" 
                      amount={`Rp ${Math.round(summary.thisMonthIncome).toLocaleString('id-ID')}`}
                      trend={summary.incomeChangePercent}
                      isPositive={true}
                    />
                    <AnalysisCard 
                      title="Total Expense" 
                      amount={`Rp ${Math.round(summary.thisMonthExpense).toLocaleString('id-ID')}`}
                      trend={summary.expenseChangePercent}
                      isPositive={false}
                    />
                    <AnalysisCard 
                      title="Total Savings" 
                      amount={`Rp ${summary.thisMonthSavings.toLocaleString('id-ID')}`}
                      percentage={savingsPercent}
                      isPositive={true}
                    />
                  </>
                )}

                {/* Insights Section */}
                {insights.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb size={20} className="text-blue-600" />
                      <h3 className="font-bold text-blue-900">Insights</h3>
                    </div>
                    <div className="space-y-3">
                      {insights.map((insight, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100">
                          <p className="text-sm text-slate-700 font-medium">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Charts */}
              <div className="flex-1 space-y-8">
                {/* Expense Chart */}
                {expenseData.length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Expenses By Category</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="w-64 h-64 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseData}
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => `Rp ${Math.round(value).toLocaleString('id-ID')}`}
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex-1 space-y-3">
                        {expenseData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm font-bold text-slate-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-black text-slate-800">Rp {Math.round(item.value).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Income Chart */}
                {incomeData.length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Income By Category</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="w-64 h-64 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incomeData}
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {incomeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => `Rp ${Math.round(value).toLocaleString('id-ID')}`}
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex-1 space-y-3">
                        {incomeData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm font-bold text-slate-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-black text-slate-800">Rp {Math.round(item.value).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Comparison */}
                {summary && summary.lastMonthIncome > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Month Comparison</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-600 font-bold mb-2">This Month Income</p>
                        <p className="text-xl font-black text-slate-800">Rp {Math.round(summary.thisMonthIncome).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-500 mt-2">Last: Rp {Math.round(summary.lastMonthIncome).toLocaleString('id-ID')}</p>
                      </div>

                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-sm text-red-600 font-bold mb-2">This Month Expense</p>
                        <p className="text-xl font-black text-slate-800">Rp {Math.round(summary.thisMonthExpense).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-500 mt-2">Last: Rp {Math.round(summary.lastMonthExpense).toLocaleString('id-ID')}</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-sm text-green-600 font-bold mb-2">This Month Savings</p>
                        <p className="text-xl font-black text-slate-800">Rp {summary.thisMonthSavings.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-500 mt-2">Last: Rp {summary.lastMonthSavings.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analysis;
