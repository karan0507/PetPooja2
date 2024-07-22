import React, { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Container, Form, Button, Spinner, Row, Col, Card,Alert  } from 'react-bootstrap';
import { useUser } from '../Common/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_PRODUCT = gql`
  mutation AddProduct($merchantId: ID!, $name: String!, $price: Float!, $categoryId: ID!, $image: Upload) {
    addProduct(merchantId: $merchantId, name: $name, price: $price, categoryId: $categoryId, image: $image) {
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
  const [image, setImage] = useState(null);
  const [ setErrorMessage] = useState('');
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
          categoryId,
          image
        }
      });
      toast.success('Product added successfully!');
      setName('');
      setPrice('');
      setCategoryId('');
      setImage(null);
    } catch (error) {
      toast.error('An error occurred while adding the product.');
      setErrorMessage(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (categoriesLoading) return <Spinner animation="border" />;
  if (categoriesError) return <Alert variant="danger">{categoriesError.message}</Alert>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Add New Menu Item</h2>
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
                <Form.Group controlId="formPrice" className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCategory" className="mt-3">
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
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4 w-100" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Product'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddMenu;
