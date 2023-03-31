var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var BrandSchema = new mongoose.Schema({
    brandNo: Number,
    name: String
});

var Brand = mongoose.model('brand', BrandSchema);
module.exports = Brand;
