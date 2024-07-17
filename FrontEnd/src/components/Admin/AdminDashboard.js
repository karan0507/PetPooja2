import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import '../Assests/Css/AdminDashboard.css';

const GET_COUNTS = gql`
  query GetCounts {
    userCount
    adminCount
    merchantCount
    customerCount
  }
`;

const AdminDashboard = () => {
  const location = useLocation();
  const { loading, error, data } = useQuery(GET_COUNTS);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (data) {
      setCounts(data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar />
      <div className="admin-content container mt-5">
        {location.pathname === '/admin/' && (
          <>
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            <div className="d-flex justify-content-center mb-4">
              <div className="p-3 bg-primary text-white rounded">
                <h2>Total Users: {counts.userCount}</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="card text-center hover-effect bg-info text-white">
                  <div className="card-body">
                    <i className="bi bi-person-badge" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mt-2">Admins</h5>
                    <p className="card-text">{counts.adminCount}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center hover-effect bg-success text-white">
                  <div className="card-body">
                    <i className="bi bi-shop" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mt-2">Merchants</h5>
                    <p className="card-text">{counts.merchantCount}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center hover-effect bg-warning text-white">
                  <div className="card-body">
                    <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mt-2">Customers</h5>
                    <p className="card-text">{counts.customerCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
