// src/components/Customer/CartPage.js
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
    <Container className="mt-5">
      <h1>Your Cart</h1>
      {cartItems.map(item => (
        <Card className="mb-3" key={item.id}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3}>
                <img src={item.image} alt={item.name} className="img-fluid" />
              </Col>
              <Col md={3}>
                <h5>{item.name}</h5>
                <p>Price: ${item.price.toFixed(2)}</p>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </Col>
              <Col md={3} className="text-right">
                <Button variant="danger" onClick={() => handleRemove(item.id)}>Remove</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Row className="mt-4">
        <Col md={{ span: 4, offset: 8 }}>
          <Card>
            <ListGroup variant="flush">
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
          </Card>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={() => navigate('/food')} className='mb-4'>Continue Shopping</Button>
            <Button variant="primary" onClick={() => navigate('/checkout')} className='mb-4'>Checkout</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
