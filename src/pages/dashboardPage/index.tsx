import React, { useState, useEffect } from 'react';
import { Plus, User, Home, TrendingUp, Calendar, Settings, Target, Clock, CheckCircle, ChevronDown, Edit2, Trash2, X, Save } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import {
  getUserPreferences,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutsForMatch,
  updateMatchProgress  // Add this import
} from '../../firebaseOps';

// --- Types ---
type Match = {
  id: string;
  opponent: string;
  userTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  rawDate: string;
  matchDisplayName: string;
};

type Workout = {
  id: string;
  type: string;
  targetReps: number;
  completedReps: number;
  category: string;
  emoji: string;
  estimatedTime: number;
  matchId: string;
  createdAt: string;
};

// --- Options ---
const categoryOptions = ['Technical', 'Tactical', 'Physical', 'Mental'];
const emojiOptions = ['⚽', '🏃‍♂️', '💪', '🧠', '🥅', '🥇', '🔥', '🎯'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id' | 'completedReps' | 'matchId' | 'createdAt'>>({
    type: '',
    targetReps: 10,
    category: 'Technical',
    emoji: '⚽',
    estimatedTime: 15
  });

  // --- Helpers ---
  const normalizeTeamName = (teamName: string) => {
    const normalized = teamName.toLowerCase().replace(/\s*(fc|afc|cf|united|city|town|rovers|wanderers|albion)\s*/g, '').replace(/\s+/g, '').trim();
    console.log(`🔄 Normalized "${teamName}" to "${normalized}"`);
    return normalized;
  };

  const teamsMatch = (team1: string, team2: string) => {
    const normalized1 = normalizeTeamName(team1);
    const normalized2 = normalizeTeamName(team2);
    const matches = normalized1.includes(normalized2) || normalized2.includes(normalized1);
    console.log(`🏟️ Teams match check: "${team1}" vs "${team2}" = ${matches}`);
    return matches;
  };

  // --- Calculate progress helper ---
  const calculateMatchProgress = (matchWorkouts: Workout[]) => {
    if (matchWorkouts.length === 0) return 0;
    return (matchWorkouts.reduce((acc, w) => acc + (w.completedReps / w.targetReps), 0) / matchWorkouts.length) * 100;
  };

  // --- Data loading ---
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Starting data load...');
        
        if (!user) {
          console.log('❌ No user found');
          return;
        }
        console.log('✅ User found:', user.uid);

        console.log('📋 Fetching user preferences...');
        const userData = await getUserPreferences(user.uid);
        console.log('📋 User data:', userData);
        
        if (!userData?.favoriteTeam) {
          console.log('❌ No favorite team found in user data');
          return;
        }
        console.log('⚽ User favorite team:', userData.favoriteTeam);

        console.log('📅 Fetching schedule data...');
        const response = await fetch('/schedule.json');
        console.log('📅 Schedule response status:', response.status);
        
        if (!response.ok) {
          console.error('❌ Failed to fetch schedule.json:', response.status, response.statusText);
          return;
        }

        const scheduleData = await response.json();
        console.log('📅 Raw schedule data:', scheduleData);
        console.log('📅 Schedule data length:', Array.isArray(scheduleData) ? scheduleData.length : 'Not an array');

        if (!Array.isArray(scheduleData)) {
          console.error('❌ Schedule data is not an array:', typeof scheduleData);
          return;
        }

        // Filter matches using enhanced team matching
        console.log('🔍 Starting match filtering...');
        const userMatches: Match[] = scheduleData
          .filter((match: any) => {
            console.log('🔍 Checking match:', match);
            const homeMatch = teamsMatch(match.homeTeam, userData.favoriteTeam);
            const awayMatch = teamsMatch(match.awayTeam, userData.favoriteTeam);
            const isUserMatch = homeMatch || awayMatch;
            console.log(`🔍 Match result: ${match.homeTeam} vs ${match.awayTeam} = ${isUserMatch}`);
            return isUserMatch;
          })
          .map((match: any) => {
            const isHome = teamsMatch(match.homeTeam, userData.favoriteTeam);
            const userTeam = isHome ? match.homeTeam : match.awayTeam;
            const opponent = isHome ? match.awayTeam : match.homeTeam;
            const matchDisplayName = `${userTeam} vs ${opponent}`;
            
            const mappedMatch = {
              id: `${match.utcDate}_${match.homeTeam}_vs_${match.awayTeam}`.replace(/\W/g, '_'),
              opponent: opponent,
              userTeam: userTeam,
              date: match.utcDate.split('T')[0],
              time: new Date(match.utcDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              venue: isHome ? 'Home Stadium' : 'Away Ground',
              competition: `Matchday ${match.matchday}`,
              rawDate: match.utcDate,
              matchDisplayName: matchDisplayName
            };
            console.log('📋 Mapped match:', mappedMatch);
            return mappedMatch;
          })
          .sort((a: Match, b: Match) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

        console.log('✅ Final filtered matches:', userMatches);
        console.log('✅ Total matches found:', userMatches.length);

        setMatches(userMatches);

        if (userMatches.length > 0) {
          console.log('🎯 Setting selected match:', userMatches[0]);
          setSelectedMatch(userMatches[0]);

          console.log('💪 Loading workouts for match:', userMatches[0].id);
          const workoutsFromDB = await getWorkoutsForMatch(user.uid, userMatches[0].id);
          console.log('💪 Workouts from DB:', workoutsFromDB);
          
          // Ensure each workout has all Workout fields (fallbacks if needed)
          setWorkouts(
            workoutsFromDB.map((w: any) => ({
              id: w.id,
              type: w.type || '',
              targetReps: w.targetReps ?? 10,
              completedReps: w.completedReps ?? 0,
              category: w.category || 'Technical',
              emoji: w.emoji || '⚽',
              estimatedTime: w.estimatedTime ?? 15,
              matchId: w.matchId || userMatches[0].id,
              createdAt: w.createdAt || new Date().toISOString()
            }))
          );
        } else {
          console.log('⚠️ No matches found for user team');
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('❌ Error stack:', error);
      } finally {
        console.log('🏁 Data loading complete');
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!selectedMatch) return;
    const calculateCountdown = () => {
      const matchDateTime = new Date(selectedMatch.rawDate);
      const now = new Date();
      const diff = matchDateTime.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [selectedMatch]);

  // --- Progress calculation ---
  const matchWorkouts = selectedMatch ? workouts.filter(w => w.matchId === selectedMatch.id) : [];
  const overallProgress = calculateMatchProgress(matchWorkouts);

  // --- Workout progress update ---
  const updateWorkoutProgress = async (workoutId: string, delta: number) => {
    if (!user || !selectedMatch) return;
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    const newReps = Math.max(0, Math.min(workout.targetReps, workout.completedReps + delta));
    await handleUpdateWorkout(workoutId, 'completedReps', newReps);
  };

  // --- Handlers ---
  const handleAddWorkout = async () => {
    if (!newWorkout.type.trim() || !selectedMatch || !user) return;

    const workoutData = {
      ...newWorkout,
      completedReps: 0,
      matchId: selectedMatch.id,
      createdAt: new Date().toISOString()
    };

    try {
      const result = await addWorkout(user.uid, selectedMatch.id, workoutData);
      const updatedWorkouts = [...workouts, { ...workoutData, id: result.id }];
      setWorkouts(updatedWorkouts);
      
      // Update match progress in database
      const currentMatchWorkouts = updatedWorkouts.filter(w => w.matchId === selectedMatch.id);
      const newProgress = calculateMatchProgress(currentMatchWorkouts);
      await updateMatchProgress(user.uid, selectedMatch.id, { percent: newProgress });
      
      setNewWorkout({ type: '', targetReps: 10, category: 'Technical', emoji: '⚽', estimatedTime: 15 });
      setShowWorkoutModal(false);
    } catch (err) {
      console.error('Failed to add workout:', err);
    }
  };

  const handleUpdateWorkout = async (workoutId: string, field: keyof Workout, value: any) => {
    if (!user || !selectedMatch) return;
    try {
      await updateWorkout(user.uid, selectedMatch.id, workoutId, { [field]: value });
      const updatedWorkouts = workouts.map(w => (w.id === workoutId ? { ...w, [field]: value } : w));
      setWorkouts(updatedWorkouts);
      
      // Update match progress in database when completedReps changes
      if (field === 'completedReps') {
        const currentMatchWorkouts = updatedWorkouts.filter(w => w.matchId === selectedMatch.id);
        const newProgress = calculateMatchProgress(currentMatchWorkouts);
        await updateMatchProgress(user.uid, selectedMatch.id, { percent: newProgress });
        setEditingWorkout(null);
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!user || !selectedMatch) return;
    if (!window.confirm('Delete this workout?')) return;
    try {
      await deleteWorkout(user.uid, selectedMatch.id, workoutId);
      const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
      setWorkouts(updatedWorkouts);
      
      // Update match progress in database
      const currentMatchWorkouts = updatedWorkouts.filter(w => w.matchId === selectedMatch.id);
      const newProgress = calculateMatchProgress(currentMatchWorkouts);
      await updateMatchProgress(user.uid, selectedMatch.id, { percent: newProgress });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleMatchSelect = async (match: Match) => {
    if (!user) return;
    console.log('🎯 Selecting match:', match);
    setSelectedMatch(match);
    setIsDropdownOpen(false);
    const loaded = await getWorkoutsForMatch(user.uid, match.id);
    setWorkouts(
      loaded.map((w: any) => ({
        id: w.id,
        type: w.type || '',
        targetReps: w.targetReps ?? 10,
        completedReps: w.completedReps ?? 0,
        category: w.category || 'Technical',
        emoji: w.emoji || '⚽',
        estimatedTime: w.estimatedTime ?? 15,
        matchId: w.matchId || match.id,
        createdAt: w.createdAt || new Date().toISOString()
      }))
    );
  };

  // Debug render info
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Next Match & Progress */}
          <div className="lg:w-1/3 space-y-6">
            {/* Next Match - Moved to top for urgency */}
            {selectedMatch && (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30">
                <div className="text-center mb-6">
                  <div className="text-red-400 text-sm font-semibold mb-2">⚠️ MATCH UPCOMING</div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedMatch.matchDisplayName}</h3>
                  <p className="text-gray-300 text-sm">{selectedMatch.date} at {selectedMatch.time}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-400">{countdown.days}</div>
                    <div className="text-xs text-gray-400">DAYS</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-400">{countdown.hours}</div>
                    <div className="text-xs text-gray-400">HOURS</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-400">{countdown.minutes}</div>
                    <div className="text-xs text-gray-400">MINS</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">{countdown.seconds}</div>
                    <div className="text-xs text-gray-400">SECS</div>
                  </div>
                </div>
                
              </div>
            )}

            {/* Match Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Luck Meter 🍀</h2>
                <p className="text-gray-300">Training for your next match!</p>
              </div>
              
              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                    <circle
                      cx="50" cy="50" r="40" stroke="url(#gradient)" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="text-cyan-400" size={20} />
                    <span className="text-gray-300">Exercises</span>
                  </div>
                  <span className="text-white font-bold">
                    {matchWorkouts.filter(w => w.completedReps === w.targetReps).length}/{matchWorkouts.length}
                  </span>
                </div> 
              </div>
            </div>
          </div>

          {/* Right Side - Match Selection & Training */}
          <div className="lg:w-2/3">
            {/* Match Selection Dropdown */}
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-cyan-400/50 transition-colors flex items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      {selectedMatch ? selectedMatch.matchDisplayName : 'Select Match'}
                    </h3>
                    {selectedMatch && (
                      <p className="text-gray-300 text-sm">{selectedMatch.date} • {selectedMatch.competition}</p>
                    )}
                  </div>
                  <ChevronDown className={`text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                    {matches.map((match) => (
                      <button
                        key={match.id}
                        onClick={() => handleMatchSelect(match)}
                        className={`w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                          selectedMatch?.id === match.id ? 'bg-white/5' : ''
                        }`}
                      >
                        <h4 className="text-white font-semibold">{match.matchDisplayName}</h4>
                        <p className="text-gray-300 text-sm">{match.date} • {match.competition}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Training Drills Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Fitness Goals</h2>
              <button
                onClick={() => setShowWorkoutModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
              >
                <Plus size={20} />
                <span>Add Drill</span>
              </button>
            </div>

            {/* Training Drills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchWorkouts.map((workout) => {
                const progress = (workout.completedReps / workout.targetReps) * 100;
                const isComplete = workout.completedReps === workout.targetReps;
                const isEditing = editingWorkout === workout.id;
                
                return (
                  <div
                    key={workout.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      isComplete ? 'border-green-400/50 bg-green-400/10' : 'border-white/20 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{workout.emoji}</span>
                        <div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={workout.type}
                              onChange={(e) => handleUpdateWorkout(workout.id, 'type', e.target.value)}
                              className="bg-white/10 text-white text-xl font-bold rounded px-2 py-1 border border-white/20"
                              onBlur={() => setEditingWorkout(null)}
                              onKeyPress={(e) => e.key === 'Enter' && setEditingWorkout(null)}
                              autoFocus
                            />
                          ) : (
                            <h3 
                              className="text-xl font-bold text-white cursor-pointer hover:text-cyan-400"
                              onClick={() => setEditingWorkout(workout.id)}
                            >
                              {workout.type}
                            </h3>
                          )}
                          <p className="text-sm text-gray-400">{workout.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isComplete && <CheckCircle className="text-green-400" size={24} />}
                        <button
                          onClick={() => setEditingWorkout(workout.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white font-bold">{workout.completedReps}/{workout.targetReps}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-green-400' : 'bg-gradient-to-r from-cyan-400 to-purple-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-400">{workout.estimatedTime || 15} min</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateWorkoutProgress(workout.id, -1)}
                          className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                          disabled={workout.completedReps === 0}
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateWorkoutProgress(workout.id, 1)}
                          className="w-8 h-8 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors"
                          disabled={isComplete}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {matchWorkouts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No training drills for this match yet</p>
                <button
                  onClick={() => setShowWorkoutModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                >
                  Create Your First Drill
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Drill</h3>
              <button
                onClick={() => setShowWorkoutModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Drill Name</label>
                <input
                  type="text"
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                  className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., Ball Control Drills"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Target Reps</label>
                  <input
                    type="number"
                    value={newWorkout.targetReps}
                    onChange={(e) => setNewWorkout({...newWorkout, targetReps: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-cyan-400 focus:outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Time (min)</label>
                  <input
                    type="number"
                    value={newWorkout.estimatedTime}
                    onChange={(e) => setNewWorkout({...newWorkout, estimatedTime: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-cyan-400 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Category</label>
                <select
                  value={newWorkout.category}
                  onChange={(e) => setNewWorkout({...newWorkout, category: e.target.value})}
                  className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-cyan-400 focus:outline-none"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewWorkout({...newWorkout, emoji})}
                      className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-colors ${
                        newWorkout.emoji === emoji ? 'bg-cyan-500' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWorkoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWorkout}
                disabled={!newWorkout.type.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                Add Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;