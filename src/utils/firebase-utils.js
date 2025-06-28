// firebase-utils.js
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase-config'; // Adjust import path as needed

// ===== WORKOUT MANAGEMENT =====

/**
 * Add a new workout to a specific match
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {Object} workoutData - Workout data
 * @returns {Promise<string>} - New workout ID
 */
export const addWorkout = async (userId, matchId, workoutData) => {
  try {
    const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workoutRef = doc(db, 'users', userId, 'matchProgress', matchId, 'workouts', workoutId);
    
    const fullWorkoutData = {
      ...workoutData,
      id: workoutId,
      matchId,
      completedReps: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(workoutRef, fullWorkoutData);
    console.log('Workout added successfully:', workoutId);
    return workoutId;
  } catch (error) {
    console.error('Error adding workout:', error);
    throw error;
  }
};

/**
 * Get all workouts for a specific match
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @returns {Promise<Array>} - Array of workouts
 */
export const getWorkouts = async (userId, matchId) => {
  try {
    const workoutsRef = collection(db, 'users', userId, 'matchProgress', matchId, 'workouts');
    const workoutsQuery = query(workoutsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(workoutsQuery);
    
    const workouts = [];
    snapshot.forEach(doc => {
      workouts.push({ id: doc.id, ...doc.data() });
    });
    
    return workouts;
  } catch (error) {
    console.error('Error getting workouts:', error);
    throw error;
  }
};

/**
 * Update a specific workout
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {string} workoutId - Workout ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateWorkout = async (userId, matchId, workoutId, updates) => {
  try {
    const workoutRef = doc(db, 'users', userId, 'matchProgress', matchId, 'workouts', workoutId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(workoutRef, updateData);
    console.log('Workout updated successfully:', workoutId);
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Delete a specific workout
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {string} workoutId - Workout ID
 * @returns {Promise<void>}
 */
export const deleteWorkout = async (userId, matchId, workoutId) => {
  try {
    const workoutRef = doc(db, 'users', userId, 'matchProgress', matchId, 'workouts', workoutId);
    await deleteDoc(workoutRef);
    console.log('Workout deleted successfully:', workoutId);
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// ===== MATCH MANAGEMENT =====

/**
 * Create or update match progress document
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {Object} matchData - Match data
 * @returns {Promise<void>}
 */
export const createOrUpdateMatch = async (userId, matchId, matchData) => {
  try {
    const matchRef = doc(db, 'users', userId, 'matchProgress', matchId);
    const existingMatch = await getDoc(matchRef);
    
    if (!existingMatch.exists()) {
      await setDoc(matchRef, {
        ...matchData,
        id: matchId,
        percent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(matchRef, {
        ...matchData,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Match created/updated successfully:', matchId);
  } catch (error) {
    console.error('Error creating/updating match:', error);
    throw error;
  }
};

/**
 * Get match progress
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @returns {Promise<Object|null>} - Match progress data
 */
export const getMatchProgress = async (userId, matchId) => {
  try {
    const matchRef = doc(db, 'users', userId, 'matchProgress', matchId);
    const matchDoc = await getDoc(matchRef);
    
    if (matchDoc.exists()) {
      return { id: matchDoc.id, ...matchDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting match progress:', error);
    throw error;
  }
};

/**
 * Update match progress percentage
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {number} percent - Progress percentage
 * @returns {Promise<void>}
 */
export const updateMatchProgress = async (userId, matchId, percent) => {
  try {
    const matchRef = doc(db, 'users', userId, 'matchProgress', matchId);
    await updateDoc(matchRef, {
      percent: Math.max(0, Math.min(100, percent)), // Ensure 0-100 range
      updatedAt: serverTimestamp()
    });
    console.log('Match progress updated:', matchId, percent);
  } catch (error) {
    console.error('Error updating match progress:', error);
    throw error;
  }
};

/**
 * Calculate and update match progress based on workouts
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @returns {Promise<number>} - Calculated progress percentage
 */
export const calculateAndUpdateMatchProgress = async (userId, matchId) => {
  try {
    const workouts = await getWorkouts(userId, matchId);
    
    if (workouts.length === 0) {
      await updateMatchProgress(userId, matchId, 0);
      return 0;
    }
    
    const totalProgress = workouts.reduce((acc, workout) => {
      const workoutProgress = (workout.completedReps || 0) / (workout.targetReps || 1);
      return acc + Math.min(1, workoutProgress); // Cap at 100% per workout
    }, 0);
    
    const overallProgress = (totalProgress / workouts.length) * 100;
    await updateMatchProgress(userId, matchId, overallProgress);
    
    return overallProgress;
  } catch (error) {
    console.error('Error calculating match progress:', error);
    throw error;
  }
};

/**
 * Get all matches for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of matches
 */
export const getAllMatches = async (userId) => {
  try {
    const matchesRef = collection(db, 'users', userId, 'matchProgress');
    const matchesQuery = query(matchesRef, orderBy('utcDate', 'asc'));
    const snapshot = await getDocs(matchesQuery);
    
    const matches = [];
    snapshot.forEach(doc => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    return matches;
  } catch (error) {
    console.error('Error getting all matches:', error);
    throw error;
  }
};

// ===== USER PREFERENCES =====

/**
 * Get user preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User preferences
 */
export const getUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, 'userPreferences', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<void>}
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'userPreferences', userId);
    await updateDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    });
    console.log('User preferences updated successfully');
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Create initial user preferences
 * @param {string} userId - User ID
 * @param {Object} initialPreferences - Initial preferences
 * @returns {Promise<void>}
 */
export const createUserPreferences = async (userId, initialPreferences = {}) => {
  try {
    const userRef = doc(db, 'userPreferences', userId);
    const defaultPreferences = {
      theme: 'light',
      notifications: true,
      workoutReminders: true,
      favoriteTeams: [],
      ...initialPreferences,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, defaultPreferences);
    console.log('User preferences created successfully');
  } catch (error) {
    console.error('Error creating user preferences:', error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Enhanced team name matching
 * @param {string} teamName - Team name to normalize
 * @returns {string} - Normalized team name
 */
export const normalizeTeamName = (teamName) => {
  if (!teamName) return '';
  
  return teamName
    .toLowerCase()
    .replace(/\s*(fc|afc|cf|united|city|town|rovers|wanderers|albion|athletic|county)\s*/g, '')
    .replace(/\s+/g, '')
    .replace(/[^\w]/g, '') // Remove special characters
    .trim();
};

/**
 * Check if two team names match
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {boolean} - Whether teams match
 */
export const teamsMatch = (team1, team2) => {
  if (!team1 || !team2) return false;
  
  const normalized1 = normalizeTeamName(team1);
  const normalized2 = normalizeTeamName(team2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (for partial matches)
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
};

/**
 * Generate unique match ID from match data
 * @param {Object} matchData - Match data containing teams and date
 * @returns {string} - Unique match ID
 */
export const generateMatchId = (matchData) => {
  const { homeTeam, awayTeam, utcDate } = matchData;
  const dateStr = new Date(utcDate).toISOString().split('T')[0];
  const homeNorm = normalizeTeamName(homeTeam.name);
  const awayNorm = normalizeTeamName(awayTeam.name);
  
  return `${dateStr}_${homeNorm}_vs_${awayNorm}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatMatchDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if a match is upcoming (in the future)
 * @param {string|Date} matchDate - Match date
 * @returns {boolean} - Whether match is upcoming
 */
export const isUpcomingMatch = (matchDate) => {
  return new Date(matchDate) > new Date();
};

/**
 * Get match status based on date and score
 * @param {Object} match - Match object
 * @returns {string} - Match status ('upcoming', 'live', 'finished')
 */
export const getMatchStatus = (match) => {
  const now = new Date();
  const matchDate = new Date(match.utcDate);
  const matchEndTime = new Date(matchDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours after start
  
  if (now < matchDate) return 'upcoming';
  if (now > matchEndTime || match.status === 'FINISHED') return 'finished';
  return 'live';
};

/**
 * Batch update multiple workouts
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @param {Array} workoutUpdates - Array of {workoutId, updates} objects
 * @returns {Promise<void>}
 */
export const batchUpdateWorkouts = async (userId, matchId, workoutUpdates) => {
  try {
    const promises = workoutUpdates.map(({ workoutId, updates }) => 
      updateWorkout(userId, matchId, workoutId, updates)
    );
    
    await Promise.all(promises);
    console.log('Batch workout updates completed');
  } catch (error) {
    console.error('Error in batch workout updates:', error);
    throw error;
  }
};

/**
 * Get workout statistics for a match
 * @param {string} userId - User ID
 * @param {string} matchId - Match ID
 * @returns {Promise<Object>} - Workout statistics
 */
export const getWorkoutStats = async (userId, matchId) => {
  try {
    const workouts = await getWorkouts(userId, matchId);
    
    const stats = {
      totalWorkouts: workouts.length,
      completedWorkouts: workouts.filter(w => w.completedReps >= w.targetReps).length,
      totalTargetReps: workouts.reduce((sum, w) => sum + (w.targetReps || 0), 0),
      totalCompletedReps: workouts.reduce((sum, w) => sum + (w.completedReps || 0), 0),
      averageProgress: 0,
      workoutTypes: {}
    };
    
    if (stats.totalWorkouts > 0) {
      stats.averageProgress = (stats.completedWorkouts / stats.totalWorkouts) * 100;
      
      // Count workout types
      workouts.forEach(workout => {
        const type = workout.type || 'unknown';
        stats.workoutTypes[type] = (stats.workoutTypes[type] || 0) + 1;
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting workout stats:', error);
    throw error;
  }
};

/**
 * Clean up old matches (older than specified days)
 * @param {string} userId - User ID
 * @param {number} daysOld - Number of days (default 30)
 * @returns {Promise<number>} - Number of matches deleted
 */
export const cleanupOldMatches = async (userId, daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const matches = await getAllMatches(userId);
    const oldMatches = matches.filter(match => 
      new Date(match.utcDate) < cutoffDate && 
      getMatchStatus(match) === 'finished'
    );
    
    const deletePromises = oldMatches.map(match => {
      const matchRef = doc(db, 'users', userId, 'matchProgress', match.id);
      return deleteDoc(matchRef);
    });
    
    await Promise.all(deletePromises);
    console.log(`Cleaned up ${oldMatches.length} old matches`);
    
    return oldMatches.length;
  } catch (error) {
    console.error('Error cleaning up old matches:', error);
    throw error;
  }
};