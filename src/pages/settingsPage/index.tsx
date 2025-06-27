import React, { useState } from 'react';
import { User, LogOut, Save } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [preferredSport, setPreferredSport] = useState('Soccer');
  const [units, setUnits] = useState('Imperial');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Here you would typically save to Firebase/your backend
    // For now, just simulate a save
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-gray-300 mt-1">Manage your profile and preferences</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <User className="mr-2" size={24} />
                Profile Information
              </h2>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-xl font-bold text-white">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {user.displayName || 'User'}
                </h3>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* User Info Display */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300">
                  {user.displayName || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Preferences</h2>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Save size={18} />
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Sport</label>
                <select
                  value={preferredSport}
                  onChange={(e) => setPreferredSport(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="Soccer">Soccer</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Running">Running</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Weightlifting">Weightlifting</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Units of Measurement</label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="Imperial">Imperial (lbs, ft, in)</option>
                  <option value="Metric">Metric (kg, cm, m)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;