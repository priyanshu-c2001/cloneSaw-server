const express = require('express');
const publicRouter = express.Router();

const { getAllPosts, getASingleBlogPost } = require('../controllers/publicControllers');

publicRouter.get('/', getAllPosts);

publicRouter.get('/:id', getASingleBlogPost);

module.exports = publicRouter;