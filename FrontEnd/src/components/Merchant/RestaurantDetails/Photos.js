// src/components/Merchant/RestaurantDetails/Photos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoDataPage from '../../Common/NoDataPage';
import ErrorPage from '../../Common/ErrorPage';
import '../../Assests/Css/Restaurant/Photos.css';

const GET_PHOTOS = gql`
  query GetPhotos($merchantId: ID!) {
    photos(merchantId: $merchantId) {
      id
      url
      description
    }
  }
`;

const Photos = () => {
  const { merchantId } = useParams();
  const { loading, error, data } = useQuery(GET_PHOTOS, {
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

  if (!data || data.photos.length === 0) {
    return <NoDataPage />;
  }

  return (
    <Container className="photos-container">
      <Row className="my-4">
        <Col>
          <h2>Photos</h2>
        </Col>
      </Row>
      <Row>
        {data.photos.map((photo) => (
          <Col key={photo.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="photo-card">
              <Card.Img variant="top" src={photo.url} className="photo-image" />
              <Card.Body>
                <Card.Text>{photo.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Photos;
