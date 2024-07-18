import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES, GET_PRODUCTS } from '../../graphql/queries';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { data: categoriesData, loading: loadingCategories } = useQuery(GET_CATEGORIES);
  const { data: productsData, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.categories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products);
    }
  }, [productsData]);

  if (loadingCategories || loadingProducts) {
    return <div>Loading...</div>;
  }

  return (
    <ProductContext.Provider value={{ categories, products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
