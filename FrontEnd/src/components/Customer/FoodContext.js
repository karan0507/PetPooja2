// src/components/Customer/FoodPage.js
import React, { useState } from 'react';
import { useProducts } from '../Common/ProductContext';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const FoodPage = () => {
  const { categories, products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

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
      <Row>
        {categories.map(category => (
          <Col key={category.id} className="mb-4">
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
                        <Button variant="primary">Add to Cart</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FoodPage;
