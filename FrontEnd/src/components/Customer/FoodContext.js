import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

// Create a context for product data
const ProductContext = createContext();

// Custom hook to use the ProductContext
export const useProducts = () => useContext(ProductContext);

// GraphQL query to get products and categories
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      image
      category {
        id
        name
      }
      merchant {
        id
        name
      }
      restaurant {
        id
        name
        timings
        active
      }
      rating
    }
    categories {
      id
      name
    }
  }
`;

// Provider component to supply product data to the rest of the app
export const ProductProvider = ({ children }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState({});

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setProducts(data.products); // Set products with fetched data
      setCategories(data.categories); // Set categories with fetched data
      setRestaurant(data.products[0]?.restaurant || {}); // Set restaurant data from the first product
    }
  }, [data]);

  // Handle loading state
  if (loading) return <p>Loading...</p>;
  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  return (
    // Provide the product data to the rest of the app
    <ProductContext.Provider value={{ products, categories, restaurant, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
