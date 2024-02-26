var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var VendorSchema = new mongoose.Schema({
    vendorNo: Number,
    name: String,
    mobile: {
      type: String,
      default: ""
    },
    
  vendorBrands: {
    type: Array,
    default: [],
  }
});

var Vendor = mongoose.model('vendor', VendorSchema);
module.exports = Vendor;
