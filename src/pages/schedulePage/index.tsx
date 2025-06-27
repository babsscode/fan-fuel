import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { useAuth } from '../../AuthContext';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';

interface Match {
  utcDate: string;
  homeTeam: string;
  awayTeam: string;
  matchday: number;
}

const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced team matching function
  const normalizeTeamName = (teamName: string): string => {
    return teamName
      .toLowerCase()
      .replace(/\s*(fc|afc|cf|united|city|town|rovers|wanderers|albion)\s*/g, '') // Remove common suffixes
      .replace(/\s+/g, '') // Remove all spaces
      .trim();
  };

  const teamsMatch = (team1: string, team2: string): boolean => {
    const normalized1 = normalizeTeamName(team1);
    const normalized2 = normalizeTeamName(team2);
    
    // Check if either normalized name contains the other
    return normalized1.includes(normalized2) || normalized2.includes(normalized1);
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return null;
      
      try {
        const userDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }
        return userDoc.data();
      } catch (err) {
        console.error('Failed to fetch user preferences:', err);
        setError('Failed to load user preferences. Please check your connection and try again.');
        return null;
      }
    };

    const fetchMatches = async () => {
      try {
        setError(null);
        
        // Fetch user preferences first
        const userData = await fetchUserPreferences();
        console.log(userData)
        if (!userData?.favoriteTeam) {
          setError('No favorite team set. Please update your profile.');
          return;
        }

        const response = await fetch('/schedule.json'); // Updated path
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Match[] = await response.json();
        const favoriteTeam = userData.favoriteTeam;

        // Filter matches using enhanced team matching
        const filtered = data.filter((match) =>
          teamsMatch(match.homeTeam, favoriteTeam) ||
          teamsMatch(match.awayTeam, favoriteTeam)
        );

        setMatches(filtered);

        // Save match progress entries to Firestore with error handling
        for (const match of filtered) {
          try {
            const matchId = `${match.utcDate}_${match.homeTeam}_vs_${match.awayTeam}`.replace(/\W/g, '_');
            const matchDocRef = doc(db, 'users', user!.uid, 'matchProgress', matchId);
            const existing = await getDoc(matchDocRef);
            
            if (!existing.exists()) {
              await setDoc(matchDocRef, {
                percent: 0,
                utcDate: match.utcDate,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                matchday: match.matchday
              });
            }
          } catch (matchErr) {
            console.error(`Failed to save match progress for ${match.homeTeam} vs ${match.awayTeam}:`, matchErr);
            // Continue processing other matches even if one fails
          }
        }
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

  const calculateDaysLeft = (utcDate: string) => {
    const matchDate = new Date(utcDate);
    return Math.max(differenceInDays(matchDate, new Date()), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <p className="text-white">Please log in to view your schedule.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <h1 className="text-white text-3xl font-bold mb-6">Upcoming Matches</h1>

      {matches.length === 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6">
          <p className="text-yellow-300">No matches found for your favorite team.</p>
        </div>
      )}

      <div className="space-y-6">
        {matches.map((match, index) => {
          const daysLeft = calculateDaysLeft(match.utcDate);
          const title = `${match.homeTeam} vs ${match.awayTeam}`;
          return (
            <div
              key={index}
              className="bg-white/10 p-6 rounded-xl border border-white/20 shadow-xl"
            >
              <h2 className="text-xl text-white font-semibold mb-2">{title}</h2>
              <p className="text-gray-300">Matchday {match.matchday}</p>
              <p className="text-cyan-400 font-bold text-lg mt-2">{daysLeft} days left</p>

              <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-4 rounded-full transition-all"
                  style={{ width: `0%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">Progress: 0%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchedulePage;