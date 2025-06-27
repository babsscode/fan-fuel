import React, { useState, useEffect } from 'react';
import { User, LogOut, Save, ChevronDown } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getFirestore, getDoc, setDoc } from 'firebase/firestore';

const SPORTS_DATA: Record<string, string[]> = {
  'Premier League': [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham',
    'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
    'Nottingham Forest', 'Sheffield United', 'Burnley', 'Luton Town', 'Bournemouth'
  ]
};

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'userPreferences', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedLeague(data.favoriteLeague || '');
          setSelectedTeam(data.favoriteTeam || '');
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('Could not load preferences');
      }
    };

    fetchPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!selectedLeague || !selectedTeam) {
      setError('Please select both a league and team.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await setDoc(doc(db, 'userPreferences', user.uid), {
        favoriteLeague: selectedLeague,
        favoriteTeam: selectedTeam,
        updatedAt: new Date()
      });
      alert('Preferences saved successfully!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          {/* Profile Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <User className="mr-2" size={24} />
                Profile Information
              </h2>
            </div>
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

          {/* Preferences Box */}
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

            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Favorite League</label>
                <select
                  value={selectedLeague}
                  onChange={(e) => {
                    setSelectedLeague(e.target.value);
                    setSelectedTeam('');
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Select a league</option>
                  {Object.keys(SPORTS_DATA).map((league) => (
                    <option key={league} value={league}>
                      {league}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLeague && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Team</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Select a team</option>
                    {SPORTS_DATA[selectedLeague].map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
