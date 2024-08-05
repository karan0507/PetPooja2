// src/components/Merchant/RestaurantDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Tab, Spinner } from 'react-bootstrap';
import ErrorPage from '../../Common/ErrorPage';
import NoDataPage from '../../Common/NoDataPage';
import Overview from './Overview';
import OrderOnline from './OrderOnline';
import Reviews from './Reviews';
import Photos from './Photos';
import Menu from './Menu'; // Import the new Menu component
import '../../Assests/Css/Restaurant/RestaurantDetails.css';

const RestaurantDetails = () => {
  const { merchantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/restaurants/${merchantId}`)
      .then(response => response.json())
      .then(data => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [merchantId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!restaurant) {
    return <NoDataPage />;
  }

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>{restaurant.name}</h2>
          <p>{restaurant.address}</p>
        </Col>
      </Row>
      <Tab.Container defaultActiveKey={activeTab} onSelect={(tab) => navigate(`?tab=${tab}`)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order-online">Order Online</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reviews">Reviews</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="photos">Photos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="menu">Menu</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <Overview restaurant={restaurant} />
              </Tab.Pane>
              <Tab.Pane eventKey="order-online">
                <OrderOnline restaurantId={restaurant.id} />
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <Reviews restaurantId={restaurant.id} />
              </Tab.Pane>
              <Tab.Pane eventKey="photos">
                <Photos restaurantId={restaurant.id} />
              </Tab.Pane>
              <Tab.Pane eventKey="menu">
                <Menu restaurantId={restaurant.id} />
              </Tab.Pane>
              {/* Add other tabs here */}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantDetails;
