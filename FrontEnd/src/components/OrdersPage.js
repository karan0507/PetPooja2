import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ORDERS_QUERY = gql`
  query GetOrders {
    orders {
      id
      user {
        username
      }
      items
      total
      status
      createdAt
    }
  }
`;

const OrdersPage = () => {
  const { loading, error, data } = useQuery(GET_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <div className="container mt-5">
      <h2>Manage Orders</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map((order) => (
            <tr key={order.id}>
              <td>{order.user.username}</td>
              <td>{order.items.join(', ')}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
