const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Merchant = require('../../models/Merchant');
const { GraphQLUpload } = require('graphql-upload');
const cloudinary = require('../../config/cloudinary');
const mongoose = require('mongoose');

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
        if (typeof filter.isVeg === 'boolean') {
          query.isVeg = filter.isVeg;
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
      const userObjectId = new mongoose.Types.ObjectId(merchantId);
      const merchant = await Merchant.findOne({ user: userObjectId });

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
      const merchantObjectId = new mongoose.Types.ObjectId(merchantId);
      const merchant = await Merchant.findById(merchantObjectId).populate('restaurant');

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const products = await Product.find({ merchant: merchant._id }).populate('category');

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
      const merchants = await Merchant.find().populate('user').populate('restaurant');
      if (!merchants) {
        throw new Error("No merchants found");
      }
      return merchants.map(merchant => ({
        ...merchant.toObject(),
        id: merchant._id.toString(),
        restaurantName: merchant.restaurant.restaurantName
      }));
    },

    product: async (_, { id }) => {
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
      const merchant = await Merchant.findOne({ user: merchantId }).populate('orders');
      if (!merchant) {
        return [];
      }

      const orders = merchant.orders || [];

      return orders.map(order => ({
        ...order.toObject(),
        id: order._id.toString(),
        products: order.products.map(product => ({
          ...product.toObject(),
          productId: product.productId.toString(),
        })),
      }));
    },
  },

  Mutation: {
    addProduct: async (_, { userId, name, price, categoryId, image, ingredients, description, discount, tags, isVeg }) => {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const merchant = await Merchant.findOne({ user: userObjectId });

      if (!merchant) throw new Error('Merchant not found');

      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      const category = await Category.findById(categoryObjectId);

      if (!category) throw new Error('Category not found');

      let imageUrl = null;
      if (image) {
        const uploadResult = await cloudinary.uploader.upload(image, {
          upload_preset: 'bdox1lbn'
        });
        imageUrl = uploadResult.secure_url;
      }

      const newProduct = new Product({
        name,
        price,
        category: categoryObjectId,
        image: imageUrl,
        isActive: true,
        isVeg,
        ingredients,
        description,
        discount,
        tags,
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

    updateProduct: async (_, { productId, name, price, categoryId, isActive, image, ingredients, description, discount, tags, isVeg }) => {
      const product = await Product.findById(new mongoose.Types.ObjectId(productId)).populate('category').populate('merchant');
      if (!product) throw new Error('Product not found');

      if (name) product.name = name;
      if (price) product.price = price;
      if (categoryId) {
        const category = await Category.findById(new mongoose.Types.ObjectId(categoryId));
        if (!category) throw new Error('Category not found');
        product.category = category._id;
      }
      if (typeof isActive === 'boolean') product.isActive = isActive;
      if (ingredients) product.ingredients = ingredients;
      if (description) product.description = description;
      if (typeof discount === 'number') product.discount = discount;
      if (tags) product.tags = tags;
      if (typeof isVeg === 'boolean') product.isVeg = isVeg;

      if (image) {
        const uploadResult = await cloudinary.uploader.upload(image, {
          upload_preset: 'bdox1lbn'
        });
        product.image = uploadResult.secure_url;
      }

      await product.save();

      const category = await Category.findById(product.category);
      const merchant = await Merchant.findById(product.merchant);

      return {
        ...product.toObject(),
        id: product._id.toString(),
        category: category ? { ...category.toObject(), id: category._id.toString() } : null,
        merchant: merchant ? { ...merchant.toObject(), id: merchant._id.toString() } : null,
      };
    },

    deleteProduct: async (_, { productId }) => {
      const product = await Product.findById(new mongoose.Types.ObjectId(productId));
      if (!product) throw new Error('Product not found');

      await Merchant.updateOne(
        { _id: product.merchant },
        { $pull: { menu: product._id } }
      );

      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await product.deleteOne();

      return true;
    },
  },

  Product: {
    category: async (product) => {
      const category = await Category.findById(product.category);
      if (!category) return null;
      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },
    merchant: async (product) => {
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
