import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
