const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema ({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    created_at : {
        type: Date,
        default: Date.now
    },

    article : {
        type: String,
        minlength: 10,
        maxlength: 1000,
        required: true
    },

})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {
    Blog,
    blogSchema
}
