// src/components/Merchant/RestaurantDetails/Overview.js
import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import '../../Assests/Css/Restaurant/Overview.css'; // Custom CSS for the Overview page

const Overview = ({ restaurant }) => {
  if (!restaurant) {
    return <p>Loading...</p>; // Add a basic loading state
  }

  const staticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.location.lng - 0.01},${restaurant.location.lat - 0.01},${restaurant.location.lng + 0.01},${restaurant.location.lat + 0.01}&layer=mapnik&marker=${restaurant.location.lat},${restaurant.location.lng}`;

  return (
    <Container className="overview-container">
      <Row className="my-4">
        <Col>
          <h2>About this place</h2>
          <p>{restaurant.description || 'No description available.'}</p>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Cuisines</h4>
          {restaurant.cuisines && restaurant.cuisines.length > 0 ? (
            <div>
              {restaurant.cuisines.map((cuisine, index) => (
                <Badge key={index} pill bg="secondary" className="cuisine-badge">
                  {cuisine}
                </Badge>
              ))}
            </div>
          ) : (
            <p>No cuisines available.</p>
          )}
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Menu</h4>
          {restaurant.menuImages && restaurant.menuImages.length > 0 ? (
            <Row>
              {restaurant.menuImages.map((menuImage, index) => (
                <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                  <Card className="menu-image-card">
                    <Card.Img variant="top" src={menuImage} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No menu images available.</p>
          )}
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Contact</h4>
          <p>Phone: {restaurant.phone}</p>
          <h4>Address</h4>
          <p>{restaurant.address}</p>
          <div className="map-container">
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={staticMapUrl}
            ></iframe> 
          </div>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Additional Information</h4>
          <p>Opening Hours: {restaurant.timings}</p>
          <p>Average Cost: {restaurant.averageCost}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Overview;
