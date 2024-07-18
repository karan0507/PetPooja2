import React from 'react';
import { Outlet } from 'react-router-dom';
import MerchantSidebar from '../Common/MerchantSidebar';

const MerchantDashboard = () => {
  return (
    <div className="merchant-dashboard">
      <MerchantSidebar />
      <div className="merchant-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MerchantDashboard;
