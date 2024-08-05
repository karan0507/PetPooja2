import React, { useState, useEffect } from 'react';
import { useProducts } from '../Common/ProductContext';
import { useCart } from '../Common/CartContext';
import { Container, Row, Col, Card, Form, Button, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaFilter, FaLeaf } from 'react-icons/fa';
import ErrorPage from '../Common/ErrorPage';
import NoDataPage from '../Common/NoDataPage';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Assests/Css/FoodPage.css';

const FoodPage = () => {
  const { categories, products, restaurant, loading, error } = useProducts();
  const { addToCart } = useCart();
  
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cuisine = queryParams.get('cuisine') || '';
    const isPureVeg = queryParams.get('pureVeg') === 'true';
    setSelectedCuisine(cuisine);
    setPureVegOnly(isPureVeg);
    setFilteredProducts(products);
  }, [location.search, products]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    const term = event.target.value.toLowerCase();
    setTimeout(() => {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.category.name.toLowerCase().includes(term) ||
          product.merchant.name.toLowerCase().includes(term)
        )
      );
      setSearchLoading(false);
    }, 500);
  };

  const handleAddToCart = (product, quantity) => {
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

  const handleApplyFilters = () => {
    let filtered = products;
    if (ratingFilter) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }
    if (activeOnly) {
      filtered = filtered.filter(product => product.isActive);
    }
    if (pureVegOnly) {
      filtered = filtered.filter(product => product.isVeg);
    }
    if (selectedCuisine) {
      filtered = filtered.filter(product => product.category.name === selectedCuisine);
    }
    setFilteredProducts(filtered);
    setShowFilters(false);
    navigate(`?cuisine=${selectedCuisine}&pureVeg=${pureVegOnly}`);
  };

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

  if (filteredProducts.length === 0) {
    return <NoDataPage />;
  }

  return (
    <Container>
      {restaurant && (
        <Row className="my-4">
          <Col>
            <h2 className="restaurant-name">{restaurant.name}</h2>
            <p className="restaurant-timings">Open: {restaurant.timings}</p>
          </Col>
        </Row>
      )}
      <Row className="my-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search for products, categories, or merchants..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => setShowFilters(true)}>
            <FaFilter /> Filters
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Button 
            variant={pureVegOnly ? "primary" : "outline-secondary"} 
            className="mr-2" 
            onClick={() => {
              setPureVegOnly(!pureVegOnly);
              navigate(`?cuisine=${selectedCuisine}&pureVeg=${!pureVegOnly}`);
            }}
          >
            <FaLeaf /> Pure Veg
          </Button>
          <Button 
            variant={selectedCuisine ? "primary" : "outline-secondary"} 
            className="mr-2" 
            onClick={() => {
              setSelectedCuisine('');
              navigate(`?cuisine=&pureVeg=${pureVegOnly}`);
            }}
          >
            Cuisines
          </Button>
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
          {categories.length === 0 && <NoDataPage />}
          {categories.map(category => (
            <Row key={category.id} className="mb-4">
              <Col>
                <h4 className="category-title">{category.name}</h4>
                <Row>
                  {filteredProducts
                    .filter(product => product.category.id === category.id)
                    .slice(0, 10)
                    .map(product => (
                      <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="product-card">
                          <Card.Img variant="top" src={product.image} className="product-image" />
                          <Card.Body>
                            <Card.Title>
                              <a href={`/restaurant/${restaurant.id}`}>{product.name}</a>
                            </Card.Title>
                            <Card.Text>
                              ${product.price.toFixed(2)}
                            </Card.Text>
                            <Card.Text>
                              <small>Merchant: {product.merchant.name}</small>
                            </Card.Text>
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
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRating">
              <Form.Label>Sort by Rating</Form.Label>
              <Form.Control
                as="select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Any</option>
                <option value="3.5">3.5+</option>
                <option value="4.0">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="5.0">5.0</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formActiveOnly">
              <Form.Check
                type="checkbox"
                label="Active only"
                checked={activeOnly}
                onChange={() => setActiveOnly(!activeOnly)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilters(false)}>Close</Button>
          <Button variant="primary" onClick={handleApplyFilters}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FoodPage;
