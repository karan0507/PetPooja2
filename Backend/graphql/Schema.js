const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
  }

  type ContactUsAdmin {
    _id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    createdAt: String!
  }

  type Query {
    hello: String
    users: [User!]!
  }

  type Mutation {
    signup(
      username: String!,
      password: String!,
      role: String!,
      email: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      zipcode: String,
      restaurantName: String,
      registrationNumber: String
    ): User
    login(username: String!, password: String!): User
    deleteUser(id: ID!): User
    updatePassword(id: ID!, newPassword: String!): User

    submitContactForm(name: String!, email: String!, subject: String!, message: String!): ContactUsAdmin!
  }
`;

module.exports = typeDefs;
