
const express = require('express');
const Router = express.Router();
const blogsController = require('../controllers/blogsController.js');

// defince the api routes

Router.get('/blogs',blogsController.getBlogsController);
Router.post('/blogs',blogsController.postBlogController);
Router.get('/blogs/:id',blogsController.getBlogsByIDController);
Router.delete("/blogs/:id", blogsController.deleteBlogController);
Router.put('/blogs/:id', blogsController.updateBlogController);

module.exports = Router