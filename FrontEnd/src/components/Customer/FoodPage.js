// src/components/Customer/FoodPage.js
import React, { useState, useEffect } from 'react';
import { useProducts } from '../Common/ProductContext';
import { useCart } from '../Common/CartContext';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const FoodPage = () => {
  const { categories, products } = useProducts();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const term = event.target.value.toLowerCase();
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.name.toLowerCase().includes(term)
      )
    );
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search for products or categories..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
      </Row>
      {categories.map(category => (
        <Row key={category.id} className="mb-4">
          <Col>
            <h4>{category.name}</h4>
            <Row>
              {filteredProducts
                .filter(product => product.category.id === category.id)
                .map(product => (
                  <Col key={product.id} md={4} className="mb-4">
                    <Card>
                      <Card.Img variant="top" src={product.image} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                          ${product.price.toFixed(2)}
                        </Card.Text>
                        <Form>
                          <Form.Group controlId={`quantity-${product.id}`}>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </Form.Group>
                          <Button variant="primary" className='mt-4' onClick={() => {
                            const quantity = parseInt(document.getElementById(`quantity-${product.id}`).value);
                            handleAddToCart(product, quantity);
                          }}>
                            Add to Cart
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default FoodPage;
