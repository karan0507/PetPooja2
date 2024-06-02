const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const Restaurant = require('../models/Restaurant');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: async () => {
      return await User.find({});
    }
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
        console.error('Error in signup mutation:', error);
        throw new Error('Error creating user');
      }
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Incorrect password');
        }

        return user;
      } catch (error) {
        console.error('Error in login mutation:', error);
        throw new Error('Error logging in');
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
        console.error('Error in deleteUser mutation:', error);
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
        console.error('Error in updatePassword mutation:', error);
        throw new Error('Error updating password');
      }
    },
  },
};

module.exports = resolvers;
