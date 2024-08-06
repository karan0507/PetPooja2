const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const cloudinary = require('../../config/cloudinary');

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
    }
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
  }
};

module.exports = userResolvers;
