const { gql } = require('apollo-server-express');

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
    menu: [String!]!
    address: Address!
    phone: String!
    registrationNumber: String!
  }

  type Customer {
    id: ID!
    user: User!
    address: Address!
  }

  type Order {
    id: ID!
    user: User!
    items: [String!]!
    total: Float!
    status: String!
    createdAt: String!
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

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
    contactMessages: [ContactUsAdmin!]!
    orders: [Order!]!
    merchants: [Merchant!]!
    merchant(userId: ID!): Merchant
    customer(userId: ID!): Customer
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
    submitContactForm(name: String!, email: String!, subject: String!, message: String!): ContactUsAdmin!
    addOrder(userId: ID!, items: [String!]!, total: Float!, status: String!): Order!
    addMerchant(userId: ID!, restaurantName: String!, menu: [String!]!, address: String!, phone: String!, registrationNumber: String!): Merchant!
    updateOrderStatus(id: ID!, status: String!): Order!
  }
`;

module.exports = typeDefs;
