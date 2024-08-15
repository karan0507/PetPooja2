const Merchant = require('../../models/Merchant');
const User = require('../../models/User');
const Restaurant = require('../../models/Restaurant');

const merchantResolvers = {
  Query: {
    topBrands: async () => {
      try {
        const merchants = await Merchant.find({ isActive: true })  // Only fetch active merchants
          .populate('user')
          .populate('restaurant');

        const topMerchants = merchants
          .filter(merchant => merchant.restaurant && merchant.restaurant.restaurantName)
          .sort((a, b) => {
            const productsA = a.products || [];
            const productsB = b.products || [];
            return productsB.length - productsA.length;
          })
          .slice(0, 5);

        return topMerchants.map(merchant => ({
          ...merchant.toObject(),
          id: merchant._id.toString(),
          restaurantName: merchant.restaurant.restaurantName,
          photo: merchant.restaurant.photo || null,
        }));
      } catch (error) {
        console.error('Error fetching top brands:', error);
        throw new Error('Error fetching top brands');
      }
    },
  },
  Mutation: {
    registerMerchant: async (_, { name, userId, restaurantId }) => {
      try {
        const existingMerchant = await Merchant.findOne({ restaurant: restaurantId });
        if (existingMerchant) {
          throw new Error('A merchant is already registered with this restaurant.');
        }

        const newMerchant = new Merchant({
          name,
          user: userId,
          restaurant: restaurantId,
        });

        return await newMerchant.save();
      } catch (error) {
        console.error('Error registering merchant:', error);
        throw new Error('Error registering merchant');
      }
    },
    toggleMerchantStatus: async (_, { merchantId, isActive }) => {
      try {
        const merchant = await Merchant.findById(merchantId);
        if (!merchant) {
          throw new Error('Merchant not found.');
        }

        merchant.isActive = isActive;
        await merchant.save();
        return merchant;
      } catch (error) {
        console.error('Error updating merchant status:', error);
        throw new Error('Error updating merchant status');
      }
    },
    editMerchant: async (_, { merchantId, name, userId, restaurantId, isActive }) => {
      try {
        const merchant = await Merchant.findById(merchantId);
        if (!merchant) {
          throw new Error('Merchant not found.');
        }

        if (name) merchant.name = name;
        if (userId) merchant.user = userId;
        if (restaurantId) merchant.restaurant = restaurantId;
        if (isActive !== undefined) merchant.isActive = isActive;

        await merchant.save();
        return merchant;
      } catch (error) {
        console.error('Error editing merchant:', error);
        throw new Error('Error editing merchant');
      }
    },
  },
  Merchant: {
    user: async (parent) => {
      return await User.findById(parent.user);
    },
    restaurant: async (parent) => {
      return await Restaurant.findById(parent.restaurant);
    },
  },
};

module.exports = merchantResolvers;
