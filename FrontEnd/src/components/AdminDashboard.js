import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="list-group">
        <Link to="/admin/users" className="list-group-item list-group-item-action">Manage Users</Link>
        <Link to="/admin/contact-messages" className="list-group-item list-group-item-action">Contact Messages</Link>
        <Link to="/admin/orders" className="list-group-item list-group-item-action">Manage Orders</Link>
        <Link to="/admin/add-merchant" className="list-group-item list-group-item-action">Add Merchant</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
