import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useCart } from '../Common/CartContext';
import { useUser } from '../Common/UserContext';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CREATE_ORDER = gql`
  mutation CreateOrder($customerId: ID!, $products: [OrderProductInput!]!, $totalAmount: Float!, $shippingAddress: AddressInput!, $paymentMethod: String!) {
    createOrder(customerId: $customerId, products: $products, totalAmount: $totalAmount, shippingAddress: $shippingAddress, paymentMethod: $paymentMethod) {
      id
      status
    }
  }
`;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    province: '',
    zipcode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const products = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        merchantId: item.merchant.id,
      }));

      console.log("Products being sent:", products);

      const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const response = await createOrder({
        variables: {
          customerId: user.id,
          products,
          totalAmount,
          shippingAddress,
          paymentMethod
        }
      });

      console.log("Order response:", response);

      clearCart(); // Clear the cart after successful order placement
      navigate(`/order/${response.data.createOrder.id}`); // Redirect to order details page
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message);
    }
  };

  return (
    <Container>
      <h2>Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formStreet">
          <Form.Label>Street</Form.Label>
          <Form.Control
            type="text"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formProvince">
          <Form.Label>Province</Form.Label>
          <Form.Control
            type="text"
            value={shippingAddress.province}
            onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formZipcode">
          <Form.Label>Zipcode</Form.Label>
          <Form.Control
            type="text"
            value={shippingAddress.zipcode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipcode: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPaymentMethod">
          <Form.Label>Payment Method</Form.Label>
          <Form.Control
            as="select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
          </Form.Control>
        </Form.Group>

        <Button 
          variant="primary" 
          onClick={handlePlaceOrder} 
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Place Order'}
        </Button>
      </Form>
    </Container>
  );
};

export default Checkout;
