import React, {useEffect, useContext } from 'react';
import { PointsContext } from './PointsContext.jsx';
import { FcRating} from "react-icons/fc";
import auth from 'model/firebase';
import {doc , getDoc } from 'firebase/firestore';
import { db } from 'model/firebase'; // Assuming db is your Firestore instance
import Progress from 'components/progress';


const PointsSystem = () => {

  const { totalPoints, expToNextLevel ,setTotalPoints } = useContext(PointsContext);

  // Effect to fetch and update user's points from Firestore
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userDocRef = doc(db, "Users", auth.currentUser?.uid); //user ID from GlobalContext
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
  });

  const progressValue = (totalPoints / expToNextLevel) * 100;
  //color based on progress
  const getColor = () => {
    if (progressValue >= 75) {
      return "green"; // Level up close
    } else if (progressValue >= 50) {
      return "yellow"; // Halfway through
    } else {
      return "red"; // Needs more points
    }
  };

  return (
    <div className=", ml-4 w-[100%]">
      <div>
        <div className="flex-col, flex w-[95%] " style={{ alignItems: 'center', justifyContent: 'space-around' }}>
          <div>
            <FcRating className="mr-1 h-[5vh] w-[100%] " />
          </div>
          <div className="flex h-5 w-full items-center  bg-lightPrimary dark:!bg-navy-700" style={{ height: '4vh',borderRadius: '5px', width: '75%' }}>
            {/* Display the progress bar */}
            <Progress value={progressValue} color={getColor()} width="w-full" />
          </div>
          <div className="flex h-5 w-flex items-center dark:text-white " style={{marginLeft:'5%' }}>
             {totalPoints} / {expToNextLevel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;