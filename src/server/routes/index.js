const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');
const pagesController = require('../controllers/pagesController');

// Define your routes
router.get('/home', pagesController.homePageController);

router.get('/admin',authMiddleware, pagesController.adminPageController);

router.get('/article/:id', pagesController.articlePageController);

router.get('/edit/:id', pagesController.editPageController);

router.get('/new', pagesController.addPageController);


// Export the router
module.exports = router;