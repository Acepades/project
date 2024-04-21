/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes.js";


const Sidebar = ({ open, onClose }) => {
  return (
    <div 
      className={`w-[19%] sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-medium  text-[40px] font-bold text-navy-700 dark:text-white">
          Live<span className="font-poppins">UP!</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>


      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;

/*import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";
// Icon Imports
import {
  MdHome,
  MdOutlineAdd,
  MdPerson,
  MdLock,
} from "react-icons/md";

import { IoIosNotifications } from "react-icons/io";
import Notification from "views/admin/default/components/notifications";
import { FcCollaboration } from "react-icons/fc";
import Collaboration from "views/admin/default/components/Collaboration";
import { FiLogOut } from "react-icons/fi";
import TaskComponent from "views/admin/default/components/TaskComponent";

const routes = [
  {
    name: "Home",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Add Task",
    layout: "/admin",
    path: "Add-task",
    icon: <MdOutlineAdd className="h-6 w-6" />,
    component: <TaskComponent />
  },
  {
    name: "Collaboration",
    layout: "/admin",
    path: "Collab",
    icon: <FcCollaboration />,
    component: <Collaboration />
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Notification",
    layout: "/admin",
    path: "Notification",
    icon: <IoIosNotifications className="h-6 w-6" />,
    component: <Notification />,
  },
  {
    name: "Log Out",
    layout: "/auth",
    path: "Log-out",
    icon: <FiLogOut className="h-6 w-6" />,
    navigate: "/auth/sign-in"
  },*/