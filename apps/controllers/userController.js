const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');
const { authorizeUser } = require('../middlewares/authentication');
const _ = require('lodash');
const { Blog } = require('../models/blog');
const { validateID} = require('../middlewares/utilities');



// to create the user.

router.post('/', (req,res) => {
    let body = _.pick(req.body, ['userName', 'password', 'email', 'mobileNumber', 'about']);
    let user = new User(body);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.send(err);
    });
});

// to delete the user

router.delete('/logout', authenticateUser, (req,res) => {
    let user = req.locals.user;
    let token = req.locals.token;
    let activeToken = user.tokens.find(function (inDbToken) {
        return inDbToken.token == token;
    });
    user.tokens.id(activeToken._id).remove();
    user.save().then((user) => {
        res.send();
    }).catch((err) => {
        res.send(err);
    });
});

// to get all the blogs written by the user.

router.get('/blogs', authenticateUser, (req,res) => {
    res.send(req.locals.user.blogs);
});

// to post a blog.

router.post('/blogs', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let body = req.body;
    let blog = new Blog(body);
    blog.save().then((blog) => {
        user.blogs.push(blog);
        user.save().then((user) => {
            res.send();
        });
        res.send({
            blog,
            notice: "successfully created the blog"
        })
    }).catch((err) => {
        res.send(err);
    });
});

// to get one of his blogs

router.get('/blogs/:id', validateID, authenticateUser, (req, res) => {
    let id = req.params.id;
    let user = req.locals.user;
    let inBlog = user.blogs.find(function(blog) {
        return blog.id == id;
    });
    res.send(inBlog);
});


// for the user to update one of his blog.

router.put('/blogs/:id', validateID, authenticateUser, (req, res) => {
    let blogId = req.params.id;
    let user = req.locals.user;
    let body = req.body;
    let inblogs = user.blogs.find(function(blog){
        return blog._id == blogId;
    })
    console.log(inblogs)
    inblogs.article = body.article;

    user.save().then((user) => {
        res.send();
    });

    Blog.findOneAndUpdate({ _id: blogId }, { $set: body }, { new: true, runValidators: true }).then((blog) => {
        res.send({
            blog,
            notice: "successfully updated the blog."
        })
    }).catch((err) => {
        res.send(err);
    });
});

//to delete the blog

router.delete('/blogs/:id', validateID, authenticateUser, authorizeUser, (req,res) => {
    let blogId = req.params.id;
    let user = req.locals.user;
    user.blogs.id(blogId).remove();
    user.save().then((user) => {
        res.send();
    })
    Blog.findByIdAndRemove(blogId).then((blog) => {
        res.send({
            blog,
            notice: "successfully removed the blog."
        });
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = {
    userController : router
}