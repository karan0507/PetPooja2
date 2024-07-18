import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

const AddCategory = () => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [addCategory] = useMutation(ADD_CATEGORY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ variables: { name } });
      setSuccessMessage('Category added successfully');
      setName('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Add Category</h2>
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
        <Button variant="primary" type="submit" className="mt-3">
          Add Category
        </Button>
      </Form>
    </Container>
  );
};

export default AddCategory;
