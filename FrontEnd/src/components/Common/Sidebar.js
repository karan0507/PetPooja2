import React from 'react';
import { Link } from 'react-router-dom';
import '../Assests/Css/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      
      <ul>
      <li><Link to="/admin/">Dashboard Home</Link></li>
        <li><Link to="users">Manage Users</Link></li>
        <li><Link to="contact-messages">Contact Messages</Link></li>
        <li><Link to="orders">Manage Orders</Link></li>
        <li><Link to="add-merchant">Add Merchant</Link></li>
        <li><Link to="products">Manage Products</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
