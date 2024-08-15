const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['Customer', 'Merchant', 'Admin'],
        default: 'Customer'  // Updated default value to match the enum
    },
    phone: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    zipcode: {
        type: String,
    },
    restaurantName: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the updatedAt field automatically
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to hash the password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         return next(err);
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
