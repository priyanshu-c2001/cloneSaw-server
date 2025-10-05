const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);