// utils/userPreferences.ts
import { doc, getDoc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';

export interface UserPreferences {
  favoriteLeague: string;
  favoriteTeam: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferencesUpdate {
  favoriteLeague?: string;
  favoriteTeam?: string;
}

const db = getFirestore();

/**
 * Save user sports preferences to Firebase
 */
export const saveUserPreferences = async (
  userId: string, 
  league: string, 
  team: string
): Promise<void> => {
  try {
    const userPrefsRef = doc(db, 'userPreferences', userId);
    
    await setDoc(userPrefsRef, {
      favoriteLeague: league,
      favoriteTeam: team,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw new Error('Failed to save preferences');
  }
};

/**
 * Update existing user preferences
 */
export const updateUserPreferences = async (
  userId: string,
  updates: UserPreferencesUpdate
): Promise<void> => {
  try {
    const userPrefsRef = doc(db, 'userPreferences', userId);
    
    await updateDoc(userPrefsRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw new Error('Failed to update preferences');
  }
};

/**
 * Get user preferences from Firebase
 */
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const userPrefsRef = doc(db, 'userPreferences', userId);
    const docSnap = await getDoc(userPrefsRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        favoriteLeague: data.favoriteLeague,
        favoriteTeam: data.favoriteTeam,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw new Error('Failed to get preferences');
  }
};

/**
 * Check if user has set their preferences
 */
export const hasUserPreferences = async (userId: string): Promise<boolean> => {
  try {
    const preferences = await getUserPreferences(userId);
    return preferences !== null;
  } catch (error) {
    console.error('Error checking user preferences:', error);
    return false;
  }
};

/**
 * Delete user preferences (useful for account deletion)
 */
export const deleteUserPreferences = async (userId: string): Promise<void> => {
  try {
    const userPrefsRef = doc(db, 'userPreferences', userId);
    await setDoc(userPrefsRef, {}, { merge: false }); // This effectively deletes the document
  } catch (error) {
    console.error('Error deleting user preferences:', error);
    throw new Error('Failed to delete preferences');
  }
};

// Sports data - you can move this to a separate constants file if needed
export const SPORTS_DATA = {
  'Premier League': [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham',
    'Crystal Palace', 'Fulham', 'Wolves', 'Everton', 'Brentford',
    'Nottingham Forest', 'Sheffield United', 'Burnley', 'Luton Town', 'Bournemouth'
  ],
  'NFL': [
    'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
    'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
    'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
    'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
    'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
    'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
    'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
    'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
  ],
} as const;

export type League = keyof typeof SPORTS_DATA;
export type Team<T extends League> = typeof SPORTS_DATA[T][number];