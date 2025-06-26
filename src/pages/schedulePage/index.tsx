import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Target, Trophy, Plus, CheckCircle, AlertCircle, Timer } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [games, setGames] = useState([
    {
      id: 1,
      sport: 'Soccer',
      emoji: '⚽',
      opponent: 'Thunder FC',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '7:00 PM',
      location: 'Central Sports Complex',
      type: 'League Match',
      isHome: true,
      workouts: [
        { id: 1, name: 'Ball Control Drills', completed: true, duration: '30 min' },
        { id: 2, name: 'Sprint Training', completed: true, duration: '45 min' },
        { id: 3, name: 'Shooting Practice', completed: false, duration: '40 min' },
        { id: 4, name: 'Team Tactics', completed: false, duration: '60 min' },
        { id: 5, name: 'Endurance Run', completed: false, duration: '30 min' }
      ]
    },
    {
      id: 2,
      sport: 'Basketball',
      emoji: '🏀',
      opponent: 'City Hoops',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: '6:30 PM',
      location: 'Downtown Arena',
      type: 'Friendly',
      isHome: false,
      workouts: [
        { id: 1, name: 'Free Throw Practice', completed: true, duration: '20 min' },
        { id: 2, name: 'Dribbling Drills', completed: true, duration: '35 min' },
        { id: 3, name: 'Defense Training', completed: true, duration: '45 min' },
        { id: 4, name: 'Scrimmage', completed: false, duration: '60 min' }
      ]
    },
    {
      id: 3,
      sport: 'Tennis',
      emoji: '🎾',
      opponent: 'Maria Rodriguez',
      date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      time: '2:00 PM',
      location: 'Riverside Tennis Club',
      type: 'Tournament',
      isHome: true,
      workouts: [
        { id: 1, name: 'Serve Practice', completed: false, duration: '45 min' },
        { id: 2, name: 'Backhand Drills', completed: false, duration: '30 min' },
        { id: 3, name: 'Footwork Training', completed: false, duration: '40 min' },
        { id: 4, name: 'Match Simulation', completed: false, duration: '90 min' }
      ]
    },
    {
      id: 4,
      sport: 'Swimming',
      emoji: '🏊',
      opponent: 'Aqua Warriors',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      time: '10:00 AM',
      location: 'Olympic Pool Center',
      type: 'Championship',
      isHome: false,
      workouts: [
        { id: 1, name: 'Freestyle Training', completed: false, duration: '60 min' },
        { id: 2, name: 'Butterfly Technique', completed: false, duration: '45 min' },
        { id: 3, name: 'Endurance Laps', completed: false, duration: '75 min' },
        { id: 4, name: 'Start Practice', completed: false, duration: '30 min' },
        { id: 5, name: 'Recovery Swim', completed: false, duration: '20 min' }
      ]
    }
  ]);

  const getTimeUntilGame = (gameDate: Date) => {
    const now = currentTime.getTime();
    const game = gameDate.getTime();
    const diff = game - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const toggleWorkout = (gameId: number, workoutId: number) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          workouts: game.workouts.map(workout => 
            workout.id === workoutId 
              ? { ...workout, completed: !workout.completed }
              : workout
          )
        };
      }
      return game;
    }));
  };

  const getWorkoutProgress = (workouts: any[]) => {
    const completed = workouts.filter(w => w.completed).length;
    return (completed / workouts.length) * 100;
  };

  const addNewGame = () => {
    const newGame = {
      id: games.length + 1,
      sport: 'New Sport',
      emoji: '🏃',
      opponent: 'TBD',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      time: 'TBD',
      location: 'TBD',
      type: 'Match',
      isHome: true,
      workouts: [
        { id: 1, name: 'Training Session', completed: false, duration: '60 min' }
      ]
    };
    setGames([...games, newGame]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Schedule</h1>
              <p className="text-gray-300 mt-1">Upcoming games and training preparation</p>
            </div>
            <button
              onClick={addNewGame}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
            >
              <Plus size={20} />
              <span>Add Game</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {games.map((game) => {
            const timeUntil = getTimeUntilGame(game.date);
            const workoutProgress = getWorkoutProgress(game.workouts);
            const completedWorkouts = game.workouts.filter(w => w.completed).length;
            const totalWorkouts = game.workouts.length;
            const isUrgent = timeUntil.days <= 3;
            
            return (
              <div
                key={game.id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                  isUrgent ? 'border-orange-400/50 bg-orange-400/5' : 'border-white/20'
                }`}
              >
                {/* Game Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{game.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{game.sport} Match</h3>
                      <p className="text-gray-400">{game.type}</p>
                    </div>
                  </div>
                  {isUrgent && <AlertCircle className="text-orange-400" size={24} />}
                </div>

                {/* Countdown */}
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">{timeUntil.days}</div>
                      <div className="text-xs text-gray-400">DAYS</div>
                    </div>
                    <div className="text-gray-500">:</div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{timeUntil.hours}</div>
                      <div className="text-xs text-gray-400">HOURS</div>
                    </div>
                    <div className="text-gray-500">:</div>
                    <div>
                      <div className="text-2xl font-bold text-pink-400">{timeUntil.minutes}</div>
                      <div className="text-xs text-gray-400">MIN</div>
                    </div>
                    <div className="text-gray-500">:</div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{timeUntil.seconds}</div>
                      <div className="text-xs text-gray-400">SEC</div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-white font-semibold">
                      {timeUntil.days === 0 ? 'Today!' : `${timeUntil.days} days to go!`}
                    </p>
                  </div>
                </div>

                {/* Game Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Users className="text-cyan-400" size={18} />
                    <span className="text-white">vs {game.opponent}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.isHome ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {game.isHome ? 'HOME' : 'AWAY'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="text-purple-400" size={18} />
                    <span className="text-gray-300">{game.date.toLocaleDateString()} at {game.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-pink-400" size={18} />
                    <span className="text-gray-300">{game.location}</span>
                  </div>
                </div>

                {/* Training Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Target className="mr-2" size={20} />
                      Training Progress
                    </h4>
                    <span className="text-sm text-gray-300">
                      {completedWorkouts}/{totalWorkouts} completed
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        workoutProgress === 100 ? 'bg-green-400' : 'bg-gradient-to-r from-cyan-400 to-purple-400'
                      }`}
                      style={{ width: `${workoutProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Workout List */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-300 mb-3">Pre-Match Workouts</h5>
                  {game.workouts.map((workout) => (
                    <div
                      key={workout.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        workout.completed 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleWorkout(game.id, workout.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            workout.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-400 hover:border-cyan-400'
                          }`}
                        >
                          {workout.completed && <CheckCircle size={16} />}
                        </button>
                        <div>
                          <span className={`font-medium ${
                            workout.completed ? 'text-green-400 line-through' : 'text-white'
                          }`}>
                            {workout.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-400">{workout.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Readiness Indicator */}
                <div className="mt-6 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Match Readiness</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        workoutProgress >= 80 ? 'bg-green-400' :
                        workoutProgress >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span className={`text-sm font-semibold ${
                        workoutProgress >= 80 ? 'text-green-400' :
                        workoutProgress >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {workoutProgress >= 80 ? 'Ready' :
                         workoutProgress >= 50 ? 'Good' : 'Needs Work'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {games.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="mx-auto text-gray-500 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No upcoming games</h3>
            <p className="text-gray-500 mb-6">Add your first game to start tracking your training progress</p>
            <button
              onClick={addNewGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Schedule Your First Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;