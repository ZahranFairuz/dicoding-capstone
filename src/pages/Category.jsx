import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, MoreVertical, Lightbulb, TrendingUp, Edit2, Trash2, X } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { CategoryRepositoryImpl } from '../infrastructure/repositories/CategoryRepositoryImpl';
import { GetAllCategories } from '../application/use-cases/GetAllCategories';
import { GetCategoryStats } from '../application/use-cases/GetCategoryStats';
import { CreateCategory } from '../application/use-cases/CreateCategory';
import { UpdateCategory } from '../application/use-cases/UpdateCategory';
import { DeleteCategory } from '../application/use-cases/DeleteCategory';
import CONFIG from '../config';

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

const CategoryModal = ({ isOpen, isEdit, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && initialData) {
      setName(initialData.name);
      setType(initialData.type);
    } else {
      setName('');
      setType('expense');
    }
    setError('');
  }, [isEdit, initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSubmit({ name, type });
      setName('');
      setType('expense');
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
          <h2 className="text-2xl font-bold text-slate-800">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., Makanan & Minuman"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-gray-50"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Category = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryRepo = new CategoryRepositoryImpl(CONFIG.API_BASE_URL, token);

  // Load categories and stats
  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const getAllCategoriesUseCase = new GetAllCategories(categoryRepo);
      const getCategoryStatsUseCase = new GetCategoryStats(categoryRepo);

      const [categoriesData, statsData] = await Promise.all([
        getAllCategoriesUseCase.execute(),
        getCategoryStatsUseCase.execute(),
      ]);

      setCategories(categoriesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async (data) => {
    try {
      const createCategoryUseCase = new CreateCategory(categoryRepo);
      await createCategoryUseCase.execute(data.name, data.type);
      await loadData();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      const updateCategoryUseCase = new UpdateCategory(categoryRepo);
      await updateCategoryUseCase.execute(selectedCategory.id, data.name, data.type);
      await loadData();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setIsDeleting(true);
    try {
      const deleteCategoryUseCase = new DeleteCategory(categoryRepo);
      await deleteCategoryUseCase.execute(categoryId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Prepare chart data from stats
  const chartData = stats.map((stat, index) => ({
    name: stat.name,
    value: parseInt(stat.total_amount) || 0,
    color: ['#ef4444', '#38bdf8', '#f59e0b', '#facc15', '#4ade80'][index % 5],
  }));

  // Filter categories
  let filteredCategories = categories;
  if (filterType !== 'all') {
    filteredCategories = categories.filter(cat => cat.type === filterType);
  }
  if (searchTerm) {
    filteredCategories = filteredCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const totalIncome = categories
    .filter(c => c.type === 'income')
    .reduce((sum, c) => {
      const stat = stats.find(s => s.id === c.id);
      return sum + (parseInt(stat?.total_amount) || 0);
    }, 0);

  const totalExpense = categories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => {
      const stat = stats.find(s => s.id === c.id);
      return sum + (parseInt(stat?.total_amount) || 0);
    }, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Category</h1>
          <button 
            onClick={openAddModal}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            disabled={isLoading}
          >
            <Plus size={18} /> Add Category
          </button>
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
              <p className="text-slate-600">Loading categories...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              <SummaryCard 
                title="Total Income" 
                amount={`Rp ${totalIncome.toLocaleString('id-ID')}`} 
                percentage="12.4%" 
                isIncome={true}
              />
              <SummaryCard 
                title="Total Expense" 
                amount={`Rp ${totalExpense.toLocaleString('id-ID')}`} 
                percentage="10%" 
                isIncome={false}
              />
              <SummaryCard 
                title="Categories" 
                amount={categories.length} 
                percentage="100%" 
                isIncome={true}
              />
              <SummaryCard 
                title="Income Categories" 
                amount={categories.filter(c => c.type === 'income').length} 
                percentage="50%" 
                isIncome={true}
              />
            </div>

            {/* Analysis Section */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Donut Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800">All By Category</h3>
                  </div>
                  
                  {chartData.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="relative w-64 h-64 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                          <span className="text-xl font-black text-slate-800">Rp {(totalIncome + totalExpense).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full space-y-4">
                        {chartData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.name}</span>
                            </div>
                            <span className="text-sm font-black text-slate-400 group-hover:text-[#2563eb] transition-colors">Rp {item.value.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-12">No data available</p>
                  )}
                </div>

                {/* Insights Panel */}
                <div className="bg-[#eff6ff] p-8 rounded-[2.5rem] shadow-sm border border-blue-100">
                  <div className="flex items-center gap-3 text-[#2563eb] mb-6">
                    <Lightbulb size={24} className="fill-blue-100" />
                    <h3 className="text-lg font-black tracking-tight">Info</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Lightbulb size={16} className="text-[#2563eb]" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        Total Categories: <span className="font-black text-[#2563eb]">{categories.length}</span>
                      </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} className="text-green-600" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        Income: <span className="font-black text-green-600">{categories.filter(c => c.type === 'income').length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search Category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl w-full md:w-auto">
                  {['all', 'income', 'expense'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white shadow-sm text-[#2d346b]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                {filteredCategories.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                        <th className="pb-6 pl-4">Category</th>
                        <th className="pb-6">Created</th>
                        <th className="pb-6">Total Usage</th>
                        <th className="pb-6">Amount</th>
                        <th className="pb-6">Type</th>
                        <th className="pb-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCategories.map((category) => {
                        const stat = stats.find(s => s.id === category.id);
                        return (
                          <tr key={category.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-6 pl-4 text-sm font-bold text-slate-800">{category.name}</td>
                            <td className="py-6 text-sm font-bold text-slate-800">
                              {new Date(category.createdAt).toLocaleDateString('id-ID')}
                            </td>
                            <td className="py-6 text-sm font-bold text-slate-800">
                              {stat?.total_usage || '0'} times
                            </td>
                            <td className="py-6 text-sm font-bold text-slate-800">
                              Rp {parseInt(stat?.total_amount || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="py-6">
                              <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-[0.15em] ${
                                category.type === 'income' 
                                  ? 'bg-[#86efac] text-[#166534]' 
                                  : 'bg-[#fca5a5] text-[#991b1b]'
                              }`}>
                                {category.type}
                              </span>
                            </td>
                            <td className="py-6 text-center">
                              <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditModal(category)}
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                  disabled={isDeleting}
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  disabled={isDeleting}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No categories found</p>
                  </div>
                )}
              </div>

              {/* Pagination Info */}
              <div className="flex justify-between items-center gap-6 mt-10">
                <p className="text-xs font-bold text-slate-400">
                  Showing {filteredCategories.length} of {categories.length} Categories
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <CategoryModal
        isOpen={isModalOpen}
        isEdit={isEditMode}
        onClose={() => setIsModalOpen(false)}
        onSubmit={isEditMode ? handleUpdateCategory : handleAddCategory}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default Category;
