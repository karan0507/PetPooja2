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

  input AddressInput {
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
    name: String!
  }


  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
    reviews: [Review!]
    isActive: Boolean!
    image: String
    merchant: Merchant
  }

  type Category {
    id: ID!
    name: String!
    image: String
    productCount: Int
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

  type OrderProduct {
  productId: ID!
  name: String!
  price: Float!
  quantity: Int!
  merchantId: ID!
  
}

  type Order {
    id: ID!
    customerId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    status: String!
    shippingAddress: Address!
    paymentMethod: String!
    createdAt: String!
  }

  input OrderProductInput {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
    merchantId: ID!
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
    isActive: Boolean
  }

  input PaginationInput {
    skip: Int
    limit: Int
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
    merchantMenuList(merchantId: ID!): [Product!]!
    getOrdersByMerchant(merchantId: ID!): [Order!]!
    
    getMerchantOrders(merchantId: ID!): [Order!]!
    categories: [Category!]!
    products(filter: ProductFilterInput, pagination: PaginationInput): [Product!]!
    product(id: ID!): Product
    merchantByUserId(userId: ID!): Merchant
    getOrderHistory(customerId: ID!): [Order!]!
    getOrderById(orderId: ID!): Order!
  }

  type Mutation {
    updateOrderStatusByMerchant(orderId: ID!, status: String!): Order!
    uploadProfilePic(userId: ID!, file: String!): User!
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
      items: [String!]!
      total: Float!
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
    
    addProduct(userId: ID!, name: String!, price: Float!, categoryId: ID!, image: String): Product!

    updateProduct(
      productId: ID!
      name: String
      price: Float
      categoryId: ID
      isActive: Boolean
      image: String
    ): Product!
    deleteProduct(productId: ID!): Boolean!
    addCategory(name: String!, image: String): Category
    updateCategory(categoryId: ID!, name: String, image: String): Category
    deleteCategory(categoryId: ID!): Boolean
    createOrder(customerId: ID!, products: [OrderProductInput!]!, totalAmount: Float!, shippingAddress: AddressInput!, paymentMethod: String!): Order!
    updateOrderStatus(orderId: ID!, status: String!): Order!
  }
`;

module.exports = typeDefs;

