// src/components/Customer/CheckoutPage.js
import React from 'react';
import { useCart } from '../Common/CartContext';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

const CheckoutPage = () => {
  const { cartItems } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.13;
  const totalPriceWithTax = total + tax;

  const handleCheckout = () => {
    // Handle the checkout process here
    alert('Checkout successful!');
  };

  return (
    <Container className="mt-5">
      <h1>Checkout</h1>
      <Row>
        <Col md={8}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter address" />
            </Form.Group>
            <Form.Group controlId="formBasicCard">
              <Form.Label>Credit Card</Form.Label>
              <Form.Control type="text" placeholder="Enter credit card number" />
            </Form.Group>
            <Button variant="primary" onClick={handleCheckout}>
              Place Order
            </Button>
          </Form>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h5>Subtotal: ${total.toFixed(2)}</h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Tax (13% HST): ${tax.toFixed(2)}</h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Total: ${totalPriceWithTax.toFixed(2)}</h4>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
