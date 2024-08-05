const Category = require("../../models/Category");
const { GraphQLUpload } = require('graphql-upload');
const cloudinary = require('../../config/cloudinary');

const categoryResolvers = {
  Upload: GraphQLUpload,
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
        const { createReadStream, mimetype } = await image;

        // Log the received MIME type for debugging
        console.log(`Received file of type: ${mimetype}`);

        // Validate image type
        if (!['image/jpeg', 'image/png'].includes(mimetype)) {
          throw new Error("Invalid image format. Only JPEG and PNG are allowed.");
        }

        try {
          const stream = createReadStream();
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(new Error("Cloudinary upload failed."));
              }
              resolve(result);
            });
            stream.pipe(uploadStream);
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
        const { createReadStream, mimetype } = await image;

        // Log the received MIME type for debugging
        console.log(`Received file of type: ${mimetype}`);

        // Validate image type
        if (!['image/jpeg', 'image/png'].includes(mimetype)) {
          throw new Error("Invalid image format. Only JPEG and PNG are allowed.");
        }

        try {
          const stream = createReadStream();
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(new Error("Cloudinary upload failed."));
              }
              resolve(result);
            });
            stream.pipe(uploadStream);
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
