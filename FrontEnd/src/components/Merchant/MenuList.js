import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Table, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import { useUser } from '../Common/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      image
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
  mutation UpdateProduct($productId: ID!, $name: String, $price: Float, $categoryId: ID, $isActive: Boolean, $image: Upload) {
    updateProduct(productId: $productId, name: $name, price: $price, categoryId: $categoryId, isActive: $isActive, image: $image) {
      id
      name
      price
      category {
        id
        name
      }
      isActive
      image
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: 0,
    categoryId: '',
    isActive: false,
    image: null,
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

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
      image: null,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct({
        variables: { productId: selectedProduct.id },
      });
      setShowDeleteModal(false);
      refetch();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Error deleting product.');
    }
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
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error('Error updating product.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductDetails({ ...productDetails, image: file });
  };

  if (loading || categoriesLoading) return <Spinner animation="border" />;
  if (error || categoriesError) return <Alert variant="danger">{error ? error.message : categoriesError.message}</Alert>;

  return (
    <Container className="mt-5 p-5">
      <h2>Menu List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.merchantMenu.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                {product.image && (
                  <img src={product.image} alt={product.name} width="50" />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.isActive ? "Yes" : "No"}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditClick(product)}>Edit</Button>
                <Button variant="danger" className="ms-2 " onClick={() => handleDeleteClick(product)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
              <Form.Group controlId="image">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Button type="submit">Update Product</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product "{selectedProduct?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MenuList;
