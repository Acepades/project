
import React, { useContext, useEffect, useState } from "react";
import avatar from "assets/img/avatars/avatar9.png";
import avatarr from "assets/img/avatars/avatarSimmmple.png";
import Card from "components/card";
import { GlobalContext } from 'controllers/GlobalContext';
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "model/firebase"; // Import Firestore instance

import PointsSystem from "views/admin/default/components/PointsSystem";

const Banner = () => {
  const { user } = useContext(GlobalContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid); // Use user's uid
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username || ""); // Use username if available
        }
      }
    };

    fetchUsername();
  }, [user]); // Run effect only when user changes

  if (!user) {
    return null; // Return null if user data is not available
  }

  const { level } = user;

  // Calculate progress percentage (assuming experience is an integer)

  return (
    <>

    <div style={{ display: "flex", justifyContent: "center"  }}>
      <Card  extra={"w-[100%] h-full p-[2%] bg-cover flex mt-2" }>
        {/* Conteneur pour les deux divs */}
        <div
          className="flex h-[35vh]"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* Background and profile */}
          <div
            className="flex w-[33%] items-center justify-center " 
            style={{
              backgroundImage: "none", // Supprimer l'image de fond existante
              borderRadius: '5%',
              background:"linear-gradient(90deg, rgba(56,68,244,1) 0%, rgba(56,78,244,1) 39%, rgba(184,0,255,1) 100%)",
            }}
          >
            <div>
              <img
                className="  rounded-full "
                src={avatar}
                alt=""
                style={{width: '100%', height:'30vh', border:'5px solid gray '}}
              />
            </div>
          </div>

          {/* Name and position */}
          <div className="w-[66%]" style={{ padding: "0% 0% 0% 2%" }}>
            <div style={{ justifyContent: "space-between" }}>
              <Card  extra={"w-[100%] h-full p-[2%] bg-cover  bg-gray-100 "}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className=", mt-1 w-[15%] ">
                    <img
                      className="h-[100%] w-[100%] rounded-full"
                      src={avatarr}
                      alt=""
                    />
                  </div>
                  <div className="w-[90%] ml-5">
                  <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {username}
                  </h4>
                  <p className="text-base font-normal text-gray-600">
                    Full Stack Developer
                  </p>
                  <p>Level {level}</p>
                  <p className="text-base font-normal text-gray-600">InviteID : {user.uid}</p>
                  </div>
                </div>
              </Card>

              <div className=", ml-4 w-[100%]">
               <div  style={{
                    marginTop: "10%", marginLeft:'1%'}}>
               <div
                  className="grid grid-cols-1"
                  style={{

                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                ><PointsSystem/>
                </div>
               </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    </>
  );
};

export default Banner;