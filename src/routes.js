import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";


// Icon Imports
import {
  MdHome,
  MdOutlineAdd,
  MdPerson,
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
  }
  
 
];
export default routes;
