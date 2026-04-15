import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { GetHistory } from '../application/use-cases/GetHistory';
import { HistoryRepositoryImpl } from '../infrastructure/repositories/HistoryRepositoryImpl';
import CONFIG from '../config';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const getCategoryColor = (categoryName) => {
  const colors = {
    makanan: 'bg-[#fed7aa] text-[#92400e]',
    gaji: 'bg-[#dcfce7] text-[#166534]',
    transport: 'bg-[#dbeafe] text-[#1e40af]',
    hiburan: 'bg-[#f3e8ff] text-[#6b21a8]',
    belanja: 'bg-[#fce7f3] text-[#831843]',
    investasi: 'bg-[#d1fae5] text-[#065f46]',
    transfer: 'bg-[#e0e7ff] text-[#3730a3]',
    tagihan: 'bg-[#fef3c7] text-[#78350f]',
  };
  
  return colors[categoryName?.toLowerCase()] || 'bg-slate-100 text-slate-800';
};

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const History = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const itemsPerPage = 10;

  const handleFetchHistory = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const repository = new HistoryRepositoryImpl(CONFIG.API_BASE_URL, token);
      const useCase = new GetHistory(repository);

      const filters = {
        search: searchQuery || undefined,
        type: typeFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await useCase.execute(filters);
      setTransactions(response.items);
      setTotalTransactions(response.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery, typeFilter, startDate, endDate, currentPage]);

  useEffect(() => {
    handleFetchHistory();
  }, [handleFetchHistory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Finance / History</h1>
        </header>

        {/* Filter Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Search & Filter</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={handleTypeChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {/* Reset Button */}
          {(searchQuery || typeFilter || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results Information */}
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Showing <strong>{transactions.length}</strong> of <strong>{totalTransactions}</strong> transactions
          </p>
        </div>

        {/* History Table */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <Spinner />
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No transactions found</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-100 pb-6">Transaction History</h3>
              <div className="space-y-6">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between group hover:bg-slate-50 p-4 rounded-lg transition-colors">
                    <div className="flex-1">
                      <p className="text-slate-700 font-bold text-sm">{tx.name}</p>
                      <p className="text-slate-400 text-xs mt-1">{tx.description}</p>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${getCategoryColor(tx.categoryName)}`}>
                        {tx.categoryName}
                      </span>
                    </div>

                    <div className="flex-1 flex justify-end">
                      <span className={`font-bold text-sm tracking-tight ${tx.type === 'income' ? 'text-[#166534]' : 'text-[#991b1b]'}`}>
                        {tx.type === 'income' ? '+ ' : '- '}
                        {Math.abs(tx.amount).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </div>

                    <div className="flex-1 flex justify-end">
                      <span className="text-slate-400 text-xs font-medium">
                        {new Date(tx.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <div className="text-sm text-slate-600">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} /> Previous
                    </button>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
