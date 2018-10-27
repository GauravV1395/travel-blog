const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/blog-data', { useNewUrlParser: true}).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log(err);
});

module.exports = {
    mongoose
}