import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import errorImage from '../Assests/Images/Backend_Error_1.jpg'; // Ensure you have an error image in the specified path

const ErrorPage = () => {
  return (
    <Container className="text-center">
      <Row className="my-4">
        <Col>
          <img src={errorImage} alt="Error" className="error-image" />
          <h2>Oops! Something went wrong.</h2>
          <p>Our backend team is working on it. Please try again later.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
