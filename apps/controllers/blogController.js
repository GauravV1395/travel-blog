const express = require('express');
const router = express.Router();
const { Blog } = require('../models/blog');
const { authenticateUser, authorizeUser } = require('../middlewares/authentication');
const { validateID } = require('../middlewares/utilities');


// show all blogs

router.get('/', (req, res) => {
    Blog.find().then((blog) => {
        res.send(blog);
    }).catch((err) => {
        res.send(err);
    });
});

// admin can delete the blog

// router.delete('/:id', authenticateUser, authorizeUser, (req, res) => {
//     let id = req.params.id;
//     let user = req.locals.user;
//     console.log(user);
//     Blog.findByIdAndRemove(id).then((blog) => {
//         res.send({ notice: "successfully removed." });
//     }).catch((err) => {
//         res.send(err);
//     });
// });

module.exports = {
    blogController: router
}