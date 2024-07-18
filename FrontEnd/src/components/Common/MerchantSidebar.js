import React from 'react';
import { Link } from 'react-router-dom';
import '../Assests/Css/Sidebar.css';

const MerchantSidebar = () => {
  return (
    <div className="sidebar">
      <h4>Merchant Dashboard</h4>
      <ul>
        <li><Link to="/merchant/manage-products">Manage Products</Link></li>
        <li><Link to="/merchant/manage-orders">Manage Orders</Link></li>
        <li><Link to="/merchant/manage-deliveries">Manage Deliveries</Link></li>
      </ul>
    </div>
  );
};

export default MerchantSidebar;
