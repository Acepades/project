
import badge_5 from 'assets/img/badges/5.png';
import badge_10 from 'assets/img/badges/10.png';
import badge_15 from 'assets/img/badges/15.png';
import React, { useContext } from 'react';
import { GlobalContext } from 'controllers/GlobalContext';

const BadgeGrid = () => {
  const { user } = useContext(GlobalContext);

  const badgeImages = [
    { level: 5, image: badge_5 },
    { level: 10, image: badge_10 },
    { level: 15, image: badge_15 },
  ];

  return (
    <>
    <h2 style={{fontSize: '20px'}} className="font-bold capitalize hover:text-navy-700 dark:text-white" >Achievements</h2>
    <div className="grid grid-cols-3 gap-1">
      {badgeImages.map((badge, index) => (
        <div key={index} style={{ display: "grid", justifyContent: "center" }}>
          {user && user.level >= badge.level && ( // Check for user and level
            <img
              className="rounded-full w-full h-30vh" // Adjust styles if needed
              src={badge.image}
              alt={`Badge ${badge.level}`}
            />
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default BadgeGrid;
