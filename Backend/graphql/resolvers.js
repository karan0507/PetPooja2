const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Address = require("../models/Address");
const Customer = require("../models/Customer");
const Merchant = require("../models/Merchant");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");
const ContactUsAdmin = require("../models/ContactUsAdmin");
const Product = require("../models/Product");
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    users: async () => await User.find({}),
    user: async (_, { id }) => await User.findById(id),
    contactMessages: async () => await ContactUsAdmin.find({}),
    orders: async () => await Order.find({}).populate("user"),
    merchants: async () =>
      await Merchant.find({}).populate("user").populate("address"),
    merchant: async (_, { userId }) => {
      const merchant = await Merchant.findOne({ user: userId })
        .populate("user")
        .populate("address");

      return merchant;
    },
    customer: async (_, { userId }) => {
      const customer = await Customer.findOne({ user: userId })
        .populate("user")
        .populate("address");

      return customer;
    },
    products: async () => await Product.find({}),
  },
  Mutation: {
    uploadProfilePic: async (_, { userId, file }) => {
      const { createReadStream, filename, mimetype } = await file;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        throw new Error("Only JPG and PNG files are allowed");
      }

      const stream = createReadStream();
      const uniqueFilename = `${Date.now()}-${filename}`;
      const filePath = path.join(__dirname, `../uploads/${uniqueFilename}`);
      const out = fs.createWriteStream(filePath);
      stream.pipe(out);
      await new Promise((resolve, reject) => {
        out.on("finish", resolve);
        out.on("error", reject);
      });

      user.profilePic = `/uploads/${uniqueFilename}`;
      await user.save();

      return user;
    },
    removeProfilePic: async (_, { userId }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.profilePic) {
        const filePath = path.join(__dirname, `../${user.profilePic}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
        user.profilePic = null;
        await user.save();
      }

      return user;
    },
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
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists");
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

      return newUser;
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Username not found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Incorrect password");
      }

      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    updatePassword: async (_, { id, newPassword }) => {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    submitContactForm: async (_, { name, email, subject, message }) => {
      const newContact = new ContactUsAdmin({
        name,
        email,
        subject,
        message,
      });
      const result = await newContact.save();
      return result;
    },
    updateOrderStatus: async (_, { id, status }) => {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error("Order not found");
      }
      order.status = status;
      await order.save();
      return order;
    },
    toggleProductStatus: async (_, { productId }) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      product.isActive = !product.isActive;
      await product.save();
      return product;
    },
    addProduct: async (_, { name, price, category }) => {
      const newProduct = new Product({ name, price, category, isActive: true });
      await newProduct.save();
      return newProduct;
    },
  },
};

module.exports = resolvers;
