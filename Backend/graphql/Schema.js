// const { gql } = require("apollo-server-express");

// const typeDefs = gql`
//   scalar Upload

//   type Address {
//     id: ID!
//     street: String!
//     city: String!
//     province: String!
//     zipcode: String!
//   }

//   input AddressInput {
//     street: String!
//     city: String!
//     province: String!
//     zipcode: String!
//   }

//   type Restaurant {
//     id: ID!
//     restaurantName: String!
//     address: Address!
//     phone: String!
//     registrationNumber: String!
//   }

//   type Merchant {
//     id: ID!
//     user: User!
//     restaurantName: String
//     menu: [Product!]!
//     address: Address!
//     phone: String!
//     registrationNumber: String!
//     name: String!
// }

//   type Product {
//     id: ID!
//     name: String!
//     price: Float!
//     category: Category!
//     reviews: [Review!]
//     isActive: Boolean!
//     image: String
//     merchant: Merchant
//   }

//   type Category {
//     id: ID!
//     name: String!
//     image: String
//     productCount: Int
//   }

//   type Review {
//     user: String!
//     comment: String!
//     rating: Int!
//   }

//   type Customer {
//     id: ID!
//     user: User!
//     address: Address!
//   }

//   type OrderProduct {
//     productId: ID!
//     name: String!
//     price: Float!
//     quantity: Int!
//     merchantId: ID!
//   }

//   type Order {
//     id: ID!
//     customerId: ID!
//     products: [OrderProduct!]!
//     totalAmount: Float!
//     status: String!
//     shippingAddress: Address!
//     paymentMethod: String!
//     createdAt: String!
//   }

//   input OrderProductInput {
//     productId: ID!
//     name: String!
//     price: Float!
//     quantity: Int!
//     merchantId: ID!
//   }

//   type User {
//     id: ID!
//     username: String!
//     role: String!
//     email: String
//     phone: String
//     profilePic: String
//   }

//   type ContactUsAdmin {
//     id: ID!
//     name: String!
//     email: String!
//     subject: String!
//     message: String!
//     createdAt: String!
//   }

//   input ProductFilterInput {
//     category: ID
//     searchTerm: String
//     isActive: Boolean
//   }

//   input PaginationInput {
//     skip: Int
//     limit: Int
//   }

//   type Query {
//     hello: String
//     users: [User!]!
//     user(id: ID!): User
//     contactMessages: [ContactUsAdmin!]!
//     orders: [Order!]!
//     merchants: [Merchant!]!
//     merchant(userId: ID!): Merchant
//     customer(userId: ID!): Customer
//     userCount: Int!
//     adminCount: Int!
//     merchantCount: Int!
//     customerCount: Int!
//     merchantMenu(merchantId: ID!): [Product!]!
//     merchantMenuList(merchantId: ID!): [Product!]!
//     getOrdersByMerchant(merchantId: ID!): [Order!]!
//     getMerchantOrders(merchantId: ID!): [Order!]!
//     categories: [Category!]!
//     products(filter: ProductFilterInput, pagination: PaginationInput): [Product!]!
//     product(id: ID!): Product
//     merchantByUserId(userId: ID!): Merchant
//     getOrderHistory(customerId: ID!): [Order!]!
//     getOrderById(orderId: ID!): Order!
//     topBrands: [Merchant!]!  # <-- Ensure this is correctly defined
//   }

//   type Mutation {
//     updateOrderStatusByMerchant(orderId: ID!, status: String!): Order!
//     uploadProfilePic(userId: ID!, file: String!): User!
//     removeProfilePic(userId: ID!): User!
//     signup(
//       username: String!
//       password: String!
//       role: String!
//       email: String
//       phone: String
//       street: String
//       city: String
//       province: String
//       zipcode: String
//       restaurantName: String
//       registrationNumber: String
//     ): User!
//     login(username: String!, password: String!): User!
//     deleteUser(id: ID!): User!
//     updatePassword(id: ID!, newPassword: String!): User!
//     submitContactForm(
//       name: String!
//       email: String!
//       subject: String!
//       message: String!
//     ): ContactUsAdmin!
//     addOrder(
//       userId: ID!
//       items: [String!]!
//       total: Float!
//       status: String!
//     ): Order!
//     addMerchant(
//       userId: ID!
//       restaurantName: String!
//       menu: [String!]!
//       address: String!
//       phone: String!
//       registrationNumber: String!
//     ): Merchant!
//     addProduct(userId: ID!, name: String!, price: Float!, categoryId: ID!, image: String): Product!
//     updateProduct(
//       productId: ID!
//       name: String
//       price: Float
//       categoryId: ID
//       isActive: Boolean
//       image: String
//     ): Product!
//     deleteProduct(productId: ID!): Boolean!
//     addCategory(name: String!, image: String): Category
//     updateCategory(categoryId: ID!, name: String, image: String): Category
//     deleteCategory(categoryId: ID!): Boolean
//     createOrder(customerId: ID!, products: [OrderProductInput!]!, totalAmount: Float!, shippingAddress: AddressInput!, paymentMethod: String!): Order!
//     updateOrderStatus(orderId: ID!, status: String!): Order!
//   }
// `;

// module.exports = typeDefs;

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type Address {
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
    photo: String
    registrationNumber: String!
    isActive: Boolean!
    merchant: Merchant
  }

  type Merchant {
    id: ID!
    name: String!
    user: User!
    restaurant: Restaurant
    isActive: Boolean!
    menu: [Product!]!
    orders: [Order!]!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
    ingredients: [String]
    description: String
    discount: Float
    tags: [String]
    isVeg: Boolean!
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

  type OrderProduct {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
    merchantId: ID!
    restaurantName: String
    restaurantAddress: Address
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
    quantity: Int!
    merchantId: ID!
    restaurantName: String
    restaurantAddress: AddressInput
  }

  type User {
    id: ID!
    username: String!
    role: String!
    email: String
    phone: String
    profilePic: String
  }

  type Customer {
    id: ID!
    user: User!
    address: Address!
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
    isVeg: Boolean
  }

  input PaginationInput {
    skip: Int
    limit: Int
  }

  type AuthPayload {
    token: String!
    user: User!
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
    topBrands: [Merchant!]!
    restaurants: [Restaurant!]!
    restaurant(id: ID!): Restaurant!
  }

  type Mutation {
    updateOrderStatusByMerchant(orderId: ID!, status: String!): Order!
    uploadProfilePic(userId: ID!, file: String!): User!
    removeProfilePic(userId: ID!): User!
     signup(
      username: String!
      password: String!
      role: String!
      email: String!
      phone: String
      street: String
      city: String
      province: String
      zipcode: String
      restaurantName: String
      registrationNumber: String
    ): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    deleteUser(id: ID!): User!
    updatePassword(id: ID!, newPassword: String!): User!
    submitContactForm(
      name: String!
      email: String!
      subject: String!
      message: String!
    ): ContactUsAdmin!
    addOrder(
      customerId: ID!
      products: [OrderProductInput!]!
      totalAmount: Float!
      shippingAddress: AddressInput!
      paymentMethod: String!
    ): Order!
    updateOrderStatus(orderId: ID!, status: String!): Order!
    addMerchant(
      userId: ID!
      name: String!
      restaurantName: String!
      registrationNumber: String!
      isActive: Boolean!
      photo: String
    ): Merchant!
    toggleMerchantStatus(merchantId: ID!, isActive: Boolean!): Merchant!
    editMerchant(
      merchantId: ID!,
      name: String,
      userId: ID,
      restaurantId: ID,
      isActive: Boolean
    ): Merchant!
    addRestaurant(
      merchantId: ID!,
      restaurantName: String!,
      restaurantAddress: AddressInput,
      photo: Upload
    ): Restaurant!
    updateRestaurant(
      id: ID!,
      restaurantName: String,
      restaurantAddress: AddressInput,
      photo: Upload,
      isActive: Boolean
    ): Restaurant!
    deleteRestaurant(id: ID!): Boolean
    addCategory(name: String!, image: String): Category
    updateCategory(categoryId: ID!, name: String, image: String): Category
    deleteCategory(categoryId: ID!): Boolean
    addProduct(
      userId: ID!,
      name: String!,
      price: Float!,
      categoryId: ID!,
      image: Upload,
      ingredients: [String],
      description: String,
      discount: Float,
      tags: [String],
      isVeg: Boolean
    ): Product!
    updateProduct(
      productId: ID!,
      name: String,
      price: Float,
      categoryId: ID,
      isActive: Boolean,
      image: Upload,
      ingredients: [String],
      description: String,
      discount: Float,
      tags: [String],
      isVeg: Boolean
    ): Product!
    deleteProduct(productId: ID!): Boolean!
    createOrder(
      customerId: ID!
      products: [OrderProductInput!]!
      totalAmount: Float!
      shippingAddress: AddressInput!
      paymentMethod: String!
    ): Order!
    registerMerchant(
      name: String!
      userId: ID!
      restaurantId: ID!
    ): Merchant!
  }
`;

module.exports = typeDefs;
