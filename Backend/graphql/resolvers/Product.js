const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Merchant = require('../../models/Merchant');
const Restaurant = require('../../models/Restaurant');
const { GraphQLUpload } = require('graphql-upload');
const cloudinary = require('../../config/cloudinary');
const { ObjectId } = require('mongodb');

const ProductResolvers = {
  Upload: GraphQLUpload,

  Query: {
    products: async (_, { filter, pagination }) => {
      const query = {};
      if (filter) {
        if (filter.category) {
          query.category = new ObjectId(filter.category);
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

    product: async (_, { id }) => {
      const product = await Product.findById(new ObjectId(id))
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
  },

  Mutation: {
    addProduct: async (_, { merchantId, name, price, categoryId, image }) => {
      const merchant = await Merchant.findById(new ObjectId(merchantId));
      if (!merchant) throw new Error('Merchant not found');

      const category = await Category.findById(new ObjectId(categoryId));
      if (!category) throw new Error('Category not found');

      let imageUrl = null;
      if (image) {
        const { createReadStream, mimetype } = await image;
        
        if (!['image/jpeg', 'image/png'].includes(mimetype)) {
          throw new Error("Invalid image format. Only JPEG and PNG are allowed.");
        }

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

      const newProduct = new Product({
        name,
        price,
        category: new ObjectId(categoryId),
        image: imageUrl,
        isActive: true,
        merchant: new ObjectId(merchantId),
      });
      await newProduct.save();

      merchant.menu.push(newProduct._id);
      await merchant.save();

      return {
        ...newProduct.toObject(),
        id: newProduct._id.toString(),
      };
    },

    updateProduct: async (_, { productId, name, price, categoryId, isActive, image }) => {
      const product = await Product.findById(new ObjectId(productId));
      if (!product) throw new Error('Product not found');

      if (name) product.name = name;
      if (price) product.price = price;
      if (categoryId) product.category = new ObjectId(categoryId);
      if (typeof isActive === 'boolean') product.isActive = isActive;

      if (image) {
        const { createReadStream, mimetype } = await image;

        if (!['image/jpeg', 'image/png'].includes(mimetype)) {
          throw new Error("Invalid image format. Only JPEG and PNG are allowed.");
        }

        const stream = createReadStream();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) reject(error);
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
      };
    },

    deleteProduct: async (_, { productId }) => {
      const product = await Product.findByIdAndDelete(new ObjectId(productId));
      if (!product) throw new Error('Product not found');

      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

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
