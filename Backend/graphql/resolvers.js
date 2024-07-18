const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const Address = require("../models/Address");
const Customer = require("../models/Customer");
const Merchant = require("../models/Merchant");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ContactUsAdmin = require("../models/ContactUsAdmin");
const { GraphQLUpload } = require("graphql-upload");
const cloudinary = require('../config/cloudinary');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    users: async () => {
      const users = await User.find({});
      return users.map(user => ({
        ...user.toObject(),
        id: user._id.toString(),
      }));
    },
    user: async (_, { id }) => {
      const user = await User.findById(new ObjectId(id));
      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    contactMessages: async () => {
      const messages = await ContactUsAdmin.find({});
      return messages.map(message => ({
        ...message.toObject(),
        id: message._id.toString(),
      }));
    },
    orders: async () => {
      const orders = await Order.find({}).populate("user");
      return orders.map(order => ({
        ...order.toObject(),
        id: order._id.toString(),
        user: {
          ...order.user.toObject(),
          id: order.user._id.toString(),
        },
      }));
    },
    merchants: async () => {
      const merchants = await Merchant.find({}).populate("user").populate("address").populate("menu");
      return merchants.map(merchant => ({
        ...merchant.toObject(),
        id: merchant._id.toString(),
        user: {
          ...merchant.user.toObject(),
          id: merchant.user._id.toString(),
        },
        address: {
          ...merchant.address.toObject(),
          id: merchant.address._id.toString(),
        },
        menu: merchant.menu.map(product => ({
          ...product.toObject(),
          id: product._id.toString(),
        })),
      }));
    },
    merchant: async (_, { userId }) => {
      const merchant = await Merchant.findOne({ user: new ObjectId(userId) })
        .populate("user")
        .populate("address")
        .populate("menu");

      if (!merchant) {
        throw new Error("Merchant not found");
      }

      return {
        ...merchant.toObject(),
        id: merchant._id.toString(),
        user: {
          ...merchant.user.toObject(),
          id: merchant.user._id.toString(),
        },
        address: {
          ...merchant.address.toObject(),
          id: merchant.address._id.toString(),
        },
        menu: merchant.menu.map(product => ({
          ...product.toObject(),
          id: product._id.toString(),
          category: product.category.toString(),
        })),
      };
    },
    customer: async (_, { userId }) => {
      const customer = await Customer.findOne({ user: new ObjectId(userId) })
        .populate("user")
        .populate("address");

      if (!customer) {
        throw new Error("Customer not found");
      }

      return {
        ...customer.toObject(),
        id: customer._id.toString(),
        user: {
          ...customer.user.toObject(),
          id: customer.user._id.toString(),
        },
        address: {
          ...customer.address.toObject(),
          id: customer.address._id.toString(),
        },
      };
    },
    userCount: async () => await User.countDocuments(),
    adminCount: async () => await User.countDocuments({ role: 'Admin' }),
    merchantCount: async () => await User.countDocuments({ role: 'Merchant' }),
    customerCount: async () => await User.countDocuments({ role: 'Customer' }),
    merchantMenu: async (_, { merchantId }) => {
      const merchant = await Merchant.findOne({ user: new ObjectId(merchantId) }).populate("menu");
      if (!merchant) {
        throw new Error("Merchant not found");
      }
      return merchant.menu.map(product => ({
        ...product.toObject(),
        id: product._id.toString(),
        category: product.category.toString(),
      }));
    },
    categories: async () => {
      const categories = await Category.find({});
      return categories.map(category => ({
        ...category.toObject(),
        id: category._id.toString(),
      }));
    },
    products: async (_, { filter }) => {
      const query = {};
      if (filter) {
        if (filter.category) {
          query.category = new ObjectId(filter.category);
        }
        if (filter.searchTerm) {
          query.name = { $regex: filter.searchTerm, $options: "i" };
        }
      }
      const products = await Product.find(query).populate('category');
      return products.map(product => ({
        ...product.toObject(),
        id: product._id.toString(),
      }));
    }
  },
  Mutation: {
    uploadProfilePic: async (_, { userId, file }) => {
      const { createReadStream, filename, mimetype } = await file;
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const stream = createReadStream();
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          resolve(result);
        });
        stream.pipe(uploadStream);
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
      if (!user) throw new Error("User not found");

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

    signup: async (_, { username, password, role, email, phone, street, city, province, zipcode, restaurantName, registrationNumber }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("Username already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
        role,
        email,
        phone,
      });
      await newUser.save();

      const newAddress = new Address({
        street,
        city,
        province,
        zipcode,
      });
      await newAddress.save();

      if (role === "Customer") {
        const newCustomer = new Customer({
          user: newUser._id,
          address: newAddress._id,
        });
        await newCustomer.save();
      } else if (role === "Merchant") {
        const newRestaurant = new Restaurant({
          restaurantName,
          address: newAddress._id,
          phone,
          registrationNumber,
        });
        await newRestaurant.save();

        const newMerchant = new Merchant({
          user: newUser._id,
          restaurantName,
          address: newAddress._id,
          phone,
          registrationNumber,
          menu: [],
        });
        await newMerchant.save();
      }

      return {
        ...newUser.toObject(),
        id: newUser._id.toString(),
      };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("Username not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(new ObjectId(id));
      if (!user) throw new Error("User not found");
      return {
        ...user.toObject(),
        id: user._id.toString(),
      };
    },
    updatePassword: async (_, { id, newPassword }) => {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findByIdAndUpdate(new ObjectId(id), { password: hashedPassword }, { new: true });
      if (!user) throw new Error("User not found");
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
    updateOrderStatus: async (_, { id, status }) => {
      const order = await Order.findById(new ObjectId(id));
      if (!order) throw new Error("Order not found");
      order.status = status;
      await order.save();
      return {
        ...order.toObject(),
        id: order._id.toString(),
      };
    },
    addProduct: async (_, { merchantId, name, price, categoryId, image }) => {
      const merchant = await Merchant.findOne({ user: new ObjectId(merchantId) });
      if (!merchant) {
        throw new Error("Merchant not found");
      }

      const category = await Category.findById(new ObjectId(categoryId));
      if (!category) {
        throw new Error("Category not found");
      }

      let imageUrl = null;
      if (image) {
        const { createReadStream, filename, mimetype, encoding } = await image;

        const stream = createReadStream();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
          stream.pipe(uploadStream);
        });

        imageUrl = uploadResult.secure_url;
      }

      const product = new Product({
        name,
        price,
        category: new ObjectId(categoryId),
        reviews: [],
        isActive: true,
        image: imageUrl,
      });
      await product.save();

      merchant.menu.push(product._id);
      await merchant.save();

      return {
        ...product.toObject(),
        id: product._id.toString(),
        category: {
          ...category.toObject(),
          id: category._id.toString(),
        },
      };
    },
    updateProduct: async (_, { productId, name, price, categoryId, isActive, image }) => {
      const product = await Product.findById(new ObjectId(productId));
      if (!product) {
        throw new Error("Product not found");
      }

      if (name) product.name = name;
      if (price) product.price = price;
      if (categoryId) product.category = new ObjectId(categoryId);
      if (typeof isActive === 'boolean') product.isActive = isActive;

      if (image) {
        const { createReadStream, filename, mimetype, encoding } = await image;

        const stream = createReadStream();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
          stream.pipe(uploadStream);
        });

        product.image = uploadResult.secure_url;
      }

      await product.save();
      return {
        ...product.toObject(),
        id: product._id.toString(),
        category: product.category.toString(),
      };
    },
    deleteProduct: async (_, { productId }) => {
      const product = await Product.findByIdAndDelete(new ObjectId(productId));
      if (!product) throw new Error("Product not found");

      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      return true;
    },
    addCategory: async (_, { name, image }) => {
      let imageUrl = null;
      if (image) {
        const { createReadStream } = await image;
        const stream = createReadStream();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) reject(error);
            resolve(result);
          });
          stream.pipe(uploadStream);
        });
        imageUrl = uploadResult.secure_url;
      }

      const category = new Category({
        name,
        image: imageUrl,
      });
      await category.save();

      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },
    updateCategory: async (_, { categoryId, name, image }) => {
      const category = await Category.findById(new ObjectId(categoryId));
      if (!category) {
        throw new Error("Category not found");
      }

      if (name) category.name = name;

      if (image) {
        const { createReadStream } = await image;
        const stream = createReadStream();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) reject(error);
            resolve(result);
          });
          stream.pipe(uploadStream);
        });
        category.image = uploadResult.secure_url;
      }

      await category.save();
      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },
    deleteCategory: async (_, { categoryId }) => {
      const category = await Category.findByIdAndDelete(new ObjectId(categoryId));
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    },
  },
  Product: {
    category: async (product) => {
      const category = await Category.findById(product.category);
      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },
  },
};

module.exports = resolvers;
