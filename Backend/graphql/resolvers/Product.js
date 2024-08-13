const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Merchant = require('../../models/Merchant');
const { GraphQLUpload } = require('graphql-upload');
const cloudinary = require('../../config/cloudinary');
const mongoose = require('mongoose');
const Order = require('../../models/Order');


const ProductResolvers = {
  Upload: GraphQLUpload,

  Query: {
    products: async (_, { filter, pagination }) => {
      const query = {};
      if (filter) {
        if (filter.category) {
          query.category = new mongoose.Types.ObjectId(filter.category);
        }
        if (filter.searchTerm) {
          query.name = { $regex: filter.searchTerm, $options: 'i' };
        }
        if (typeof filter.isActive === 'boolean') {
          query.isActive = filter.isActive;
        }
      }

      const products = await Product.find(query)
      
        .populate('category')
        .populate({
          path: 'merchant',
          populate: {
            path: 'restaurant',
            model: 'Restaurant'
          }
        })
        .skip(pagination?.skip)
        .limit(pagination?.limit)
        .sort({ createdAt: -1 });

      return products.map(product => {
        const category = product.category || null;
        const merchant = product.merchant || null;

        return {
          ...product.toObject(),
          id: product._id.toString(),
          category: category ? { ...category.toObject(), id: category._id.toString() } : null,
          merchant: merchant ? { ...merchant.toObject(), id: merchant._id.toString() } : null,
        };
      });
    },
    merchantMenu: async (_, { merchantId }) => {
      console.log("merchantMenu query called with merchantId:", merchantId);
      const userObjectId = new mongoose.Types.ObjectId(merchantId);
      console.log("Converted User ID to ObjectId:", userObjectId);

      const merchant = await Merchant.findOne({ user: userObjectId });
      console.log("Merchant found:", merchant);

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const products = await Product.find({ merchant: merchant._id })
        .populate('category')
        .populate({
          path: 'merchant',
          populate: {
            path: 'restaurant',
            model: 'Restaurant'
          }
        });

      console.log("Products fetched from database:", products);

      return products.map(product => ({
        ...product.toObject(),
        id: product._id.toString(),
        category: product.category ? {
          ...product.category.toObject(),
          id: product.category._id.toString(),
        } : null,
        merchant: product.merchant ? {
          ...product.merchant.toObject(),
          id: product.merchant._id.toString(),
        } : null,
      }));
    },
    merchantMenuList: async (_, { merchantId }) => {
  console.log("merchantMenu query called with merchantId:", merchantId);
  
  // Convert merchantId string to MongoDB ObjectId
  const merchantObjectId = new mongoose.Types.ObjectId(merchantId);
  console.log("Converted merchant ID to ObjectId:", merchantObjectId);

  // Find the merchant by its _id (merchantObjectId) and populate the restaurant field
  const merchant = await Merchant.findById(merchantObjectId).populate('restaurant');
  console.log("Merchant found:", merchant);

  if (!merchant) {
    throw new Error('Merchant not found');
  }

  // Fetch products associated with this merchant
  const products = await Product.find({ merchant: merchant._id }).populate('category');
  console.log("Products fetched from database:", products);

  return products.map(product => ({
    ...product.toObject(),
    id: product._id.toString(),
    category: product.category ? {
      ...product.category.toObject(),
      id: product.category._id.toString(),
    } : null,
    merchant: {
      ...merchant.toObject(),
      id: merchant._id.toString(),
      restaurant: {
        restaurantName: merchant.restaurant.restaurantName
      }
    }
  }));
},
   
    merchants: async () => {
      try {
        const merchants = await Merchant.find().populate('user').populate('restaurant');
        console.log("Fetched merchants:", merchants);  // Log the fetched merchants
        if (!merchants) {
          throw new Error("No merchants found");
        }
        return merchants.map(merchant => ({
          ...merchant.toObject(),
          id: merchant._id.toString(),
          restaurantName: merchant.restaurant.restaurantName  // Populate restaurantName from Restaurant model
        }));
      } catch (error) {
        console.error("Error fetching merchants:", error);
        throw new Error("Error fetching merchants");
      }
    },
    product: async (_, { id }) => {
      console.log("product query called with id:", id);
      const product = await Product.findById(new mongoose.Types.ObjectId(id))
        .populate('category')
        .populate({
          path: 'merchant',
          populate: {
            path: 'restaurant',
            model: 'Restaurant'
          }
        });

      if (!product) throw new Error('Product not found');

      const category = product.category || null;
      const merchant = product.merchant || null;

      return {
        ...product.toObject(),
        id: product._id.toString(),
        category: category ? { ...category.toObject(), id: category._id.toString() } : null,
        merchant: merchant ? { ...merchant.toObject(), id: merchant._id.toString() } : null,
      };
    },
   
    getOrdersByMerchant: async (_, { merchantId }) => {
      try {
        console.log("Fetching orders for merchant ID:", merchantId);
        const merchant = await Merchant.findOne({ user: merchantId }).populate('orders');
        if (!merchant) {
          console.error("Merchant not found:", merchantId);
          return [];  // Return an empty array if the merchant is not found
        }

        const orders = merchant.orders || [];
        console.log("Orders found:", orders);

        // Ensure orders is always an array
        return orders.map(order => ({
          ...order.toObject(),
          id: order._id.toString(),
          products: order.products.map(product => ({
            ...product.toObject(),
            productId: product.productId.toString(),
          })),
        }));
      } catch (error) {
        console.error("Error fetching orders for merchant:", error);
        throw new Error('Failed to fetch orders for merchant');
      }
    },
  
  },

  Mutation: {
    addProduct: async (_, { userId, name, price, categoryId, image }) => {
      console.log("addProduct mutation called with:", { userId, name, price, categoryId, image });
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const merchant = await Merchant.findOne({ user: userObjectId });
      console.log("Merchant found:", merchant);

      if (!merchant) throw new Error('Merchant not found');

      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      const category = await Category.findById(categoryObjectId);
      console.log("Category found:", category);

      if (!category) throw new Error('Category not found');

      let imageUrl = null;
      if (image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            upload_preset: 'bdox1lbn'
          });
          imageUrl = uploadResult.secure_url;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (err) {
          console.error("File upload error:", err);
          throw new Error("File upload failed.");
        }
      }

      const newProduct = new Product({
        name,
        price,
        category: categoryObjectId,
        image: imageUrl,
        isActive: true,
        merchant: merchant._id,
      });
      await newProduct.save();

      merchant.menu.push(newProduct._id);
      await merchant.save();

      return {
        ...newProduct.toObject(),
        id: newProduct._id.toString(),
        category: category ? { ...category.toObject(), id: category._id.toString() } : null,
        merchant: merchant ? { ...merchant.toObject(), id: merchant._id.toString() } : null,
      };
    },

    updateProduct: async (_, { productId, name, price, categoryId, isActive, image }) => {
      console.log("updateProduct mutation called with:", { productId, name, price, categoryId, isActive, image });
      try {
        const product = await Product.findById(new mongoose.Types.ObjectId(productId)).populate('category').populate('merchant');
        console.log("Product found:", product);
        if (!product) throw new Error('Product not found');

        if (name) product.name = name;
        if (price) product.price = price;
        if (categoryId) {
          const category = await Category.findById(new mongoose.Types.ObjectId(categoryId));
          console.log("Category found:", category);
          if (!category) throw new Error('Category not found');
          product.category = category._id;
        }
        if (typeof isActive === 'boolean') product.isActive = isActive;

        if (image) {
          try {
            const uploadResult = await cloudinary.uploader.upload(image, {
              upload_preset: 'bdox1lbn'
            });
            product.image = uploadResult.secure_url;
            console.log("Image uploaded successfully:", product.image);
          } catch (err) {
            console.error("File upload error:", err);
            throw new Error("File upload failed.");
          }
        }

        await product.save();
        console.log("Product updated successfully:", product);

        const category = await Category.findById(product.category);
        const merchant = await Merchant.findById(product.merchant);

        return {
          ...product.toObject(),
          id: product._id.toString(),
          category: category ? { ...category.toObject(), id: category._id.toString() } : null,
          merchant: merchant ? { ...merchant.toObject(), id: merchant._id.toString() } : null,
        };
      } catch (err) {
        console.error("Error updating product:", err);
        throw err;
      }
    },

    deleteProduct: async (_, { productId }) => {
      console.log("deleteProduct mutation called with productId:", productId);
      const product = await Product.findById(new mongoose.Types.ObjectId(productId));
      console.log("Product found:", product);
      if (!product) throw new Error('Product not found');

      // Remove product ID from merchant's menu
      await Merchant.updateOne(
        { _id: product.merchant },
        { $pull: { menu: product._id } }
      );
      console.log("Product removed from merchant's menu");

      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted from cloudinary:", publicId);
      }

      await product.deleteOne();

      return true;
    },
  },
  Product: {
    category: async (product) => {
      console.log("Resolving category for product:", product);
      const category = await Category.findById(product.category);
      if (!category) return null;
      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },
    merchant: async (product) => {
      console.log("Resolving merchant for product:", product);
      const merchant = await Merchant.findById(product.merchant).populate('restaurant');
      if (!merchant) return null;
      return {
        ...merchant.toObject(),
        id: merchant._id.toString(),
        name: merchant.restaurant ? merchant.restaurant.restaurantName : null,
      };
    },
  },
};

module.exports = ProductResolvers;

