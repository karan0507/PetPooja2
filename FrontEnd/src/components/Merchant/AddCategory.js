import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $image: Upload) {
    addCategory(name: $name, image: $image) {
      id
      name
      image
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String, $image: Upload) {
    updateCategory(categoryId: $categoryId, name: $name, image: $image) {
      id
      name
      image
    }
  }
`;

const AddCategory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Only for update

  const [addCategory] = useMutation(ADD_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryId) {
        await updateCategory({ variables: { categoryId, name, image } });
        setSuccessMessage('Category updated successfully');
      } else {
        await addCategory({ variables: { name, image } });
        setSuccessMessage('Category added successfully');
      }
      setName('');
      setImage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">{categoryId ? 'Update' : 'Add'} Category</h2>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="categoryName">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="categoryImage" className="mt-3">
                  <Form.Label>Category Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required={!categoryId}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4 w-100">
                  {categoryId ? 'Update' : 'Add'} Category
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategory;
