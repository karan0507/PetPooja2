const User = require('../../models/User');
const bcrypt = require('bcryptjs');
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

                // Hash the password before storing
                const hashedPassword = await bcrypt.hash(password, 12);

                const userFields = {
                    username,
                    email,
                    password: hashedPassword,  // Store hashed password
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
                throw new UserInputError('Validation errors', { errors });
            }

            try {
                const user = await User.findOne({ username });
                if (!user) {
                    throw new UserInputError('User not found, Please SignUp', {
                        errors: {
                            username: 'No user found with this username'
                        }
                    });
                }

                // Log the passwords for debugging
                console.log('Plain text password:', password);
                console.log('Hashed password from DB:', user.password);

                const isPasswordValid = await bcrypt.compare(password, user.password); // Compare passwords
                console.log('Is password valid:', isPasswordValid);

                if (!isPasswordValid) {
                    throw new UserInputError('Invalid password', {
                        errors: {
                            password: 'Incorrect password'
                        }
                    });
                }

                // Generate JWT Token
                const token = jwt.sign(
                    { userId: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return { token, user };
            } catch (error) {
                if (error instanceof UserInputError) {
                    throw error;
                } else {
                    console.error('Error during login:', error);
                    throw new Error('An unexpected error occurred during login');
                }
            }
        }
    }
};

module.exports = userResolvers;
