import React from "react";

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
import { FcCollaboration } from "react-icons/fc";
import Collaboration from "views/admin/collaboration";
import { FiLogOut } from "react-icons/fi";
import TaskComponent from "views/admin/addTask/TaskComponent";
import Notificationz from "views/admin/Notification";

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
    component: <Notificationz />,
  },
  {
    name: "Log Out",
    layout: "/auth",
    path: "Log-out",
    icon: <FiLogOut className="h-6 w-6" />,
    component: <SignIn /> ,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
  
 
];
export default routes;
