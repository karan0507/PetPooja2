import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '../Common/UserContext';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GET_ORDER_HISTORY = gql`
  query GetOrderHistory($customerId: ID!) {
    getOrderHistory(customerId: $customerId) {
      id
      status
      totalAmount
      createdAt
      products {
        name
        price
        quantity
      }
    }
  }
`;

const OrderHistory = () => {
  const { user } = useUser();
  const { loading, error, data } = useQuery(GET_ORDER_HISTORY, {
    variables: { customerId: user.id }
  });
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <h2>Order History</h2>
      {data.getOrderHistory.map((order) => (
        <Card key={order.id} className="mb-3">
          <Card.Body>
            <Card.Title>Order ID: {order.id}</Card.Title>
            <Card.Text>Status: {order.status}</Card.Text>
            <Card.Text>Total Amount: ${order.totalAmount}</Card.Text>
            <Card.Text>
              Date: {new Date(parseInt(order.createdAt)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Card.Text>
            <Button onClick={() => navigate(`/order/${order.id}`)}>View Details</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default OrderHistory;
