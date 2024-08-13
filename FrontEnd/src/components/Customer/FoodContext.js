import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

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

export const ProductProvider = ({ children }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    if (data) {
      setProducts(data.products);
      setCategories(data.categories);
      setRestaurant(data.products[0]?.restaurant || {});
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ProductContext.Provider value={{ products, categories, restaurant, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
