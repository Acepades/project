import React, { createContext, useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';

// Contexte pour les données et les fonctions du système de points
export const PointsContext = createContext({
  totalPoints: 0,
  expToNextLevel: 100,
  level: 1,
  addPoints: () => {},
  setTotalPoints: () => {},
  resetPoints: () => {},
});

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
  const { user } = useContext(GlobalContext);
  const [totalPoints, setTotalPoints] = useState(user ? user.experience : 0);
  const [expToNextLevel, setExpToNextLevel] = useState(user ? user.req_experience : 100);
  const [level, setLevel] = useState(user ? user.level : 1);

  useEffect(() => {
    if (user) {
      setTotalPoints(user.experience);
      setExpToNextLevel(user.req_experience);
      setLevel(user.level);
    }
  }, [user]);

  const addPoints = async (pointsToAdd) => {
    try {
      let newTotalPoints = totalPoints + pointsToAdd;
      let newExpToNextLevel = expToNextLevel;
      let newLevel = level;

      while (newTotalPoints >= expToNextLevel) {
        newTotalPoints -= expToNextLevel;
        newExpToNextLevel += 100;
        newLevel++;
      }

      // Mettre à jour les données utilisateur dans Firestore
      const userDocRef = doc(db, 'Users', user.uid); // Assurez-vous que user.uid est disponible
      await updateDoc(userDocRef, {
        experience: newTotalPoints,
        req_experience: newExpToNextLevel,
        level: newLevel,
      }); 

      setTotalPoints(newTotalPoints);
      setExpToNextLevel(newExpToNextLevel);
      setLevel(newLevel);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de points :', error);
    }
  };

  const resetPoints = async () => {
    try {
      // Réinitialiser les données utilisateur dans Firestore
      const userDocRef = doc(db, 'Users', user.uid); // Assurez-vous que user.uid est disponible
      await updateDoc(userDocRef, {
        experience: 0,
        req_experience : 100,
        level: 1,
      });

      setTotalPoints(0);
      setExpToNextLevel(100);
      setLevel(1);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des points :', error);
    }
  };

  const value = {
    totalPoints,
    setTotalPoints ,
    expToNextLevel,
    level,
    addPoints,
    resetPoints,
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};
