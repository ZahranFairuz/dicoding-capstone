import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TransactionRepositoryImpl } from '../infrastructure/repositories/TransactionRepositoryImpl';
import { CategoryRepositoryImpl } from '../infrastructure/repositories/CategoryRepositoryImpl';
import CONFIG from '../config';

const EMPTY_FORM = { category_id: '', name: '', amount: '', type: 'expense', description: '', date: '' };

const TransactionModal = ({ isOpen, isEdit, onClose, onSubmit, initialData, categories }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        category_id: initialData.category_id || '',
        name: initialData.name || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        description: initialData.description || '',
        date: initialData.date ? initialData.date.split('T')[0] : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [isEdit, initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onSubmit({ ...form, amount: Number(form.amount), category_id: Number(form.category_id) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm font-medium">{error}</p></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required min="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Transaction = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const limit = 10;

  const txRepo = new TransactionRepositoryImpl(CONFIG.API_BASE_URL, token);
  const catRepo = new CategoryRepositoryImpl(CONFIG.API_BASE_URL, token);

  const loadData = async (currentPage = page) => {
    setIsLoading(true);
    setError('');
    try {
      const [txData, summaryData, catsData] = await Promise.all([
        txRepo.getAll(currentPage, limit),
        txRepo.getSummary(),
        catRepo.getAll(),
      ]);
      setTransactions(txData.transactions);
      setTotal(txData.total);
      setSummary(summaryData);
      setCategories(catsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page]);

  const handleCreate = async (data) => {
    await txRepo.create(data);
    await loadData();
  };

  const handleUpdate = async (data) => {
    await txRepo.update(selectedTx.id, data);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await txRepo.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openAdd = () => { setIsEditMode(false); setSelectedTx(null); setIsModalOpen(true); };
  const openEdit = (tx) => { setIsEditMode(true); setSelectedTx(tx); setIsModalOpen(true); };

  const filtered = transactions.filter(tx =>
    tx.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  const fmt = (amount) => `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transaction</h1>
          <button onClick={openAdd}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Transaction
          </button>
        </header>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Income", value: summary.today_income, green: true },
              { label: "Today's Expense", value: summary.today_expense, green: false },
              { label: 'Weekly Income', value: summary.weekly_income, green: true },
              { label: 'Weekly Expense', value: summary.weekly_expense, green: false },
            ].map(({ label, value, green }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <p className={`text-lg font-black ${green ? 'text-green-600' : 'text-red-500'}`}>{fmt(value)}</p>
              </div>
            ))}
          </div>
        )}

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 font-medium">{error}</p></div>}

        <div className="relative mb-8 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search Transaction..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 text-sm" />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-slate-400 font-medium">No transactions found</td></tr>
                  ) : filtered.map((tx) => {
                    const cat = categories.find(c => c.id === tx.category_id);
                    return (
                      <tr key={tx.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="py-6 pl-10 text-sm font-bold text-slate-800">{tx.name}</td>
                        <td className="py-6 text-sm font-medium text-slate-500">{cat?.name || '-'}</td>
                        <td className="py-6 text-sm font-bold text-slate-700">{fmtDate(tx.date)}</td>
                        <td className={`py-6 text-sm font-black tracking-tight ${tx.type === 'income' ? 'text-green-600' : 'text-[#ef4444]'}`}>
                          {tx.type === 'income' ? '+' : '-'} {fmt(tx.amount)}
                        </td>
                        <td className="py-6 text-center">
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest ${
                            tx.type === 'income' ? 'bg-[#86efac] text-[#166534]' : 'bg-[#fca5a5] text-[#991b1b]'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-6 text-center pr-10">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(tx)} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(tx.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
          <p className="text-xs font-bold text-slate-400">
            Showing {filtered.length} of {total} Transactions
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3 disabled:opacity-40">&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-black text-xs transition-all ${page === p ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30' : 'border border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 px-3 disabled:opacity-40">&gt;</button>
            </div>
          )}
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        isEdit={isEditMode}
        onClose={() => setIsModalOpen(false)}
        onSubmit={isEditMode ? handleUpdate : handleCreate}
        initialData={selectedTx}
        categories={categories}
      />
    </div>
  );
};

export default Transaction;
