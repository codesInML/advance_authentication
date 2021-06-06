const mongoose = require('mongoose');
const crypto = require('crypto');
const {generatePassword, validatePassword} = require('../library/password_utils');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"]
    },
    password: {
        type: Object,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }

    this.password = generatePassword(this.password)
    next();
});

UserSchema.methods.matchPasswords = async function (password) {
    return await validatePassword(password, this.password.hash, this.password.salt)
}

UserSchema.methods.getSignedToken = function () {
    // jwt.sign(payload, secret)
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getRestPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + (10 * (60 * 1000));
    
    return resetToken
}

const User = mongoose.model("User", UserSchema);

module.exports = User;