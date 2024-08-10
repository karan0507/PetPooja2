const userResolvers = require("./Users.js");
const productResolvers = require('./Product');
const categoryResolvers = require('./Category');
const OrderResolvers = require("./Order");


const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...OrderResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...OrderResolvers.Mutation
  }
};

module.exports = resolvers;
