import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ORDERS_QUERY = gql`
  query GetOrders {
    orders {
      id
      items
      total
      status
    }
  }
`;

const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;

const ManageDeliveries = () => {
  const { loading, error, data } = useQuery(GET_ORDERS_QUERY);
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleUpdateStatus = (orderId, status) => {
    updateOrderStatus({ variables: { orderId, status } });
  };

  return (
    <div className="container mt-5">
      <h2>Manage Deliveries</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map((order) => (
            <tr key={order.id}>
              <td>{order.items.join(', ')}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(order.id, 'Preparing')} className="btn btn-sm btn-warning">
                  Preparing
                </button>
                <button onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')} className="btn btn-sm btn-primary">
                  Out for Delivery
                </button>
                <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="btn btn-sm btn-success">
                  Delivered
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDeliveries;
