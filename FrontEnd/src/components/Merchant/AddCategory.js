import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $image: String) {
    addCategory(name: $name, image: $image) {
      id
      name
      image
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String, $image: String) {
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
  const [categoryId, setCategoryId] = useState('');

  const [addCategory] = useMutation(ADD_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      if (file.size > 10000000) {
        toast.error('Image size should be less than 10MB');
        setImage(null);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      toast.error('Invalid file format. Please upload a JPEG or PNG image.');
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    const variables = categoryId
      ? { categoryId, name, image }
      : { name, image };

    try {
      if (categoryId) {
        await updateCategory({ variables });
        toast.success('Category updated successfully!');
      } else {
        await addCategory({ variables });
        toast.success('Category added successfully!');
      }
      setName('');
      setImage(null);
      setCategoryId('');
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred while adding/updating the category.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">{categoryId ? 'Update' : 'Add'} Category</h2>
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
                    accept="image/jpeg, image/png"
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
