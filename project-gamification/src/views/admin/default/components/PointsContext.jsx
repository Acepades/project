import React, { createContext, useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import { getFirestore, collection, getDoc, query, where, doc, updateDoc, increment } from "firebase/firestore"; // Import Firestore functionsimport { db } from 'lib/firebase';
import { TasksContext } from 'contexts/TasksContext';
import { db } from 'lib/firebase';



// Contexte pour les données et les fonctions du système de points
export const PointsContext = createContext({
  totalPoints: 0,
  expToNextLevel: 100,
  level: 1,
  addPoints: () => {},
  setTotalPoints: () => {},
  resetPoints: () => {},
  addPointsToAllUsers: () => {},

});

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
  const { currentTask } = useContext(TasksContext);
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

  const calculateLevelProgression = (currentExperience, pointsToAdd) => {
    let newTotalPoints = currentExperience + pointsToAdd;
    let newExpToNextLevel = expToNextLevel; // Handle initial level
    let newLevel = level;
    while (newTotalPoints >= expToNextLevel) {
      newTotalPoints -= expToNextLevel;
      newExpToNextLevel += 100;
      newLevel++;
    }
    return { newTotalPoints, newExpToNextLevel, newLevel };
  };

  const addPoints = async (pointsToAdd) => {
    try {
      const { newTotalPoints, newExpToNextLevel, newLevel } = calculateLevelProgression(totalPoints, pointsToAdd);


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

  // Function to add points to all collaborators (including current user)
  const addPointsToAllUsers = async (pointsToAdd, collaboratorId = null) => {
  try {
    if (!collaboratorId) {
      // Update points for current user
      await addPoints(pointsToAdd);
    } else {
      // Update points for specific collaborator
      const collaboratorDocRef = doc(db, 'Users', collaboratorId);
      const collaboratorDoc = await getDoc(collaboratorDocRef);
      if (collaboratorDoc.exists) {
        const currentExperience = collaboratorDoc.data().experience || 0;
        const { newTotalPoints, newExpToNextLevel, newLevel } = calculateLevelProgression(currentExperience, pointsToAdd);

        await updateDoc(collaboratorDocRef, {
          experience: newTotalPoints,
          req_experience: newExpToNextLevel,
          level: newLevel,
        });
      } else {
        console.error(`Collaborator with ID ${collaboratorId} not found`);
      }
    }
  } catch (error) {
    console.error('Error adding points to collaborator:', error);
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
    addPointsToAllUsers ,
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};
