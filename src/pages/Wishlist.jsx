import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { WishlistRepositoryImpl } from '../infrastructure/repositories/WishlistRepositoryImpl';
import CONFIG from '../config';

const fmt = (val) => `Rp ${parseFloat(val || 0).toLocaleString('id-ID')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const PRIORITY_STYLE = {
  high:   'bg-[#fee2e2] text-[#991b1b]',
  medium: 'bg-[#fef9c3] text-[#854d0e]',
  low:    'bg-[#dcfce7] text-[#166534]',
};

const STATUS_STYLE = {
  ongoing:  'bg-[#dbeafe] text-[#1e40af]',
  finished: 'bg-[#dcfce7] text-[#166534]',
};

const EMPTY_FORM = { name: '', image_url: '', target_amount: '', priority: 'medium', status: 'ongoing', due_date: '' };

const WishlistModal = ({ isOpen, isEdit, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        name: initialData.name || '',
        image_url: initialData.image_url || '',
        target_amount: initialData.target_amount || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'ongoing',
        due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
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
      await onSubmit({ ...form, target_amount: Number(form.target_amount) });
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
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Wishlist' : 'Add Wishlist'}</h2>
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
            <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
            <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Target Amount</label>
            <input type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required min="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
            <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
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

const Wishlist = () => {
  const { token } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selected, setSelected] = useState(null);

  const repo = new WishlistRepositoryImpl(CONFIG.API_BASE_URL, token);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [wData, sData] = await Promise.all([repo.getAll(), repo.getStats()]);
      setWishlists(wData);
      setStats(sData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (data) => {
    await repo.create(data);
    await loadData();
  };

  const handleUpdate = async (data) => {
    await repo.update(selected.id, data);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this wishlist?')) return;
    try {
      await repo.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openAdd = () => { setIsEditMode(false); setSelected(null); setIsModalOpen(true); };
  const openEdit = (item) => { setIsEditMode(true); setSelected(item); setIsModalOpen(true); };

  // Pie chart: ongoing vs finished
  const pieData = [
    { name: 'Ongoing', value: parseInt(stats?.ongoing || 0), color: '#2563eb' },
    { name: 'Finished', value: parseInt(stats?.finished || 0), color: '#16a34a' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Wishlist</h1>
          <button onClick={openAdd}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Wishlist
          </button>
        </header>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 font-medium">{error}</p></div>}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Target', value: fmt(stats?.total_target_amount), big: true },
                { title: 'On Going', value: stats?.ongoing || '0', big: false },
                { title: 'Finished', value: stats?.finished || '0', big: false },
                { title: 'Total', value: stats?.total || '0', big: false },
              ].map(({ title, value, big }) => (
                <div key={title} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
                  <p className="text-slate-500 text-sm font-medium">{title}</p>
                  <p className={`font-bold text-slate-800 tracking-tight ${big ? 'text-xl' : 'text-3xl'}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Wishlist Cards Grid */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-8">Wishlist Items</h3>
                {wishlists.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium">No wishlist items yet</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlists.map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Image */}
                        <div className="aspect-[4/3] bg-slate-100 rounded-2xl mb-5 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }} />
                          ) : null}
                        </div>

                        <div className="space-y-1 mb-3">
                          <h4 className="font-bold text-slate-800 text-sm leading-snug pr-16">{item.name}</h4>
                          <p className="text-sm font-black text-slate-700">{fmt(item.target_amount)}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Due: {fmtDate(item.due_date)}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.medium}`}>
                            {item.priority}
                          </span>
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${STATUS_STYLE[item.status] || STATUS_STYLE.ongoing}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Pie Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-fit sticky top-12">
                <h3 className="text-lg font-bold text-slate-800 mb-8">Status Overview</h3>
                <div className="h-64 w-full flex flex-col items-center">
                  {pieData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 font-medium text-sm">No data yet</div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex gap-6 mt-4">
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

                {/* Stats breakdown */}
                {stats && (
                  <div className="mt-8 space-y-3 border-t border-slate-50 pt-6">
                    {[
                      { label: 'Total Items', value: stats.total },
                      { label: 'Ongoing', value: stats.ongoing },
                      { label: 'Finished', value: stats.finished },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                        <span className="text-sm font-black text-slate-700">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <WishlistModal
        isOpen={isModalOpen}
        isEdit={isEditMode}
        onClose={() => setIsModalOpen(false)}
        onSubmit={isEditMode ? handleUpdate : handleCreate}
        initialData={selected}
      />
    </div>
  );
};

export default Wishlist;
