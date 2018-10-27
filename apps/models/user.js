const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {blogSchema} = require('../models/blog');

const userSchema = new Schema({
    userName: {
        type: String,
        minlength: 3,
        maxlength: 64,
        unique: true,
        required: true
    },

    about: {
        type: String,
        minlength: 5,
        maxlength: 500,
        required: true
    },

    mobileNumber: {
        type: Number,
        min: 10,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator : function (value) {
                return validator.isEmail(value);
            },
            messaage: function() {
                return 'invalid email format.';
            }
        }
    },

    password: {
        type: String,
        minlength: 8,
        maxlength: 128,
        required: true
    },

    tokens: [{
        token: {
            type: String
        }
    }],

    role : {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },

    blogs : [blogSchema]

}) 

userSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(user.password, salt).then((hashed) => {
            user.password = hashed;
            next();
        });
    });
});

userSchema.methods.shortInfo = function () {
    return {
        _id: this.id,
        userName: this.userName,
        email: this.email
    };
};

userSchema.methods.generateToken = function (next) {
    let user = this;
    let tokenData = {
        _id: user.id
    };

    let token = jwt.sign(tokenData, 'supersecret');
    user.tokens.push({
        token
    });

    return user.save().then(() => {

        return token;
    });
}

userSchema.statics.findByToken = function (token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }

    return User.findOne({
        '_id' : tokenData._id,
        'tokens.token': token
    }).then((user) => {
        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject(user);
        }
    })
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}