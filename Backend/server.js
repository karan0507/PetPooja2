const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./graphql/Schema');
const resolvers = require('./graphql/resolvers/index');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const startServer = async () => {
  const app = express();

  app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }

  app.use(graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 1 }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      User: require('./models/User'),
    }),
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
