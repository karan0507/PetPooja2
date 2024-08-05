// src/components/Merchant/RestaurantDetails/Menu.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoDataPage from '../../Common/NoDataPage';
import ErrorPage from '../../Common/ErrorPage';
import '../../Assests/Css/Restaurant/Menu.css';

const GET_MENU_ITEMS = gql`
  query GetMenuItems($merchantId: ID!) {
    menuItems(merchantId: $merchantId) {
      id
      name
      price
      description
      image
      category {
        id
        name
      }
    }
  }
`;

const Menu = () => {
  const { merchantId } = useParams();
  const { loading, error, data } = useQuery(GET_MENU_ITEMS, {
    variables: { merchantId }
  });

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

  if (!data || data.menuItems.length === 0) {
    return <NoDataPage />;
  }

  return (
    <Container className="menu-container">
      <Row className="my-4">
        <Col>
          <h2>Menu</h2>
        </Col>
      </Row>
      <Row>
        {data.menuItems.map((menuItem) => (
          <Col key={menuItem.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="menu-item-card">
              <Card.Img variant="top" src={menuItem.image} className="menu-item-image" />
              <Card.Body>
                <Card.Title>{menuItem.name}</Card.Title>
                <Card.Text>${menuItem.price.toFixed(2)}</Card.Text>
                <Card.Text>{menuItem.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Menu;
