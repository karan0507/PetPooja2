import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '../Common/UserContext';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
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
        restaurantName
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

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <Container>
      <h2>Order History</h2>
      {data.getOrderHistory.map((order) => (
        <Card key={order.id} className="mb-3">
          <Card.Body>
            <Card.Title>Order ID: {order.id}</Card.Title>
            <Card.Text>Status: {order.status}</Card.Text>
            <Card.Text>Total Amount: ${order.totalAmount}</Card.Text>
            <Card.Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Card.Text>
            <Card.Text>
              Restaurants:
              <ul>
                {order.products.map((product, index) => (
                  <li key={index}>{product.restaurantName}</li>
                ))}
              </ul>
            </Card.Text>
            <Button onClick={() => navigate(`/order/${order.id}`)}>View Details</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default OrderHistory;
