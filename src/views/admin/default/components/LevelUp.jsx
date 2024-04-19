import React, { useState, useEffect, useContext } from 'react';
import { PointsContext } from './PointsContext.jsx';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LevelUp = () => {
  const { totalPoints, expToNextLevel, level } = useContext(PointsContext);
    const [alertShown, setAlertShown] = useState(false);


  // Function to trigger the alert (assuming level up logic is in PointsContext)
  const triggerAlert = (level) => {
    toast.success(`Congratulations! You have reached level ${level}!`, {
      position: 'bottom-center',
      autoClose: 7000,
    });
    setAlertShown(true); // Mark alert as shown
  };

  useEffect(() => {
    // Check if level has increased (assuming PointsContext updates level)
    if (level > 1) { // Check if level is greater than 0 to avoid initial trigger
      triggerAlert(level);
    }
  }, [level]);

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer here */}
      {totalPoints >= expToNextLevel ? (
        <div>
          <p>Level: {level}</p>
        </div>
      ) : (
        <div>
          <p>Level: {level}</p>
        </div>
      )}
    </div>  
  );
};

export default LevelUp;
