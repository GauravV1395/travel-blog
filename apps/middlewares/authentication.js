const { User } = require('../models/user');

const authenticateUser = function(req,res,next) {
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        req.locals = {
            user,
            token
        }
        next();
    }).catch((err) => {
        res.status(401).send(err);
    });
}

const authorizeUser = function(req,res,next){
    if(req.locals.user.role == 'admin'){
        next();
    }
        else if (req.locals.user.role == 'user'){
            next();
        } else {
        res.status(403).send('you are not authorized to access this page.');
    }
}

module.exports = {
    authenticateUser,
    authorizeUser
}