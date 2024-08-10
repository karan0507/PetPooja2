import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useCart } from '../Common/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const GET_MERCHANT_MENU = gql`
  query GetMerchantMenuList($merchantId: ID!) {
    merchantMenuList(merchantId: $merchantId) {
      id
      name
      price
      image
      category {
        name
      }
      merchant {
        id
      }
    }
  }
`;

const RestaurantDetails = () => {
    const { merchantId } = useParams();
    const navigate = useNavigate(); // React Router's hook for navigation
    const { loading, error, data } = useQuery(GET_MERCHANT_MENU, {
        variables: { merchantId },
    });

    const { addToCart, clearCart } = useCart();
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (productId, value) => {
        setQuantities({
            ...quantities,
            [productId]: value,
        });
    };

    const addToCartWithCheck = (product) => {
        if (!product || !product.merchant || !product.merchant.id) {
            toast.error("Invalid product or merchant data.");
            return;
        }

        const quantity = quantities[product.id] || 1;

        const handleMerchantConflict = (clearCartCallback) => {
            if (window.confirm('You have products from another merchant in your cart. Do you want to clear the cart and add this product instead?')) {
                clearCartCallback(); // This will clear the cart and add the new product
                toast.success(`${quantity} of ${product.name} added to cart!`);
                window.location.replace("/cart");  // Navigate to /cart and simulate a page reload
            }
        };

        addToCart(product, quantity, handleMerchantConflict);
    };

    if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    if (!data || !data.merchantMenuList || data.merchantMenuList.length === 0) {
        return <Alert variant="warning">No menu items found for this merchant.</Alert>;
    }

    return (
        <Container className="mt-5">
            <ToastContainer />
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
                Go Back
            </Button>
            <h2 className="mb-4">Menu</h2>
            <Row>
                {data.merchantMenuList.map((item) => (
                    <Col key={item.id} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm">
                            {item.image && (
                                <Card.Img
                                    variant="top"
                                    src={item.image}
                                    alt={item.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> ${item.price}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Category:</strong> {item.category.name}
                                </Card.Text>
                                <Form.Group controlId={`quantity-${item.id}`}>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={quantities[item.id] || 1}
                                        min={1}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    className="mt-2"
                                    onClick={() => addToCartWithCheck(item)}
                                >
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default RestaurantDetails;
