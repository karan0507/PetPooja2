const Category = require("../../models/Category");
const cloudinary = require('../../config/cloudinary');

const categoryResolvers = {
  Query: {
    categories: async () => {
      try {
        const categories = await Category.find({});
        return categories.map(category => ({
          ...category.toObject(),
          id: category._id.toString(),
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
      }
    },
  },
  Mutation: {
    addCategory: async (_, { name, image }) => {
      let imageUrl = null;

      if (image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            upload_preset: 'bdox1lbn'
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

      try {
        await newCategory.save();
        return {
          ...newCategory.toObject(),
          id: newCategory._id.toString(),
        };
      } catch (error) {
        console.error("Error saving category:", error);
        throw new Error("Failed to save category");
      }
    },

    updateCategory: async (_, { categoryId, name, image }) => {
      try {
        const category = await Category.findById(categoryId);
        if (!category) throw new Error('Category not found');

        if (name) category.name = name;
        if (image) {
          try {
            const uploadResult = await cloudinary.uploader.upload(image, {
              upload_preset: 'bdox1lbn'
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
      } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
      }
    },

    deleteCategory: async (_, { categoryId }) => {
      try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) throw new Error('Category not found');
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
      }
    },
  }
};

module.exports = categoryResolvers;
