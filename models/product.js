var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var ProductSchema = new mongoose.Schema({
    productNo: Number,
    img: String,
    group: {
      type: Boolean,
      default: false
    },
    variant: {
      type: Boolean,
      default: false
    },
    name: {
        type: String,
        default: ""
    },
    variantName: {
        type: String,
        default: ""
    },
    arabicName: {
        type: String,
        default: ""
    },
    SKU: String,
    colortype: {
        type: Number,
        default: 0
    } ,
    cost: {
        type: Number,
        default: 0
    } ,
    price: {
        type: Number,
        default: 0
    } ,
    upsell: {
        type: Number,
        default: 0
    } ,
    sellCount: {
        type: Number,
        default: 0
    } ,
    quantity: {
        type: Number,
        default: 0
    } ,
    warranty: {
        type: Number,
        default: 0
    } ,
    naseem: {
        type: Number,
        default: 0
    } ,
    qurain: {
        type: Number,
        default: 0
    } ,
    package: {
        type: Number,
        default: 0
    } ,
    discountPrice: {
        type: Number,
        default: 0
    } ,
    beforePrice: {
        type: Number,
        default: 0
    } ,
    category: {
        type: String,
        default: ""
    },
    categoryName: {
        type: String,
        default: ""
    },
    categoryNo: {
        type: String,
        default: ""
    },
    brand: {
        type: String,
        default: ""
    },
    brandName: {
        type: String,
        default: ""
    },
    vendor: {
        type: String,
        default: ""
    },
    vendorName: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    } ,
    SubProductId: {
        type: Array,
        default: ""
    } ,
    SuperProductID: {  
        type: String,
        default: "-"
    } ,
    Size: {  
        type: String,
        default: "-"
    } ,
    Dim: {  
        type: String,
        default: "-"
    } ,
    Water: {  
        type: String,
        default: "-"
    } ,
    description: {  
        type: String,
        default: "-"
    } ,
});

var Product = mongoose.model('product', ProductSchema);
module.exports = Product;
