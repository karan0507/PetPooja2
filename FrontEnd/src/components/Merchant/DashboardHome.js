import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';


const DashboardHome = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics'); // Replace with your actual API endpoint
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const response = await fetch('/api/recent-orders'); // Replace with your actual API endpoint
        const data = await response.json();
        setRecentOrders(data);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    fetchMetrics();
    fetchRecentOrders();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h1>Merchant Dashboard</h1>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Orders</h5>
              <h2>{metrics.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Pending Orders</h5>
              <h2>{metrics.pendingOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Completed Orders</h5>
              <h2>{metrics.completedOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Revenue</h5>
              <h2>${metrics.totalRevenue}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Recent Orders</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.status}</td>
                      <td>${order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardHome;
