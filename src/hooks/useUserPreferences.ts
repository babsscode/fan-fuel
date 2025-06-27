// hooks/useUserPreferences.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  updateUserPreferences,
  type UserPreferences,
  type UserPreferencesUpdate 
} from '../utils/userPreferences';

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  hasPreferences: boolean;
  savePreferences: (league: string, team: string) => Promise<void>;
  updatePreferences: (updates: UserPreferencesUpdate) => Promise<void>;
  refetchPreferences: () => Promise<void>;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userPrefs = await getUserPreferences(user.uid);
      setPreferences(userPrefs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePrefs = async (league: string, team: string) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      await saveUserPreferences(user.uid, league, team);
      // Refresh preferences after saving
      await fetchPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePrefs = async (updates: UserPreferencesUpdate) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      await updateUserPreferences(user.uid, updates);
      // Refresh preferences after updating
      await fetchPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch preferences when user changes
  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setError(null);
    }
  }, [user]);

  return {
    preferences,
    loading,
    error,
    hasPreferences: preferences !== null,
    savePreferences: savePrefs,
    updatePreferences: updatePrefs,
    refetchPreferences: fetchPreferences
  };
};