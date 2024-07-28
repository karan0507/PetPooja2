import React, { useState } from 'react';
import { useCart } from '../Common/CartContext';
import { useMutation, gql } from '@apollo/client';
import { Container, Row, Col, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PLACE_ORDER = gql`
  mutation PlaceOrder($userId: ID!, $items: [OrderItemInput!]!, $total: Float!, $address: String!, $phone: String!, $email: String!) {
    placeOrder(userId: $userId, items: $items, total: $total, address: $address, phone: $phone, email: $email) {
      id
    }
  }
`;

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const [placeOrder] = useMutation(PLACE_ORDER);
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const userId = localStorage.getItem('userId');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.13;
  const totalPriceWithTax = total + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!address) newErrors.address = 'Address is required';
    if (!phone) newErrors.phone = 'Phone Number is required';
    if (!postalCode) newErrors.postalCode = 'Postal Code is required';
    if (!creditCard) newErrors.creditCard = 'Credit Card number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (validateForm()) {
      try {
        const orderItems = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));

        await placeOrder({
          variables: {
            userId,
            items: orderItems,
            total: totalPriceWithTax,
            address,
            phone,
            email
          }
        });

        setSuccess('Checkout successful!');
        navigate('/orders'); // Assuming you have an orders page
      } catch (error) {
        setErrors({ form: 'Checkout failed. Please try again.' });
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1>Checkout</h1>
      {success && <Alert variant="success">{success}</Alert>}
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Row>
        <Col md={8}>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPostalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                isInvalid={!!errors.postalCode}
              />
              <Form.Control.Feedback type="invalid">
                {errors.postalCode}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicCard">
              <Form.Label>Credit Card</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter credit card number"
                value={creditCard}
                onChange={(e) => setCreditCard(e.target.value)}
                isInvalid={!!errors.creditCard}
              />
              <Form.Control.Feedback type="invalid">
                {errors.creditCard}
              </Form.Control.Feedback>
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
