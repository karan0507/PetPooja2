import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';

const GET_ORDER_BY_ID = gql`
  query GetOrderById($orderId: ID!) {
    getOrderById(orderId: $orderId) {
      id
      status
      totalAmount
      createdAt
      shippingAddress {
        street
        city
        province
        zipcode
      }
      products {
        productId
        name
        price
        quantity
        restaurantName
        restaurantAddress {
          street
          city
          province
          zipcode
        }
      }
    }
  }
`;

const OrderDetails = () => {
  const { orderId } = useParams();
  const { loading, error, data } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId },
  });

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const { status, totalAmount, createdAt, shippingAddress, products } = data.getOrderById;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>Order Details</Card.Header>
        <Card.Body>
          <Card.Title>Order ID: {orderId}</Card.Title>
          <Card.Text>Status: {status}</Card.Text>
          <Card.Text>Total Amount: ${totalAmount}</Card.Text>
          <Card.Text>Order Date: {new Date(createdAt).toLocaleDateString()}</Card.Text>
          <Card.Text>
            Shipping Address: {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.zipcode}
          </Card.Text>
          <ListGroup>
            {products.map(product => (
              <ListGroup.Item key={product.productId}>
                <strong>{product.name}</strong>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ${product.price}</p>
                <p>Restaurant: {product.restaurantName}</p>
                <p>Address: {product.restaurantAddress.street}, {product.restaurantAddress.city}, {product.restaurantAddress.province}, {product.restaurantAddress.zipcode}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetails;
