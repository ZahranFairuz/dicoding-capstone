import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { GetProfile } from '../application/use-cases/GetProfile';
import { AuthRepositoryImpl } from '../infrastructure/repositories/AuthRepositoryImpl';
import CONFIG from '../config';
import { Mail, User as UserIcon, Calendar, LogOut } from 'lucide-react';

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Profile = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const repository = new AuthRepositoryImpl(CONFIG.API_BASE_URL, token);
        const useCase = new GetProfile(repository);
        const profileData = await useCase.execute();
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Finance / Profile</h1>
        </header>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        ) : profile ? (
          <div className="max-w-2xl">
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon size={48} className="text-white" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{profile.username}</h2>
                  <p className="text-slate-500 text-sm mb-6">User Account</p>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={20} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center gap-3 text-slate-700">
                      <Calendar size={20} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Member Since</p>
                        <p className="font-medium">
                          {new Date(profile.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* ID */}
                    <div className="flex items-center gap-3 text-slate-700">
                      <UserIcon size={20} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">User ID</p>
                        <p className="font-medium font-mono">{profile.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium mb-2">Account Status</p>
                <p className="text-2xl font-bold text-slate-800">Active</p>
                <p className="text-xs text-slate-400 mt-3">✓ Verified</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium mb-2">Account Age</p>
                <p className="text-2xl font-bold text-slate-800">
                  {Math.floor(
                    (new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-3">days</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium mb-2">Security</p>
                <p className="text-2xl font-bold text-slate-800">Secure</p>
                <p className="text-xs text-slate-400 mt-3">✓ Protected</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Profile;
