import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import { useUser } from '../Common/UserContext';

const GET_MERCHANT_MENU = gql`
  query GetMerchantMenu($merchantId: ID!) {
    merchantMenu(merchantId: $merchantId) {
      id
      name
      price
      category {
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
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productId: ID!, $name: String, $price: Float, $categoryId: ID, $isActive: Boolean) {
    updateProduct(productId: $productId, name: $name, price: $price, categoryId: $categoryId, isActive: $isActive) {
      id
      name
      price
      category {
        id
        name
      }
      isActive
    }
  }
`;

const MenuList = () => {
  const { user } = useUser();
  const merchantId = user?.id;

  const { loading, error, data, refetch } = useQuery(GET_MERCHANT_MENU, {
    variables: { merchantId },
    skip: !merchantId,
  });

  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: 0,
    categoryId: '',
    isActive: false,
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  useEffect(() => {
    console.log("Merchant ID in MenuList component:", merchantId);
  }, [merchantId]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductDetails({
      name: product.name,
      price: product.price,
      categoryId: product.category.id,
      isActive: product.isActive,
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        variables: {
          productId: selectedProduct.id,
          ...productDetails,
        },
      });
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading || categoriesLoading) return <Spinner animation="border" />;
  if (error || categoriesError) return <Alert variant="danger">{error ? error.message : categoriesError.message}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Menu List</h2>
      <Row>
        {data.merchantMenu.map((product) => (
          <Col key={product.id} md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Category: {product.category.name}</Card.Text>
                <Card.Text>Price: ${product.price.toFixed(2)}</Card.Text>
                <Card.Text>Active: {product.isActive ? "Yes" : "No"}</Card.Text>
                <Button onClick={() => handleEditClick(product)}>Edit</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedProduct && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={productDetails.name}
                  onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="number"
                  value={productDetails.price}
                  onChange={(e) => setProductDetails({ ...productDetails, price: parseFloat(e.target.value) })}
                />
              </Form.Group>
              <Form.Group controlId="categoryId">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={productDetails.categoryId}
                  onChange={(e) => setProductDetails({ ...productDetails, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categoriesData.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={productDetails.isActive}
                  onChange={(e) => setProductDetails({ ...productDetails, isActive: e.target.checked })}
                />
              </Form.Group>
              <Button type="submit">Update Product</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default MenuList;
