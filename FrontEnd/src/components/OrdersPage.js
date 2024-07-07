import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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

const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const OrdersPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ORDERS_QUERY);
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus({ variables: { id, status } });
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

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
            <th>Actions</th>
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
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                >
                  Delivered
                </button>
                <button
                  className="btn btn-warning ml-2"
                  onClick={() => handleStatusUpdate(order.id, 'Out for Delivery')}
                >
                  Out for Delivery
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
