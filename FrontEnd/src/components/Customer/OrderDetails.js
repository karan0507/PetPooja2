import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup } from 'react-bootstrap';

const GET_ORDER_BY_ID = gql`
  query GetOrderById($orderId: ID!) {
    getOrderById(orderId: $orderId) {
      id
      status
      totalAmount
      createdAt
      products {
        name
        price
        quantity
      }
      shippingAddress {
        street
        city
        province
        zipcode
      }
      paymentMethod
    }
  }
`;

const OrderDetails = () => {
  const { orderId } = useParams();
  const { loading, error, data } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const order = data.getOrderById;

  return (
    <Container>
      <h2>Order Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>Order ID: {order.id}</Card.Title>
          <Card.Text>Status: {order.status}</Card.Text>
          <Card.Text>Total Amount: ${order.totalAmount}</Card.Text>
          <Card.Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Card.Text>
          <Card.Text>Payment Method: {order.paymentMethod}</Card.Text>
        </Card.Body>
        <ListGroup variant="flush">
          {order.products.map((product, index) => (
            <ListGroup.Item key={index}>
              <strong>{product.name}</strong> - ${product.price} x {product.quantity}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Body>
          <Card.Text>Shipping Address:</Card.Text>
          <Card.Text>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.zipcode}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetails;
