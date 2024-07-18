import React, { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useUser } from '../Common/UserContext';

const ADD_PRODUCT = gql`
  mutation AddProduct($merchantId: ID!, $name: String!, $price: Float!, $categoryId: ID!) {
    addProduct(merchantId: $merchantId, name: $name, price: $price, categoryId: $categoryId) {
      id
      name
      price
      category {
        id
        name
      }
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

const AddMenu = () => {
  const { user } = useUser();
  const merchantId = user?.id;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);
  const [addProduct, { loading }] = useMutation(ADD_PRODUCT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: {
          merchantId,
          name,
          price: parseFloat(price),
          categoryId
        }
      });
      setSuccessMessage('Product added successfully!');
      setName('');
      setPrice('');
      setCategoryId('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (categoriesLoading) return <Spinner animation="border" />;
  if (categoriesError) return <Alert variant="danger">{categoriesError.message}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Add New Menu Item</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categoriesData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddMenu;
