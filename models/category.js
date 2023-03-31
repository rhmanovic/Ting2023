var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var CategorySchema = new mongoose.Schema({
    categoryNo: Number,
    img: String,

    name: String
});

var Category = mongoose.model('category', CategorySchema);
module.exports = Category;
