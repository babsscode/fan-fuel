// src/firebaseOps.ts
import { db } from './firebase-config';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc
} from 'firebase/firestore';

// Get user preferences
export const getUserPreferences = async (userId: string) => {
  const userRef = doc(db, 'userPreferences', userId);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return snapshot.data();
};

// Helper to ensure matchProgress doc exists
const ensureMatchProgressDocExists = async (userId: string, matchId: string) => {
  const matchRef = doc(db, 'users', userId, 'matchProgress', matchId);
  const snapshot = await getDoc(matchRef);

  if (!snapshot.exists()) {
    await setDoc(matchRef, {
      percent: 0,
      createdAt: new Date().toISOString()
    });
  }
};

// Updated addWorkout with fix
export const addWorkout = async (userId: string, matchId: string, workout: any) => {
  await ensureMatchProgressDocExists(userId, matchId); // 🛠 Fix here

  const ref = collection(db, 'users', userId, 'matchProgress', matchId, 'workouts');
  const docRef = await addDoc(ref, {
    ...workout,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id };
};


// ✅ Update workout
export const updateWorkout = async (userId: string, matchId: string, workoutId: string, updates: any) => {
  const ref = doc(db, 'users', userId, 'matchProgress', matchId, 'workouts', workoutId);
  await updateDoc(ref, updates);
};

// ✅ Delete workout
export const deleteWorkout = async (userId: string, matchId: string, workoutId: string) => {
  const ref = doc(db, 'users', userId, 'matchProgress', matchId, 'workouts', workoutId);
  await deleteDoc(ref);
};

// ✅ Get workouts for a specific match
export const getWorkoutsForMatch = async (userId: string, matchId: string) => {
  const ref = collection(db, 'users', userId, 'matchProgress', matchId, 'workouts');
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};




// Get match progress: users/{userId}/matchProgress/{matchId}/percent
export const getMatchProgress = async (userId: string, matchId: string) => {
  const ref = doc(db, 'users', userId, 'matchProgress', matchId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return { percent: 0 };
  return snapshot.data();
};

// Update match progress
export const updateMatchProgress = async (userId: string, matchId: string, progress: { percent: number }) => {
  const ref = doc(db, 'users', userId, 'matchProgress', matchId);
  await updateDoc(ref, progress);
};
