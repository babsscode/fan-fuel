import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

const SPORTS_DATA = {
  'Premier League': [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham',
    'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
    'Nottingham Forest', 'Sheffield United', 'Burnley', 'Luton Town', 'Bournemouth'
  ],
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const { user, login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
    setSelectedTeam('');
    setShowLeagueDropdown(false);
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setShowTeamDropdown(false);
  };

  const saveSportsPreferences = async (userId: string, league: string, team: string) => {
    const db = getFirestore();
    const userRef = doc(db, 'userPreferences', userId);
    try {
      await setDoc(userRef, {
        favoriteLeague: league,
        favoriteTeam: team,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Could not save preferences');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isRegisterMode && (!selectedLeague || !selectedTeam)) {
      setError('Please select a league and your favorite eam');
      setIsLoading(false);
      return;
    }

    try {
      if (isRegisterMode) {
        const userData = await register(email, password, displayName);
        if (userData?.uid && selectedLeague && selectedTeam) {
          await saveSportsPreferences(userData.uid, selectedLeague, selectedTeam);
        }
      } else {
        await login(email, password);
      }

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      await resetPassword(email);
      alert('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              FITZONE
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-300">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                Send Reset Email
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            FITZONE
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-300">
            {isRegisterMode ? 'Join us and start your fitness journey' : 'Sign in to continue your fitness journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Enter your full name (optional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sports League <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left flex items-center justify-between"
                >
                  <span>{selectedLeague || 'Select a league'}</span>
                  <ChevronDown size={20} className={`transform ${showLeagueDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLeagueDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg max-h-40 overflow-y-auto">
                    {Object.keys(SPORTS_DATA).map((league) => (
                      <button
                        key={league}
                        type="button"
                        onClick={() => handleLeagueSelect(league)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                      >
                        {league}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Favorite Team <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => selectedLeague && setShowTeamDropdown(!showTeamDropdown)}
                  disabled={!selectedLeague}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left flex items-center justify-between disabled:opacity-50"
                >
                  <span>{selectedTeam || 'Select a team'}</span>
                  <ChevronDown size={20} className={`transform ${showTeamDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showTeamDropdown && selectedLeague && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg max-h-40 overflow-y-auto">
                    {SPORTS_DATA[selectedLeague as keyof typeof SPORTS_DATA].map((team) => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => handleTeamSelect(team)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setSelectedLeague('');
                setSelectedTeam('');
                setError('');
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>

            {!isRegisterMode && (
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="block w-full text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
