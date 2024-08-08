const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Restaurant = require('../../models/Restaurant');
const Merchant = require('../../models/Merchant');
const cloudinary = require('../../config/cloudinary');
const Address = require('../../models/Address');
const ContactUsAdmin = require("../../models/ContactUsAdmin");

const userResolvers = {
  Query: {
    users: async () => {
      const users = await User.find({});
      return users.map(user => ({
        ...user.toObject(),
        id: user._id.toString(),
      }));
    },
    user: async (_, { id }) => {
      const user = await User.findById(id);
      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    merchantByUserId: async (_, { userId }) => {
      const objectId = new mongoose.Types.ObjectId(userId); // Correct instantiation
      const merchant = await Merchant.findOne({ user: objectId }).populate({
        path: 'restaurant',
        populate: {
          path: 'address',
          model: 'Address'
        }
      }).populate('user');
      if (!merchant) throw new Error('Merchant not found');
      return {
        ...merchant.toObject(),
        id: merchant._id.toString(),
      };
    },
    contactMessages: async () => {
      const messages = await ContactUsAdmin.find({});
      return messages.map((message) => ({
        ...message.toObject(),
        id: message._id.toString(),
      }));
    },
    userCount: async () => await User.countDocuments(),
    adminCount: async () => await User.countDocuments({ role: "Admin" }),
    merchantCount: async () => await User.countDocuments({ role: "Merchant" }),
    customerCount: async () => await User.countDocuments({ role: "Customer" }),
  },
  Mutation: {
    signup: async (_, { username, password, role, email, phone, street, city, province, zipcode, restaurantName, registrationNumber }) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          username,
          password: hashedPassword,
          role,
          email,
          phone,
          profilePic: null,
        });

        await newUser.save();

        if (role === 'Merchant') {
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
            menu: [],
          });

          await newMerchant.save();
        }

        return {
          id: newUser._id.toString(),
          username: newUser.username,
          role: newUser.role,
          email: newUser.email,
          phone: newUser.phone,
          profilePic: newUser.profilePic,
        };
      } catch (error) {
        if (error.code === 11000) {
          throw new Error('Username already exists');
        }
        throw new Error(error.message);
      }
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Incorrect password');
      }

      return {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic || null,
      };
    },
    updatePassword: async (_, { id, newPassword }) => {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );

      return {
        id: updatedUser._id.toString(),
        username: updatedUser.username,
        role: updatedUser.role,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePic: updatedUser.profilePic,
      };
    },
    deleteUser: async (_, { id }) => {
      const deletedUser = await User.findByIdAndDelete(id);
      return {
        id: deletedUser._id.toString(),
        username: deletedUser.username,
        role: deletedUser.role,
        email: deletedUser.email,
        phone: deletedUser.phone,
        profilePic: deletedUser.profilePic,
      };
    },
    uploadProfilePic: async (_, { userId, file }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const uploadResult = await cloudinary.uploader.upload(file, {
        upload_preset: 'bdox1lbn' // Your Cloudinary upload preset
      });

      user.profilePic = uploadResult.secure_url;
      await user.save();

      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    removeProfilePic: async (_, { userId }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (user.profilePic) {
        const publicId = user.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        user.profilePic = null;
        await user.save();
      }

      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    submitContactForm: async (_, { name, email, subject, message }) => {
      const newContact = new ContactUsAdmin({ name, email, subject, message });
      const result = await newContact.save();
      return {
        ...result.toObject(),
        id: result._id.toString(),
      };
    },
  }
};

module.exports = userResolvers;
