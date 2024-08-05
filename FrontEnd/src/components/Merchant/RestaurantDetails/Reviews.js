// src/components/Merchant/RestaurantDetails/Reviews.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoDataPage from '../../Common/NoDataPage';
import ErrorPage from '../../Common/ErrorPage';
import '../../Assests/Css/Restaurant/Reviews.css';

const GET_REVIEWS = gql`
  query GetReviews($merchantId: ID!) {
    reviews(merchantId: $merchantId) {
      user {
        id
        username
      }
      rating
      comment
      createdAt
    }
  }
`;

const Reviews = () => {
  const { merchantId } = useParams();
  const { loading, error, data } = useQuery(GET_REVIEWS, {
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

  if (!data || data.reviews.length === 0) {
    return <NoDataPage />;
  }

  return (
    <Container className="reviews-container">
      <Row className="my-4">
        <Col>
          <h2>{data.reviews.length} Reviews</h2>
        </Col>
      </Row>
      {data.reviews.map((review, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{review.user.username}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {new Date(review.createdAt).toLocaleString()}
                </Card.Subtitle>
                <Card.Text>
                  Rating: {review.rating} <br />
                  {review.comment}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default Reviews;
