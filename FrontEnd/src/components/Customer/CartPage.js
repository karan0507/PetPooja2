import React from 'react';
import { useCart } from '../Common/CartContext';
import { Container, Row, Col, Card, ListGroup, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Assests/Css/Cart.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, parseInt(quantity));
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.info('Product removed from cart', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.13;
  const totalPriceWithTax = total + tax;

  if (cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <h1>Your Cart</h1>
        <p>No items in the cart.</p>
      </Container>
    );
  }

  return (
    <Container className="cart-container mt-5">
      <h1 className="mb-4">My Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.map(item => (
            <Card className="mb-3" key={item.id}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3} className="text-center">
                    <img src={item.image} alt={item.name} className="img-fluid" />
                  </Col>
                  <Col md={5}>
                    <h5>{item.name}</h5>
                    <p>Price: ${item.price.toFixed(2)}</p>
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </Col>
                  <Col md={2} className="text-right">
                    <Button variant="danger" onClick={() => handleRemove(item.id)}>Remove</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card className="order-summary">
            <Card.Body>
              <h4>Order Summary</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Tax (13% HST)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Total</span>
                    <span>${totalPriceWithTax.toFixed(2)}</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
              <Form.Group controlId="formPromoCode" className="mt-3">
                <Form.Label>Enter Promo Code</Form.Label>
                <Form.Control type="text" placeholder="Promo Code" />
                <Button variant="dark" className="mt-2 w-100">Submit</Button>
              </Form.Group>
              <Button variant="primary" className="mt-3 w-100" onClick={() => navigate('/checkout')}>Checkout</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
