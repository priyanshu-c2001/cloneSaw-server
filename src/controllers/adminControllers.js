const { User } = require("../models/user");
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const validator = require('validator');

const signUp = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Format of emailId is Incorrect!!");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            emailId,
            password: hashedPassword,

        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        }).status(201).json({ msg: "User Added successfully!", data: savedUser });
    } catch (err) {
        res.status(400).json({ msg: "Error saving the user:" + err.message });
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Format of emailId is Incorrect!!");
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) throw new Error("Invalid Credentials..!!!");

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) throw new Error("Invalid Credentials..!!!");

        const token = await user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        }).status(200).json({ data: user });
    }
    catch (err) {
        res.status(401).json({ msg: "ERROR : " + err.message });
    }
}

const logOut = (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now())
    }).status(200).json({ msg: "Logged out Successfully..!!!" });
}

const createPost = async (req, res) => {
    const { title, author, content, imageUrl } = req.body;

    if (!title || !author || !content) {
        return res.status(400).json({ message: 'Title, author, and content are required.' });
    }

    try {
        const newPost = new Post({ title, author, content, imageUrl });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}

const editPost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
}

const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}

module.exports = { signUp, login, createPost, editPost, deletePost, logOut };