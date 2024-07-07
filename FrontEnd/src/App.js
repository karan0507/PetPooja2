import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FoodPage from './components/FoodPage';
import CartPage from './components/CartPage';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import UsersPage from './components/UsersPage';
import ContactMessages from './components/ContactMessages';
import OrdersPage from './components/OrdersPage';
import AddMerchant from './components/AddMerchant';
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
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="contact-messages" element={<ContactMessages />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="add-merchant" element={<AddMerchant />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
