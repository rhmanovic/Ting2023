var express = require("express");
var router = express.Router();
var Product = require("../../models/product");
var Inventory = require("../../models/inventory");
var Category = require("../../models/category");
var Vendor = require("../../models/vendor");
var Brand = require("../../models/brand");
var Warehouse = require("../../models/warehouse");
var Order = require("../../models/order");
var Purchase = require("../../models/purchase");
var TransferRequest = require("../../models/transferRequest");
var User = require("../../models/user");
var City = require("../../models/city");
var mid = require("../../middleware");
const keys = require("../../config/keys");
const fs = require("fs");

const sharp = require('sharp');



module.exports = router;
