import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      price
      category
      isActive
    }
  }
`;

const TOGGLE_PRODUCT_STATUS_MUTATION = gql`
  mutation ToggleProductStatus($productId: ID!) {
    toggleProductStatus(productId: $productId) {
      id
      isActive
    }
  }
`;

const ManageProducts = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS_QUERY);
  const [toggleProductStatus] = useMutation(TOGGLE_PRODUCT_STATUS_MUTATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleToggleStatus = (productId) => {
    toggleProductStatus({ variables: { productId } });
  };

  return (
    <div className="container mt-5">
      <h2>Manage Products</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.isActive ? 'In Stock' : 'Out of Stock'}</td>
              <td>
                <button onClick={() => handleToggleStatus(product.id)} className="btn btn-sm btn-primary">
                  {product.isActive ? 'Set Out of Stock' : 'Set In Stock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
