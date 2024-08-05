// src/components/Merchant/RestaurantDetails/OrderOnline.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import { useCart } from '../../Common/CartContext';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter } from 'react-icons/fa';
import NoDataPage from '../../Common/NoDataPage';
import ErrorPage from '../../Common/ErrorPage';
import { gql, useQuery } from '@apollo/client';
import '../../Assests/Css/Restaurant/OrderOnline.css'; // Custom CSS for the OrderOnline page

const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      id
      name
      price
      image
      category {
        id
        name
      }
      merchant {
        id
        name
      }
      isActive
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      image
    }
  }
`;

const OrderOnline = ({ merchantId }) => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES);
  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS, {
    variables: { filter: { merchantId } },
  });

  useEffect(() => {
    if (productsData && productsData.products) {
      setFilteredProducts(productsData.products);
    }
  }, [productsData]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    const term = event.target.value.toLowerCase();
    setTimeout(() => {
      if (productsData && productsData.products) {
        setFilteredProducts(
          productsData.products.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.category.name.toLowerCase().includes(term)
          )
        );
      }
      setSearchLoading(false);
    }, 500);
  };

  const handleAddToCart = (product, quantity) => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (categoriesError || productsError) {
    return <ErrorPage />;
  }

  if (!categoriesData || !productsData || filteredProducts.length === 0) {
    return <NoDataPage />;
  }

  return (
    <Container className="order-online-container">
      <Row className="my-4">
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Search within menu..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <Button variant="outline-secondary">
              <FaFilter /> Filters
            </Button>
          </InputGroup>
        </Col>
      </Row>
      {searchLoading ? (
        <div className="loading-container">
          <Spinner animation="border" role="status">
            <span className="sr-only">Searching...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {categoriesData.categories.map(category => (
            <Row key={category.id} className="mb-4">
              <Col>
                <h4 className="category-title">{category.name}</h4>
                <Row>
                  {filteredProducts
                    .filter(product => product.category.id === category.id)
                    .map(product => (
                      <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="product-card">
                          <Card.Img variant="top" src={product.image} className="product-image" />
                          <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>${product.price.toFixed(2)}</Card.Text>
                            <Form>
                              <Form.Group controlId={`quantity-${product.id}`}>
                                <Form.Label>Quantity</Form.Label>
                                <InputGroup>
                                  <FormControl
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    className="quantity-input"
                                  />
                                </InputGroup>
                              </Form.Group>
                              <Button
                                variant="primary"
                                className="mt-4 add-to-cart-button"
                                onClick={() => {
                                  const quantity = parseInt(document.getElementById(`quantity-${product.id}`).value);
                                  handleAddToCart(product, quantity);
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Form>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
};

export default OrderOnline;
