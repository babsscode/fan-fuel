import React, { useState, useEffect } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { SPORTS_DATA, type League } from '../../utils/userPreferences';
import { ChevronDown, Save, User, Heart } from 'lucide-react';

const PreferencesPage: React.FC = () => {
  const { 
    preferences, 
    loading, 
    error, 
    hasPreferences, 
    updatePreferences 
  } = useUserPreferences();

  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load current preferences into state
  useEffect(() => {
    if (preferences) {
      setSelectedLeague(preferences.favoriteLeague);
      setSelectedTeam(preferences.favoriteTeam);
    }
  }, [preferences]);

  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
    setSelectedTeam(''); // Reset team when league changes
    setShowLeagueDropdown(false);
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setShowTeamDropdown(false);
  };

  const handleUpdatePreferences = async () => {
    if (!selectedLeague || !selectedTeam) {
      return;
    }

    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      await updatePreferences({
        favoriteLeague: selectedLeague,
        favoriteTeam: selectedTeam
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = preferences && (
    preferences.favoriteLeague !== selectedLeague || 
    preferences.favoriteTeam !== selectedTeam
  );

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-white">Loading preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <Heart className="text-cyan-400 mr-3" size={24} />
        <h2 className="text-2xl font-bold text-white">Sports Preferences</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {updateSuccess && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
          Preferences updated successfully!
        </div>
      )}

      {!hasPreferences ? (
        <div className="text-center py-8">
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-300 mb-4">No sports preferences set yet.</p>
          <p className="text-sm text-gray-400">
            Set your favorite league and team to get personalized content!
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Current Preferences:</span>
            <span className="text-sm text-gray-400">
              Last updated: {preferences?.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-semibold">{preferences?.favoriteLeague}</span>
                <span className="text-gray-300 mx-2">•</span>
                <span className="text-white font-medium">{preferences?.favoriteTeam}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* League Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Favorite League
          </label>
          <button
            type="button"
            onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-between"
          >
            <span className={selectedLeague ? 'text-white' : 'text-gray-400'}>
              {selectedLeague || 'Select a league'}
            </span>
            <ChevronDown 
              size={20} 
              className={`transform transition-transform ${showLeagueDropdown ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {showLeagueDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {Object.keys(SPORTS_DATA).map((league) => (
                <button
                  key={league}
                  type="button"
                  onClick={() => handleLeagueSelect(league)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                >
                  {league}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Favorite Team
          </label>
          <button
            type="button"
            onClick={() => selectedLeague && setShowTeamDropdown(!showTeamDropdown)}
            disabled={!selectedLeague}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={selectedTeam ? 'text-white' : 'text-gray-400'}>
              {selectedTeam || (selectedLeague ? 'Select a team' : 'Select a league first')}
            </span>
            <ChevronDown 
              size={20} 
              className={`transform transition-transform ${showTeamDropdown ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {showTeamDropdown && selectedLeague && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {SPORTS_DATA[selectedLeague as League].map((team) => (
                <button
                  key={team}
                  type="button"
                  onClick={() => handleTeamSelect(team)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                >
                  {team}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdatePreferences}
          disabled={!selectedLeague || !selectedTeam || isUpdating || !hasChanges}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Save size={20} className="mr-2" />
          {isUpdating ? 'Updating...' : 'Update Preferences'}
        </button>

        {hasChanges && (
          <p className="text-sm text-yellow-400 text-center">
            You have unsaved changes
          </p>
        )}
      </div>
    </div>
  );
};

export default PreferencesPage;