import React, { useState } from 'react';
import { Plus, User, Home, TrendingUp, Calendar, Settings, Target, Clock, CheckCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      type: 'Push-ups',
      targetReps: 50,
      completedReps: 35,
      category: 'Strength',
      emoji: '💪',
      timeRemaining: '5 min'
    },
    {
      id: 2,
      type: 'Soccer Drills',
      targetReps: 20,
      completedReps: 15,
      category: 'Cardio',
      emoji: '⚽',
      timeRemaining: '12 min'
    },
    {
      id: 3,
      type: 'Squats',
      targetReps: 30,
      completedReps: 30,
      category: 'Strength',
      emoji: '🏋️',
      timeRemaining: 'Complete!'
    },
    {
      id: 4,
      type: 'Running',
      targetReps: 5,
      completedReps: 3,
      category: 'Cardio',
      emoji: '🏃',
      timeRemaining: '20 min'
    }
  ]);

  const overallProgress = workouts.reduce((acc, workout) => {
    return acc + (workout.completedReps / workout.targetReps);
  }, 0) / workouts.length * 100;

  const addNewWorkout = () => {
    const newWorkout = {
      id: workouts.length + 1,
      type: 'New Workout',
      targetReps: 10,
      completedReps: 0,
      category: 'Custom',
      emoji: '🎯',
      timeRemaining: '-- min'
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const updateWorkoutProgress = (id: number, increment: number) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === id) {
        const newCompleted = Math.max(0, Math.min(workout.targetReps, workout.completedReps + increment));
        return {
          ...workout,
          completedReps: newCompleted,
          timeRemaining: newCompleted === workout.targetReps ? 'Complete!' : workout.timeRemaining
        };
      }
      return workout;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Vertical Progress Bar (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sticky top-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Today's Progress</h2>
                <p className="text-gray-300">Keep pushing your limits!</p>
              </div>
              
              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
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
                    <span className="text-gray-300">Workouts</span>
                  </div>
                  <span className="text-white font-bold">{workouts.filter(w => w.completedReps === w.targetReps).length}/{workouts.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-purple-400" size={20} />
                    <span className="text-gray-300">Time Active</span>
                  </div>
                  <span className="text-white font-bold">45m</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-gray-300">Streak</span>
                  </div>
                  <span className="text-white font-bold">7 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Workout Cards (2/3) */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Today's Workouts</h2>
              <button
                onClick={addNewWorkout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
              >
                <Plus size={20} />
                <span>Add Workout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workouts.map((workout) => {
                const progress = (workout.completedReps / workout.targetReps) * 100;
                const isComplete = workout.completedReps === workout.targetReps;
                
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
                          <h3 className="text-xl font-bold text-white">{workout.type}</h3>
                          <p className="text-sm text-gray-400">{workout.category}</p>
                        </div>
                      </div>
                      {isComplete && <CheckCircle className="text-green-400" size={24} />}
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
                        <span className="text-sm text-gray-400">{workout.timeRemaining}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;