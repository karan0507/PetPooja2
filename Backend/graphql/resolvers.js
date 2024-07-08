const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const ContactUsAdmin = require('../models/ContactUsAdmin');
const Product = require('../models/Product'); // Import the Product model

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find({});
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
      }
    },
    contactMessages: async () => {
      try {
        return await ContactUsAdmin.find({});
      } catch (error) {
        console.error('Error fetching contact messages:', error);
        throw new Error('Error fetching contact messages');
      }
    },
    orders: async () => {
      try {
        return await Order.find({}).populate('user');
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Error fetching orders');
      }
    },
    merchants: async () => {
      try {
        return await Merchant.find({}).populate('user');
      } catch (error) {
        console.error('Error fetching merchants:', error);
        throw new Error('Error fetching merchants');
      }
    },
    products: async (_, { page, limit }) => {
      try {
        console.log(`Fetching products for page ${page} with limit ${limit}`);
        const products = await Product.find({})
          .skip((page - 1) * limit)
          .limit(limit);
        
        if (products.length === 0) {
          console.warn('No products found');
        }

        console.log('Fetched products:', products);
        return products;
      } catch (error) {
        console.error('Error fetching products:', error.message);
        throw new Error(`Error fetching products: ${error.message}`);
      }
    },
  },
  Mutation: {
    signup: async (
      _,
      {
        username,
        password,
        role,
        email,
        phone,
        street,
        city,
        province,
        zipcode,
        restaurantName,
        registrationNumber,
      }
    ) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          password: hashedPassword,
          role,
          email,
          phone,
        });
        await newUser.save();

        if (role === 'Customer') {
          const newAddress = new Address({
            street,
            city,
            province,
            zipcode,
          });
          await newAddress.save();

          const newCustomer = new Customer({
            user: newUser._id,
            address: newAddress._id,
          });
          await newCustomer.save();
        } else if (role === 'Merchant') {
          const newAddress = new Address({
            street,
            city,
            province,
            zipcode,
          });
          await newAddress.save();

          const newRestaurant = new Restaurant({
            restaurantName,
            address: newAddress._id,
            phone,
            registrationNumber,
          });
          await newRestaurant.save();

          const newMerchant = new Merchant({
            user: newUser._id,
            restaurant: newRestaurant._id,
          });
          await newMerchant.save();
        }

        return newUser;
      } catch (error) {
        console.error('Error in signup mutation:', error.message);
        throw new Error(error.message);
      }
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('Username not found');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Incorrect password');
        }

        return user;
      } catch (error) {
        console.error('Error in login mutation:', error.message);
        throw new Error(error.message);
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        console.error('Error in deleteUser mutation:', error.message);
        throw new Error('Error deleting user');
      }
    },
    updatePassword: async (_, { id, newPassword }) => {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true }
        );
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        console.error('Error in updatePassword mutation:', error.message);
        throw new Error('Error updating password');
      }
    },
    submitContactForm: async (_, { name, email, subject, message }) => {
      try {
        const newContact = new ContactUsAdmin({
          name,
          email,
          subject,
          message
        });
        const result = await newContact.save();
        return result;
      } catch (error) {
        console.error('Error submitting contact form:', error);
        throw new Error('Failed to submit contact form');
      }
    },
    updateOrderStatus: async (_, { id, status }) => {
      try {
        const order = await Order.findById(id);
        if (!order) {
          throw new Error('Order not found');
        }
        order.status = status;
        await order.save();
        return order;
      } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status');
      }
    },
  },
};

module.exports = resolvers;
