// src/components/DashboardHome.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const DashboardHome = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h2>Welcome to the Merchant Dashboard</h2>
              <p>Select an option from the menu to get started.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardHome;
