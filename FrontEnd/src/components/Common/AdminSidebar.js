import React from 'react';
import { Link } from 'react-router-dom';
import '../Assests/Css/Sidebar.css';

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h4>Admin Dashboard</h4>
      <ul>
        <li><Link to="users">Manage Users</Link></li>
        <li><Link to="contact-messages">Contact Messages</Link></li>
        <li><Link to="orders">Manage Orders</Link></li>
        <li><Link to="add-merchant">Add Merchant</Link></li>
        <li><Link to="products">Manage Products</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
