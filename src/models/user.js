const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email format is Incorrect...!! " + email);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(passcode) {
            if (!validator.isStrongPassword(passcode)) {
                throw new Error("Entered passcode is weak...!!" + passcode);
            }
        },
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);

    return isPasswordValid;
}

const User=mongoose.model('User', userSchema);

module.exports = { User };