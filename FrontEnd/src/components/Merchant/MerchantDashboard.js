// src/components/Layout.js
import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Outlet } from 'react-router-dom';

const MerchantDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light vh-100 p-0">
          <Nav className="flex-column">
          <LinkContainer to="/merchantdashboard">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/merchantdashboard/add-category">
              <Nav.Link>Add Category</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/merchantdashboard/add-menu">
              <Nav.Link>Add Menu</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/merchantdashboard/menu-list">
              <Nav.Link>Menu List</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/merchantdashboard/category-list">
              <Nav.Link>Category List</Nav.Link>
            </LinkContainer>
          </Nav>
        </Col>
        
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default MerchantDashboard;
