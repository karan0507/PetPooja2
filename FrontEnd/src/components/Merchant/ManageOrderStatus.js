import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useUser } from '../Common/UserContext';
import { useNavigate } from 'react-router-dom';

const GET_MERCHANT_ORDERS = gql`
  query GetMerchantOrders($merchantId: ID!) {
    getOrdersByMerchant(merchantId: $merchantId) {
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
      }
    }
  }
`;

const MerchantOrders = () => {
  const { user } = useUser();
  const { loading, error, data } = useQuery(GET_MERCHANT_ORDERS, {
    variables: { merchantId: user.id }
  });
  const navigate = useNavigate();

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;  // Corrected the JSX closing tag here

  const orders = data?.getOrdersByMerchant || [];

  return (
    <Container>
      <h2>Merchant Orders</h2>
      {orders.length === 0 ? (
        <Alert variant="info">No orders found for this merchant.</Alert>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Card.Title>Order ID: {order.id}</Card.Title>
              <Card.Text>Status: {order.status}</Card.Text>
              <Card.Text>Total Amount: ${order.totalAmount}</Card.Text>
              <Card.Text>
                Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.zipcode}
              </Card.Text>
              <Card.Text>
                Products:
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.name} (Quantity: {product.quantity})
                    </li>
                  ))}
                </ul>
              </Card.Text>
              <Button variant="primary" onClick={() => navigate(`/merchantdashboard/manage-order-status/${order.id}`)}>
  View Details
</Button>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MerchantOrders;
