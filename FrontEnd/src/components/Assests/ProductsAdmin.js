import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './ProductsAdmin.css';

const GET_PRODUCTS = gql`
  query GetProducts($page: Int!, $limit: Int!) {
    products(page: $page, limit: $limit) {
      id
      name
      price
      category
      reviews {
        user
        comment
        rating
      }
      isActive
    }
  }
`;

const ProductsAdmin = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { page, limit },
  });

  useEffect(() => {
    console.log(`Requesting products for page ${page} with limit ${limit}`);
  }, [page, limit]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching products:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="product-admin">
      <h4>Manage Products</h4>
      <ul>
        {data.products.map(product => (
          <li key={product.id}>
            <h5>{product.name}</h5>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Status: {product.isActive ? 'Active' : 'Inactive'}</p>
            <ul>
              {product.reviews.map((review, index) => (
                <li key={index}>
                  <p>User: {review.user}</p>
                  <p>Comment: {review.comment}</p>
                  <p>Rating: {review.rating}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(page => Math.max(page - 1, 1))}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page => page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ProductsAdmin;
