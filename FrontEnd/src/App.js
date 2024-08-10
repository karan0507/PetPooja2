import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import HomePage from './components/Common/HomePage';
import AboutPage from './components/Common/AboutPage';
import ContactPage from './components/Common/ContactPage';
import MerchantList from './components/Customer/MerchantList';
import RestaurantDetails from './components/Customer/RestaurantDetails';
import CartPage from './components/Customer/CartPage';
import CheckoutPage from './components/Customer/CheckoutPage';
import Login from './components/Common/Login';
import Signup from './components/Common/Signup';
import AdminDashboard from './components/Admin/AdminDashboard';
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
import MerchantOrderDetails from './components/Merchant/MerchantOrderDetails';
import DashboardHome from './components/Merchant/DashboardHome';
import MerchantDashboard from './components/Merchant/MerchantDashboard';
import OrderHistory from './components/Customer/OrderHistory'; // Import Order History
import OrderDetails from './components/Customer/OrderDetails';
import { useUser } from './components/Common/UserContext';
import { ProductProvider } from './components/Common/ProductContext';
import { CartProvider } from './components/Common/CartContext';
import { ToastContainer } from 'react-toastify';
// import './components/Assets/Css/Toast.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import TrackOrder from './components/Customer/TrackOrder'; 
function App() {
  const { user } = useUser();

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
                <Route path="/food" element={<MerchantList />} />
                <Route path="/food/restaurant/:merchantId" element={<RestaurantDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:userId" element={<ProfileDetailPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order/:orderId" element={<OrderDetails />} /> {/* <-- This is the missing route */}
                <Route path="/track-order/:orderId" element={<TrackOrder />} />

                {/* Merchant Dashboard Routes */}
                <Route path="/merchantdashboard" element={<MerchantDashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="add-category" element={<AddCategory />} />
                  <Route path="add-menu" element={<AddMenu />} />
                  <Route path="menu-list" element={<MenuList />} />
                  <Route path="manage-order" element={<ManageOrderStatus />} />
                  <Route path="/merchantdashboard/manage-order-status/:orderId" element={<MerchantOrderDetails />} />

                  <Route path="category-list" element={<ListCategories />} />
                </Route>
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminDashboard />}>
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
          <ToastContainer />
        </CartProvider>
      </ProductProvider>
    </ApolloProvider>
  );
}

export default App;
