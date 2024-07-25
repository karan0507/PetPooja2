const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const typeDefs = require('./graphql/Schema');
const resolvers = require('./graphql/resolvers');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const startServer = async () => {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: 'http://localhost:3000', // Your frontend origin
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

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Enable file uploads
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Define a simple test route to ensure server is working
  app.get('/food', (req, res) => {
    res.send('Food endpoint is working!');
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      User: require('./models/User'), 
    }),
  });

  await server.start();

  // Apply Apollo GraphQL middleware and set the path to /graphql
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
