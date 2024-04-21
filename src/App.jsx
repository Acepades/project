import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
};

export default App;
