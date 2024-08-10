// src/components/MerchantList.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa'; // Importing FontAwesome icon
import 'bootstrap/dist/css/bootstrap.min.css';

const GET_MERCHANTS = gql`
  query GetMerchants {
    merchants {
      id
      user {
        username
        profilePic
      }
      restaurantName
    }
  }
`;

const MerchantList = () => {
  const { loading, error, data } = useQuery(GET_MERCHANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container className="mt-5">
      <Row>
        {data.merchants.map((merchant) => (
          <Col key={merchant.id} md={4} className="mb-4">
            <Card className="shadow-sm">
              {merchant.user.profilePic ? (
                <Card.Img
                  variant="top"
                  src={merchant.user.profilePic}
                  alt={`${merchant.user.username}'s profile`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  <FaUserCircle size={80} color="#cccccc" />
                </div>
              )}
              <Card.Body>
                <Card.Title>{merchant.restaurantName}</Card.Title>
                <Card.Text>Owner: {merchant.user.username}</Card.Text>
                <Link to={`/food/restaurant/${merchant.id}`}>
                  <Button variant="primary">View Menu</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MerchantList;
