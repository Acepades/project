import React, { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext'; // Assuming your context is named GlobalContext
import Card from 'components/card';

const UserInfo = () => {
  const { user, username } = useContext(GlobalContext);

  if (!user) {
    return null; // Return null if user data is not available
  }

  const { level, experience, req_experience } = user;

  // Calculate progress percentage (assuming experience is an integer)
  const progress = Math.floor((experience / req_experience) * 100);

  return (
    <Card>
    <div className="user-info">
      <h2>{username}</h2>
      <p>Level: {level}</p>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p>
        Exp: {experience} / {req_experience} ({progress}%)
      </p>
    </div>
    </Card>
  );
};

export default UserInfo;
