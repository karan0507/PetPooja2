import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About PetPooja</h5>
            <p>
            PetPooja is your go-to app for the best food delivery service in town.
              Explore our menu and order your favorite meals from top restaurants.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/about" className="text-light">About</Link></li>
              <li><Link to="/contact" className="text-light">Contact</Link></li>
              <li><Link to="/food" className="text-light">Food</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              <i className="bi bi-person-circle"></i> support@petpooja.com<br />
              <i className="bi bi-telephone"></i> (123) 456-7890<br />
              <i className="bi bi-geo-alt"></i> 123 Foodie St, Foodland, FL 12345
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p>&copy; {new Date().getFullYear()} Foodie. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
