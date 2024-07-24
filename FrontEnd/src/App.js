import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import HomePage from '../src/components/Common/HomePage';
import AboutPage from './components/Common/AboutPage';
import ContactPage from './components/Common/ContactPage';
import FoodPage from './components/Customer/FoodPage';
import CartPage from './components/Customer/CartPage';
import Login from './components/Common/Login';
import Signup from './components/Common/Signup';
import AdminDashboard from '../src/components/Admin/AdminDashboard';
import NavigationBar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import UsersPage from './components/Admin/UsersPage';
import ContactMessages from './components/Admin/ContactMessages';
import OrdersPage from './components/Admin/OrdersPage';
import AddMerchant from './components/Admin/AddMerchant';
import ProfileDetailPage from './components/Common/ProfileDetailPage';
import ProductsAdmin from './components/Common/ProductsAdmin';
import AddMenu from './components/Merchant/AddMenu';
import MenuList from './components/Merchant/MenuList';
import AddCategory from './components/Merchant/AddCategory';
import ListCategories from './components/Merchant/CategorList';
import ManageOrderStatus from './components/Merchant/ManageOrderStatus';
import DashboardHome from './components/Merchant/DashboardHome';
import MerchantDashboard from './components/Merchant/MerchantDashboard';

import { useUser } from './components/Common/UserContext';
import { ProductProvider } from './components/Common/ProductContext';
import { CartProvider } from './components/Common/CartContext';
import './App.css';

function App() {
  const { user } = useUser();
  const merchantId = user?.role === 'Merchant' ? user.id : null;

  return (
    <ApolloProvider client={client}>
      <ProductProvider>
        <CartProvider>
          <Router>
            <NavigationBar />
            <div className="content">
              <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/food" element={<FoodPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/merchantdashboard" element={<MerchantDashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="add-category" element={<AddCategory />} />
                  <Route path="add-menu" element={<AddMenu />} />
                  <Route path="menu-list" element={<MenuList />} />
                  <Route path="manage-order-status" element={<ManageOrderStatus />} />
                  <Route path="category-list" element={<ListCategories />} />
                </Route>
                <Route path="/profile/:userId" element={<ProfileDetailPage />} />
                <Route path="/admin/*" element={<AdminDashboard />}>
                <Route index element={<DashboardHome />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="contact-messages" element={<ContactMessages />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="add-merchant" element={<AddMerchant />} />
                  <Route path="products" element={<ProductsAdmin />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </Router>
        </CartProvider>
      </ProductProvider>
    </ApolloProvider>
  );
}

export default App;
