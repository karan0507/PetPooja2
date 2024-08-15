const Restaurant = require('../../models/Restaurant');
const Merchant = require('../../models/Merchant');

const restaurantResolvers = {
  Query: {
    restaurants: async () => {
      try {
        const restaurants = await Restaurant.find().populate('merchant');
        return restaurants.map(restaurant => ({
          ...restaurant.toObject(),
          id: restaurant._id.toString(),
        }));
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw new Error('Failed to fetch restaurants');
      }
    },
    restaurant: async (_, { id }) => {
      try {
        const restaurant = await Restaurant.findById(id).populate('merchant');
        if (!restaurant) throw new Error('Restaurant not found');
        return {
          ...restaurant.toObject(),
          id: restaurant._id.toString(),
        };
      } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        throw new Error('Failed to fetch restaurant by ID');
      }
    },
  },
  Mutation: {
    addRestaurant: async (_, { merchantId, restaurantName, restaurantAddress, photo }) => {
      try {
        const merchant = await Merchant.findById(merchantId);
        if (!merchant) throw new Error('Merchant not found');

        const newRestaurant = new Restaurant({
          restaurantName,
          restaurantAddress,
          photo,
          merchant: merchantId,
        });

        await newRestaurant.save();
        return {
          ...newRestaurant.toObject(),
          id: newRestaurant._id.toString(),
        };
      } catch (error) {
        console.error('Error adding restaurant:', error);
        throw new Error('Failed to add restaurant');
      }
    },
    updateRestaurant: async (_, { id, restaurantName, restaurantAddress, photo, isActive }) => {
      try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) throw new Error('Restaurant not found');

        if (restaurantName) restaurant.restaurantName = restaurantName;
        if (restaurantAddress) restaurant.restaurantAddress = restaurantAddress;
        if (photo) restaurant.photo = photo;
        if (typeof isActive === 'boolean') restaurant.isActive = isActive;

        await restaurant.save();
        return {
          ...restaurant.toObject(),
          id: restaurant._id.toString(),
        };
      } catch (error) {
        console.error('Error updating restaurant:', error);
        throw new Error('Failed to update restaurant');
      }
    },
    deleteRestaurant: async (_, { id }) => {
      try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) throw new Error('Restaurant not found');

        await restaurant.deleteOne();
        return true;
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        throw new Error('Failed to delete restaurant');
      }
    },
  },
};

module.exports = restaurantResolvers;
