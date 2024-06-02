const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/Schema');
const resolvers = require('./graphql/resolvers');
const dotenv = require('dotenv');

dotenv.config();

const startServer = async () => {
  const app = express();

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 5000 }, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`)
  );
};

startServer();
