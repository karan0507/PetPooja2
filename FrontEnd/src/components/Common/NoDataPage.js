import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import noDataImage from '../Assests/Images/Backend_Error_1.jpg';
import '../Assests/Css/Error/NoDataPage.css';

const NoDataPage = () => {
  return (
    <Container className="text-center">
      <Row className="my-4">
        <Col>
          <img src={noDataImage} alt="No Data" className="no-data-image" />
          <h2>No Data Available</h2>
          <p>Our team is working to update the data. Please check back later.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default NoDataPage;
