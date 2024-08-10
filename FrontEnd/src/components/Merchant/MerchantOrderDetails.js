import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

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
        name
        quantity
        price
      }
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatusByMerchant(orderId: $orderId, status: $status) {
      id
      status
    }
  }
`;

const OrderDetails = () => {
  const { orderId } = useParams();
  const { loading, error, data } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId }
  });
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const order = data?.getOrderById;

  const handleStatusUpdate = async (status) => {
    try {
      await updateOrderStatus({ variables: { orderId, status } });
      window.location.reload(); // Reload to reflect the updated status
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>Order Details</Card.Header>
        <Card.Body>
          <Card.Title>Order ID: {order.id}</Card.Title>
          <Card.Text>Status: {order.status}</Card.Text>
          <Card.Text>Total Amount: ${order.totalAmount}</Card.Text>
          <Card.Text>
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.zipcode}
          </Card.Text>
          <ListGroup variant="flush">
            {order.products.map((product, index) => (
              <ListGroup.Item key={index}>
                <strong>{product.name}</strong> - Quantity: {product.quantity}, Price: ${product.price}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-3">
            <Button variant="primary" onClick={() => handleStatusUpdate('Prepared')}>
              Mark as Prepared
            </Button>{' '}
            <Button variant="warning" onClick={() => handleStatusUpdate('Out for Delivery')}>
              Mark as Out for Delivery
            </Button>{' '}
            <Button variant="success" onClick={() => handleStatusUpdate('Delivered')}>
              Mark as Delivered
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetails;
