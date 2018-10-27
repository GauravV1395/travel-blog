const express = require('express');
const router = express.Router();
const { userController } = require('../apps/controllers/userController');
const { blogController } = require('../apps/controllers/blogController');

router.use('/users', userController);

router.use('/blogs', blogController);

module.exports = {
    routes : router
}