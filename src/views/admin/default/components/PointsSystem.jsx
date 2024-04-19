import React, { useState, useEffect, useContext } from 'react';
import { PointsContext } from './PointsContext.jsx';
import { FcRating, FcRatings } from "react-icons/fc";
import auth from 'lib/firebase';
import { Timestamp , doc , getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase'; // Assuming db is your Firestore instance


const PointsSystem = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    exp_to_gain: 1,
    isComplete: false,
    subtasks: {}, // Map to store subtasks with completion state
    createdBy: auth.currentUser?.uid,
    createdAt: Timestamp.now(), 
    isCollab: false,
    collaborators: [],
  });

  const { totalPoints, expToNextLevel ,setTotalPoints } = useContext(PointsContext);

  // Effect to fetch and update user's points from Firestore on component mount
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userDocRef = doc(db, "Users", auth.currentUser?.uid); // Use user ID from GlobalContext
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userPoints = docSnap.data().experience;
          setTotalPoints(userPoints); // Update local state with Firestore value
        }
      } catch (err) {
        console.error('Error fetching user points from Firestore:', err);
      }
    };

    fetchUserPoints();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    // You can potentially use taskData for other purposes within PointsSystem
  }, [taskData]); // Dependency on taskData for potential internal usage

  return (
    <div className=", ml-4 w-[90%]">
      <div style={{ marginTop: '5%', marginLeft: '10%' }}>
        <div className="flex-col, flex w-[100%] " style={{ alignItems: 'center', justifyContent: 'space-around' }}>
          <div>
            <FcRating className="mr-1 h-[5vh] w-[100%] " />
          </div>
          <div
            className=" flex h-5 w-full items-center rounded-lg bg-lightPrimary dark:!bg-navy-700 "
            style={{ height: '4vh', width: '75%' }}
          >
            <span
              className="h-full w-2/5 rounded-lg  dark:!bg-white"
              style={{ height: '4vh', backgroundColor: '#3844F4' }}
            />
          </div>
          <div className="w-[15%]">{totalPoints} / {expToNextLevel}</div>
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;
