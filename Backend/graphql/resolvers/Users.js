const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const userResolvers = {
    Query: {
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                throw new Error('Error fetching users');
            }
        },
        user: async (_, { id }) => {
            try {
                const user = await User.findById(id);
                if (!user) {
                    throw new UserInputError('User not found');
                }
                return user;
            } catch (error) {
                throw new Error('Error fetching user');
            }
        }
    },
    Mutation: {
        signup: async (_, { username, email, password, role, phone, street, city, province, zipcode, restaurantName, registrationNumber }) => {
            const { valid, errors } = validateRegisterInput(username, email, password);
            if (!valid) {
                throw new UserInputError('Validation errors', { errors });
            }
        
            try {
                // Check if the username already exists
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new UserInputError('Username is already taken. Please choose a different one.');
                }
        
                // Check if the email already exists
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    throw new UserInputError('Email is already registered. Please use a different one.');
                }
        
                const userFields = {
                    username,
                    email,
                    password,  // Store plain text password (NOT recommended)
                    role,
                    phone,
                    street,
                    city,
                    province,
                    zipcode,
                };
        
                if (role === 'Merchant') {
                    userFields.restaurantName = restaurantName;
                    userFields.registrationNumber = registrationNumber;
                }
        
                const newUser = new User(userFields);
                await newUser.save();
        
                // Generate JWT Token
                const token = jwt.sign(
                    { userId: newUser.id, email: newUser.email, role: newUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
        
                return { token, user: newUser };  // Return token and user data
            } catch (error) {
                if (error.code === 11000) {
                    // Handle duplicate key error
                    throw new UserInputError('Username or Email is already taken. Please choose a different one.');
                } else {
                    console.error('Error during user registration:', error);
                    throw new Error('Error registering user');
                }
            }
        },
        
        login: async (_, { username, password }) => {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                console.log('Validation failed:', errors);
                throw new UserInputError('Validation errors', { errors });
            }
        
            try {
                console.log('Received username:', username);
                console.log('Received password:', password);
        
                const user = await User.findOne({ username });
                if (!user) {
                    console.log('User not found with username:', username);
                    throw new UserInputError('User not found, Please SignUp', {
                        errors: {
                            username: 'No user found with this username',
                        },
                    });
                }
        
                if (user.password !== password) {
                    console.log('Invalid password provided for username:', username);
                    throw new UserInputError('Invalid password', {
                        errors: {
                            password: 'Incorrect password',
                        },
                    });
                }
        
                // If password is valid, generate JWT token
                const token = jwt.sign(
                    { userId: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
        
                console.log('Login successful for user:', username);
                return { token, user };
            } catch (error) {
                console.error('Error during login process:', error);
                if (error instanceof UserInputError) {
                    throw error;
                } else {
                    throw new Error('An unexpected error occurred during login');
                }
            }
        },
    }        
};

module.exports = userResolvers;
