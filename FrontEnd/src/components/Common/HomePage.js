import React from 'react';
import DashboardImg from '../Assests/Images/dashboard_Img1.jpg';
import Category1 from '../Assests/Images/dashboardCategory1.jpg';
import Category2 from '../Assests/Images/dashboardCategory2.jpg';
import Category3 from '../Assests/Images/dashboardCategory3.jpg';
import Pizza from '../Assests/Images/Pizza.jpg';
import burger from '../Assests/Images/burger.jpg';
import tiffin from '../Assests/Images/tiffin.jpg';
import dessert from '../Assests/Images/dessert.jpg';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../Assests/Css/HomePage.css';

const HomePage = () => {

  return (
    <div className="homepage">
      <Container fluid className="hero-section">
        <Row className="align-items-center text-center text-md-left">
          <Col md={6}>
            <h1 className="display-4">Welcome to PetPooja</h1>
            <p className="lead">Discover the best food from your favorite restaurants!</p>
            <Button variant="primary" href="#top-restaurants">Order Now</Button>
          </Col>
          <Col md={6}>
            <img src={DashboardImg} className="img-fluid" />
          </Col>
        </Row>
      </Container>

      

      <Container className="my-5">
        <Row>
          <Col md={4}>
            <Card className="promo-card">
              <Card.Img variant="top" src={Category1} />
              <Card.Body>
                <Card.Title>Get 20% Off</Card.Title>
                <Card.Text>Order now and get 20% off on your first purchase!</Card.Text>
                <Button variant="primary">Order Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="promo-card">
              <Card.Img variant="top" src={Category2} />
              <Card.Body>
                <Card.Title>Free Delivery</Card.Title>
                <Card.Text>Enjoy free delivery on orders above $50!</Card.Text>
                <Button variant="primary">Order Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="promo-card">
              <Card.Img variant="top" src={Category3} />
              <Card.Body>
                <Card.Title>Refer a Friend</Card.Title>
                <Card.Text>Refer a friend and both of you get $10 off your next order!</Card.Text>
                <Button variant="primary">Refer Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="my-5">
        <h2 className="text-center mb-4">Top Categories</h2>
        <Row>
          <Col md={3}>
            <Card className="category-card">
              <Card.Img variant="top" src={Pizza} />
              <Card.Body>
                <Card.Title>Pizza</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="category-card">
              <Card.Img variant="top" src={burger} />
              <Card.Body>
                <Card.Title>Burgers</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="category-card">
              <Card.Img variant="top" src={tiffin} />
              <Card.Body>
                <Card.Title>Tiffin</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="category-card">
              <Card.Img variant="top" src={dessert} />
              <Card.Body>
                <Card.Title>Desserts</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
