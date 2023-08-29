var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var ChargeSchema = new mongoose.Schema({
    ProductIDs : Array,
    Quantity : Array,
    Price : Array, 
    Name : Array, 
    CustomerID : String,
    CustomerName : String,
    TotalPrice : Number, 
    Email : String, 
    Mobile : String, 
    Address : String, 
    Status : String, 
    charge : String, 
    InternalChgId : String, 
    // this will create date automaticaly so I can qurey by date.
    time : { type : Date, default: Date.now }, 
});

var Charge = mongoose.model('charge', ChargeSchema);
module.exports = Charge;


