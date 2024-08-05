const userResolvers = require("./Users.js");
const productResolvers = require('./Product');
const categoryResolvers = require('./Category');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
  }
};

module.exports = resolvers;
