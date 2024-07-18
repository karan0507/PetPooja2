import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, ListGroup, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String!) {
    updateCategory(categoryId: $categoryId, name: $name) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

const ListCategories = () => {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setCategoryName(category.name);
    setShowEditModal(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ variables: { categoryId: categoryToEdit.id, name: categoryName } });
      refetch();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory({ variables: { categoryId: categoryToDelete.id } });
      refetch();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Categories</h2>
      <ListGroup>
        {data.categories.map((category) => (
          <ListGroup.Item key={category.id}>
            {category.name}
            <Button variant="primary" onClick={() => handleEditClick(category)} className="ml-2">Edit</Button>
            <Button variant="danger" onClick={() => handleDeleteClick(category)} className="ml-2">Delete</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCategory}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Update</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteCategory}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListCategories;