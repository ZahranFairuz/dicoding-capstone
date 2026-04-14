import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import History from './pages/History';
import HistoryPage from './pages/HistoryPage';
import Wishlist from './pages/Wishlist';
import Transaction from './pages/Transaction';
import Analysis from './pages/Analysis';
import Category from './pages/Category';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/finance/savings" element={<Savings />} />
        <Route path="/finance/history" element={<History />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/category" element={<Category />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
