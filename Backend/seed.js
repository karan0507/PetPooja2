const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path accordingly

mongoose.connect('mongodb://localhost:27017/PetPoojaDB', {
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});

const sampleProducts = [
  {
    name: 'Sample Product 1',
    price: 10.0,
    category: 'Category 1',
    reviews: [],
    isActive: true,
  },
  {
    name: 'Sample Product 2',
    price: 20.0,
    category: 'Category 2',
    reviews: [],
    isActive: true,
  },
];

Product.insertMany(sampleProducts)
  .then(() => {
    console.log('Sample products inserted successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting sample products:', error);
    mongoose.connection.close();
  });
