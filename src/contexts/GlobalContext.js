import React, { useState, useEffect } from 'react';
// Firebase auth functions
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';

// Firestore functions (for user document interaction)
import { getDoc, setDoc, doc, updateDoc } from 'firebase/firestore';

// Firebase auth instance
import firebaseAuth from 'lib/firebase';
// User collection reference
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase'; 
const usersCollectionRef = collection(db, "Users");

// Google oauth provider
const provider = new GoogleAuthProvider();

// Contexts
export const GlobalContext = React.createContext(null);

export const ContextProvider = (props) => {
  // States to check auth status
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(""); // New state for username

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User logged in
        const userDocRef = doc(usersCollectionRef, user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // User document exists, update user state
          onSnapshot(userDocRef, (docSnapshot) => {
            setUser({ ...docSnapshot.data(), uid: user.uid });
          });
        } else {
          // User document doesn't exist, create a new one
          const newUser = {
            level: 1, // Add other default fields as needed
            experience: 0,
            req_experience: 100,
            badges: [],
            username: user.email ? user.email.split('@')[0] : '', // Extract username from email (if available)
          };
          await setDoc(userDocRef, newUser);
          setUser({ ...newUser, uid: user.uid }); // Update user state with initial data
        }
        setIsSignedIn(true);
      } else {
        // User logged out
        setUser(null);
        setUsername("");
        setIsSignedIn(false);
      }
    });

    return unsubscribe;
  }, []);



  // Functions handling auth
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Update username and other fields in Firestore
      const userDocRef = doc(usersCollectionRef, firebaseAuth.currentUser.uid);
      await setDoc(userDocRef);
      // Update username in context
      return;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };

  const signUp = async (email, password) => {
    try {
      const username = email.split('@')[0]; // Extract username before "@"
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Create user document with extracted username and other fields
      const userDocRef = doc(usersCollectionRef, firebaseAuth.currentUser.uid);
      const newUser = {
        level: 1, // Add other default fields as needed
        experience: 0,
        req_experience: 100,
        badges: [],
        username,
      };
      await setDoc(userDocRef, newUser);
      // Update username in context
      setUsername(username);
      return;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      console.log(err.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      // Check if a profile object exists
      if (user.profile) {
        const username = user.profile.name.split(' ')[0]; // Extract first name

        // Update username and other fields in Firestore (if available from profile)
        const userDocRef = doc(usersCollectionRef, user.uid);
        await setDoc(userDocRef, {
          username,
          ...(user.profile.email ? { email: user.profile.email } : {}), // Add email if available
        });
        setUsername(username);
      } else {
        console.log('No profile information available from Google Sign-in.');
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const updateExperience = async (newExperience) => {
    if (!user || !user.uid) {
      console.error('User not found in context.');
      return;
    }

    const userDocRef = doc(usersCollectionRef, user.uid);
    try {
      await updateDoc(userDocRef, { experience: newExperience });
    } catch (err) {
      console.error('Error updating experience:', err.message);
    }
  };

  // Function to add a badge to the user's badges array
  const addBadge = async (badge) => {
    if (!user || !user.uid) {
      console.error('User not found in context.');
      return;
    }

    const userDocRef = doc(usersCollectionRef, user.uid);
    try {
      await updateDoc(userDocRef, { badges: [...user.badges, badge] });
    } catch (err) {
      console.error('Error adding badge:', err.message);
    }
  };
  // Context provider
  return (
    <GlobalContext.Provider
      value={{
        isSignedIn,
        user,
        signIn,
        signUp,
        signOut,
        googleSignIn,
        username,
        setUsername,
        updateExperience,
        addBadge,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};