var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var CategorySchema = new mongoose.Schema({
    categoryNo: Number,
    categoryNo: String,
    img: String,

    name: {
        type: String,
        default: ""
    },
    nameE: {
        type: String,
        default: ""
    },
    URLname: {
        type: String,
        default: ""
    },
    parent: {
        type: String,
        default: "/"
    },
    category: {
        type: String,
        default: "/"
    },
    grade: {
        type: Number,
        default: 0
    } ,
});

var Category = mongoose.model('category', CategorySchema);
module.exports = Category;
