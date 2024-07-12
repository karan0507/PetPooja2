import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import HomePage from '../src/components/Common/HomePage';
import AboutPage from './components/Common/AboutPage';
import ContactPage from './components/Common/ContactPage';
import FoodPage from './components/Admin/FoodPage';
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
import ProductsAdmin from './components/Common/ProductsAdmin'; // Import the ProductsAdmin component
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
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
            <Route path="/profile/:userId" element={<ProfileDetailPage />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="contact-messages" element={<ContactMessages />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="add-merchant" element={<AddMerchant />} />
              <Route path="products" element={<ProductsAdmin />} /> {/* Add this line */}
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
