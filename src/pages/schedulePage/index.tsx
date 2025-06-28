import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, Target, TrendingUp, ChevronRight, Star, Home, Plane } from 'lucide-react';
import { getUserPreferences, getMatchProgress, updateMatchProgress } from '../../firebaseOps';
import { useAuth } from '../../AuthContext';

interface Match {
  id: string;
  utcDate: string;
  homeTeam: string;
  awayTeam: string;
  opponent: string;
  matchday: number;
  isHome: boolean;
  progress: number;
  daysLeft: number;
}

const SchedulePage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'home', 'away'

  // Enhanced team matching function
  const normalizeTeamName = (teamName: string) => {
    return teamName
      .toLowerCase()
      .replace(/\s*(fc|afc|cf|united|city|town|rovers|wanderers|albion)\s*/g, '')
      .replace(/\s+/g, '')
      .trim();
  };

  const teamsMatch = (team1: string, team2: string) => {
    const normalized1 = normalizeTeamName(team1);
    const normalized2 = normalizeTeamName(team2);
    return normalized1.includes(normalized2) || normalized2.includes(normalized1);
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return null;
      
      try {
        const userData = await getUserPreferences(user.uid);
        if (!userData?.favoriteTeam) {
          throw new Error('No favorite team set. Please update your profile.');
        }
        return userData;
      } catch (err) {
        console.error('Failed to fetch user preferences:', err);
        setError('Failed to load user preferences. Please check your connection and try again.');
        return null;
      }
    };

    const fetchMatches = async () => {
      try {
        setError(null);
        
        const userData = await fetchUserPreferences();
        if (!userData?.favoriteTeam) return;

        const response = await fetch('/schedule.json');
        const scheduleData = await response.json();

        const favoriteTeam = userData.favoriteTeam;

        // Filter and enhance matches
        const filtered = await Promise.all(
          scheduleData
            .filter((match: { homeTeam: string; awayTeam: string; }) =>
              teamsMatch(match.homeTeam, favoriteTeam) ||
              teamsMatch(match.awayTeam, favoriteTeam)
            )
            .map(async (match: { utcDate: string | number | Date; homeTeam: string; awayTeam: any; matchday: any; }) => {
              const matchId = `${match.utcDate}_${match.homeTeam}_vs_${match.awayTeam}`.replace(/\W/g, '_');
              const isHome = teamsMatch(match.homeTeam, favoriteTeam);
              const opponent = isHome ? match.awayTeam : match.homeTeam;
              
              // Get match progress using real Firebase function
              try {
                let progressData = null;
                if (user) {
                  progressData = await getMatchProgress(user.uid, matchId);
                }
                
                return {
                  id: matchId,
                  utcDate: match.utcDate,
                  homeTeam: match.homeTeam,
                  awayTeam: match.awayTeam,
                  opponent,
                  matchday: match.matchday,
                  isHome,
                  progress: progressData?.percent || 0,
                  daysLeft: Math.max(Math.ceil((new Date(match.utcDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
                };
              } catch (progressError) {
                console.error('Failed to get match progress:', progressError);
                // Return match with 0 progress if Firebase call fails
                return {
                  id: matchId,
                  utcDate: match.utcDate,
                  homeTeam: match.homeTeam,
                  awayTeam: match.awayTeam,
                  opponent,
                  matchday: match.matchday,
                  isHome,
                  progress: 0,
                  daysLeft: Math.max(Math.ceil((new Date(match.utcDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)
                };
              }
            })
        );

        // Sort by date
        filtered.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
        setMatches(filtered);

      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load matches. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'home') return match.isHome;
    if (selectedFilter === 'away') return !match.isHome;
    return true;
  });

  const upcomingMatches = filteredMatches.filter(match => match.daysLeft > 0);
  const completedMatches = filteredMatches.filter(match => match.daysLeft === 0);

  const formatDate = (utcDate: string | number | Date) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (utcDate: string | number | Date) => {
    const date = new Date(utcDate);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 60) return 'from-yellow-500 to-orange-500';
    if (progress >= 40) return 'from-blue-500 to-cyan-500';
    return 'from-red-500 to-pink-500';
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return 'from-red-500/20 to-orange-500/20 border-red-400/30';
    if (daysLeft <= 7) return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
    return 'from-blue-500/20 to-purple-500/20 border-blue-400/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white text-lg">Loading your matches...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-white">Please log in to view your schedule.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Match Schedule</h1>
              <p className="text-gray-300">Track your training progress for upcoming matches</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{upcomingMatches.length}</div>
                <div className="text-xs text-gray-400">UPCOMING</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(upcomingMatches.reduce((acc, match) => acc + match.progress, 0) / upcomingMatches.length || 0)}%
                </div>
                <div className="text-xs text-gray-400">AVG PROGRESS</div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Matches', icon: Trophy },
              { key: 'home', label: 'Home', icon: Home },
              { key: 'away', label: 'Away', icon: Plane }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <filter.icon size={16} />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-8 text-center">
            <Calendar className="mx-auto mb-4 text-yellow-400" size={48} />
            <h3 className="text-yellow-300 text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-yellow-200">No matches found for your favorite team with the current filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-cyan-400" size={24} />
                  Upcoming Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className={`bg-gradient-to-br ${getUrgencyColor(match.daysLeft)} backdrop-blur-sm rounded-xl p-6 border hover:scale-105 transition-all duration-300 cursor-pointer group`}
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {match.isHome ? (
                            <Home className="text-green-400" size={20} />
                          ) : (
                            <Plane className="text-blue-400" size={20} />
                          )}
                          <span className="text-sm font-medium text-gray-300">
                            Matchday {match.matchday}
                          </span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          match.daysLeft <= 3 
                            ? 'bg-red-500/20 text-red-300' 
                            : match.daysLeft <= 7 
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {match.daysLeft === 0 ? 'TODAY' : `${match.daysLeft}d`}
                        </div>
                      </div>

                      {/* Opponent */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          {match.isHome ? 'vs' : '@'} {match.opponent}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{formatDate(match.utcDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-400 mt-1">
                          <Clock size={14} />
                          <span>{formatTime(match.utcDate)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Training Progress</span>
                          <span className="text-white font-bold">{Math.round(match.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(match.progress)} transition-all duration-500`}
                            style={{ width: `${match.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:bg-gradient-to-r group-hover:from-cyan-500/20 group-hover:to-purple-500/20">
                        <Target size={16} />
                        <span>View Training</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed/Recent Matches */}
            {completedMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Star className="mr-2 text-yellow-400" size={24} />
                  Recent Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 opacity-75 hover:opacity-100 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {match.isHome ? (
                            <Home className="text-green-400" size={20} />
                          ) : (
                            <Plane className="text-blue-400" size={20} />
                          )}
                          <span className="text-sm font-medium text-gray-400">
                            Matchday {match.matchday}
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-bold">
                          COMPLETED
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-300 mb-1">
                          {match.isHome ? 'vs' : '@'} {match.opponent}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(match.utcDate)}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Final Progress</span>
                          <span className="text-gray-300 font-bold">{Math.round(match.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/30 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(match.progress)} opacity-60`}
                            style={{ width: `${match.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;