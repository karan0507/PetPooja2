const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type Address {
    id: ID!
    street: String!
    city: String!
    province: String!
    zipcode: String!
  }

  type Restaurant {
    id: ID!
    restaurantName: String!
    address: Address!
    phone: String!
    registrationNumber: String!
  }

  type Merchant {
    id: ID!
    user: User!
    restaurantName: String!
    menu: [Product!]!
    address: Address!
    phone: String!
    registrationNumber: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
    reviews: [Review!]
    isActive: Boolean!
    image: String
  }

  type Category {
    id: ID!
    name: String!
    image: String
  }

  type Review {
    user: String!
    comment: String!
    rating: Int!
  }

  type Customer {
    id: ID!
    user: User!
    address: Address!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    total: Float!
    address: String!
    phone: String!
    email: String!
    status: String!
    createdAt: String!
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
  }

  type User {
    id: ID!
    username: String!
    role: String!
    email: String
    phone: String
    profilePic: String
  }

  type ContactUsAdmin {
    id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    createdAt: String!
  }

  input ProductFilterInput {
    category: ID
    searchTerm: String
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
    contactMessages: [ContactUsAdmin!]!
    orders: [Order!]!
    merchants: [Merchant!]!
    merchant(userId: ID!): Merchant
    customer(userId: ID!): Customer
    userCount: Int!
    adminCount: Int!
    merchantCount: Int!
    customerCount: Int!
    merchantMenu(merchantId: ID!): [Product!]!
    categories: [Category!]!
    products(filter: ProductFilterInput): [Product!]!
  }

  type Mutation {
    uploadProfilePic(userId: ID!, file: Upload!): User!
    removeProfilePic(userId: ID!): User!
    signup(
      username: String!
      password: String!
      role: String!
      email: String
      phone: String
      street: String
      city: String
      province: String
      zipcode: String
      restaurantName: String
      registrationNumber: String
    ): User!
    login(username: String!, password: String!): User!
    deleteUser(id: ID!): User!
    updatePassword(id: ID!, newPassword: String!): User!
    submitContactForm(
      name: String!
      email: String!
      subject: String!
      message: String!
    ): ContactUsAdmin!
    addOrder(
      userId: ID!
      items: [OrderItemInput!]!
      total: Float!
      address: String!
      phone: String!
      email: String!
      status: String!
    ): Order!
    addMerchant(
      userId: ID!
      restaurantName: String!
      menu: [String!]!
      address: String!
      phone: String!
      registrationNumber: String!
    ): Merchant!
    updateOrderStatus(id: ID!, status: String!): Order!
    addProduct(
      merchantId: ID!
      name: String!
      price: Float!
      categoryId: ID!
      image: Upload
    ): Product!
    addCategory(name: String!, image: Upload): Category!
    updateProduct(
      productId: ID!
      name: String
      price: Float
      categoryId: ID
      isActive: Boolean
      image: Upload
    ): Product!
    deleteProduct(productId: ID!): Boolean!
    updateCategory(categoryId: ID!, name: String!, image: Upload): Category!
    deleteCategory(categoryId: ID!): Boolean!
    placeOrder(
      userId: ID!
      items: [OrderItemInput!]!
      total: Float!
      address: String!
      phone: String!
      email: String!
    ): Order!
  }
`;

module.exports = typeDefs;
