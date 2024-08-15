const userResolvers = require("./Users.js");
const productResolvers = require('./Product');
const categoryResolvers = require('./Category');
const OrderResolvers = require("./Order");
const merchantResolvers = require("./Merchant");
const restaurantResolvers = require("./Restaurant"); // Adding restaurantResolvers

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...OrderResolvers.Query,
    ...merchantResolvers.Query,
    ...restaurantResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...OrderResolvers.Mutation,
    ...merchantResolvers.Mutation,
    ...restaurantResolvers.Mutation,
  },
  // Remove this if you don't have a specific resolver for Restaurant
  // Restaurant: restaurantResolvers.Restaurant,
};

module.exports = resolvers;


module.exports = resolvers;
