const Category = require("../../models/Category");
const cloudinary = require('../../config/cloudinary');

const categoryResolvers = {
  Query: {
    categories: async () => {
      const categories = await Category.find({});
      return categories.map(category => ({
        ...category.toObject(),
        id: category._id.toString(),
      }));
    },
  },
  Mutation: {
    addCategory: async (_, { name, image }) => {
      let imageUrl = null;

      if (image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            upload_preset: 'bdox1lbn' // Your Cloudinary upload preset
          });
          imageUrl = uploadResult.secure_url;
        } catch (err) {
          console.error("File upload error:", err);
          throw new Error("File upload failed.");
        }
      }

      const newCategory = new Category({
        name,
        image: imageUrl
      });
      await newCategory.save();

      return {
        ...newCategory.toObject(),
        id: newCategory._id.toString(),
      };
    },

    updateCategory: async (_, { categoryId, name, image }) => {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error('Category not found');

      if (name) category.name = name;
      if (image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            upload_preset: 'bdox1lbn' // Your Cloudinary upload preset
          });
          category.image = uploadResult.secure_url;
        } catch (err) {
          console.error("File upload error:", err);
          throw new Error("File upload failed.");
        }
      }

      await category.save();
      return {
        ...category.toObject(),
        id: category._id.toString(),
      };
    },

    deleteCategory: async (_, { categoryId }) => {
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) throw new Error('Category not found');
      return true;
    },
  }
};

module.exports = categoryResolvers;
