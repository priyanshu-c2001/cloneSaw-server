const express = require('express');
const adminRouter = express.Router();
const { auth } = require('../middlewares/auth');
const { signUp, login, logOut, createPost, editPost, deletePost } = require('../controllers/adminControllers');

adminRouter.post('/signup', signUp);
adminRouter.post('/login', login);
adminRouter.post('/logout', logOut);

adminRouter.post('/posts', auth, createPost);
adminRouter.put('/posts/:id', auth, editPost);
adminRouter.delete('/posts/:id', auth, deletePost);

module.exports = adminRouter;
