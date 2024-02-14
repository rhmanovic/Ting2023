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

var nodemailer = require("nodemailer");

router.post("/SiteImages", mid.requiresAdmin, function (req, res, next) {
  const { toedit } = req.query;
  const myFile = req.body.myFile;

  console.log("SiteImages called");

  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file) {
        const filename = req.file.filename;

        console.log("filename");
        console.log(filename);

        SiteImages[toedit] = filename;

        // Write the updated SiteData object to the data.json file
        try {
          fs.writeFileSync(
            "data/SiteImages.json",
            JSON.stringify(SiteImages),
            "utf8",
          );
          res.redirect("/SiteImages");
        } catch (error) {
          next(error);
        }

        // return res.render("manager", { title: '', fileLInk: fileLInk });
      } else {
        res.send(`Error: No file selected`);
      }
    }
  });
});

const multer = require("multer");
var path = require("path");

router.get(
  "/brandPage/:brandId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { brandId } = req.params;

    Brand.findOne({ _id: brandId }).exec(function (error, brandData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/brandPage", {
          title: "brandPage",
          brandData: brandData,
        });
      }
    });
  },
);

router.get(
  "/categoryPage/:categoryId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { categoryId } = req.params;

    Category.findOne({ _id: categoryId }).exec(function (error, categoryData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/categoryPage", {
          title: "categoryPage",
          categoryData: categoryData,
        });
      }
    });
  },
);

// dublicted in app an admin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img/upload"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});
// init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // this Number is Bytes //it's error msg not OK
  fileFilter: function (req, file, cb) {
    chickFileType(file, cb);
  },
}).single("myFile");

function chickFileType(file, cb) {
  // allowed Extensions
  const fileType = /jpeg|jpg|png|gif|mp4/; // need to be modified for videos
  // check ext
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  // check mime
  const mimetype = fileType.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // null of error, true for call back
  } else {
    cb("Error: Images Only!"); // need to be modified for videos
  }
}

router.get("/", mid.requiresSaleseman, function (req, res, next) {
  return res.render("manager/index", { title: "Home" });
});

router.get("/posts", mid.requiresSaleseman, function (req, res, next) {
  const referer = req.headers.referer;
  const host = req.headers.host;

  console.log(referer);
  console.log(host);

  Product.find({}).exec(function (error, productData) {
    if (error) {
      return next(error);
    } else {
      var cv = "/img/upload/myFile-1691806589904.jpg";
      var cx = productData[0].img[0];

      console.log(productData[0].img[0]);

      console.log("cv: " + cv);
      console.log("cx: " + cx);

      console.log("cv.split: " + cv.split("/")[3]);
      console.log("cx.split: " + cx.split("/")[3]);

      return res.render("manager/posts", {
        title: "Posts",
        productData: productData,
        host: host,
      });
    }
  });
});

router.get("/products", mid.requiresSaleseman, function (req, res, next) {
  Product.find({}).exec(function (error, productData) {
    if (error) {
      return next(error);
    } else {
      // use later function to make it shorter
      Brand.find({}).exec(function (error, brandData) {
        if (error) {
          return next(error);
        } else {
          Category.find({}).exec(function (error, categoryData) {
            if (error) {
              return next(error);
            } else {
              Warehouse.find({}).exec(function (error, warehouseData) {
                if (error) {
                  return next(error);
                } else {
                  Vendor.find({}).exec(function (error, vendorData) {
                    if (error) {
                      return next(error);
                    } else {
                      return res.render("manager/products", {
                        title: "Product",
                        productData: productData,
                        categoryData: categoryData,
                        warehouseData: warehouseData,
                        brandData: brandData,
                        vendorData: vendorData,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

      // return res.render('products', { title: 'Product', productData: productData});
    }
  });
});

router.get("/inventory", mid.requiresSaleseman, function (req, res, next) {
  Inventory.find({}).exec(function (error, inventoryData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/inventory", {
        title: "Inventory Management",
        inventoryData: inventoryData,
      });
    }
  });
});

router.get(
  "/inventory/:productNo",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { productNo } = req.params;
    Inventory.find({ productNo: productNo }).exec(
      function (error, inventoryData) {
        if (error) {
          return next(error);
        } else {
          return res.render("manager/inventory", {
            title: "Inventory Management",
            inventoryData: inventoryData,
          });
        }
      },
    );
  },
);

router.get("/category", mid.requiresSaleseman, function (req, res, next) {
  Category.find({})
    .sort({ categoryNo: 1 })
    .exec(function (error, categoryData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/category", {
          title: "Category",
          categoryData: categoryData,
        });
      }
    });
});

router.get("/transferRequest", mid.requiresSaleseman, (req, res, next) => {
  TransferRequest.find({}).sort({ _id: -1 }).exec((error, requestData) => {
    if (error) {
      return next(error);
    }
    res.render("manager/transferRequest", {
      title: "Transfer Request",
      requestData: requestData
    });
  });
});

router.get('/approveTransfer/:transferId', mid.requiresSaleseman, function(req, res, next) {
  const { transferId } = req.params;

  TransferRequest.findOne({ _id: transferId }).exec(function(error, transferData) {
    if (error) {
      return next(error);
    } else {
      Inventory.findOneAndUpdate(
        { _id: transferData.inventoryID },
        { $inc: { [transferData.from]: -transferData.quantity, [transferData.to]: transferData.quantity } },
        { new: true }
      ).exec(function(error, inventoryData) {
        if (error) {
          return next(error);
        } else {
          TransferRequest.findOneAndUpdate(
            { _id: transferId },
            { $set: { shopApprove: true, approvedBy: req.session.userName, approveDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)) } },

          ).then(function() {
            res.redirect('/manager/transferRequest');
          }).catch(function(error) {
            return next(error);
          });
        }
      });
    }
  });
});




router.get("/users", mid.requiresAdmin, function (req, res, next) {
  User.find({}).exec(function (error, usersData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/users", {
        title: "Users",
        usersData: usersData,
      });
    }
  });
});

router.get("/userPage/:userId/", mid.requiresAdmin, function (req, res, next) {
  const { userId } = req.params;

  User.findOne({ _id: userId }).exec(function (error, userData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/userPage", {
        title: "User Page",
        userData: userData,
      });
    }
  });
});

router.get("/vendor", mid.requiresAdmin, function (req, res, next) {
  Vendor.find({}).exec(function (error, vendorData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/vendor", {
        title: "Vendor",
        vendorData: vendorData,
      });
    }
  });
});

router.get("/brand", mid.requiresSaleseman, function (req, res, next) {
  Brand.find({}).exec(function (error, brandData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/brand", {
        title: "brand",
        brandData: brandData,
      });
    }
  });
});

router.get(
  "/warehousePage/:warehouseID",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { warehouseID } = req.params;
    Product.find({}).exec(function (error, productData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/warehousePage", {
          title: "Warehouse",
          productData: productData,
        });
      }
    });
  },
);

router.get("/warehouse", mid.requiresSaleseman, function (req, res, next) {
  Product.find({}).exec(function (error, productData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/warehouse", {
        title: "Warehouse",
        productData: productData,
      });
    }
  });
});

router.get("/purchase", mid.requiresSaleseman, async function (req, res, next) {
  try {
    const purchaseData = await Purchase.find({}).sort({ _id: -1 }).exec();
    const vendorData = await Vendor.find({}).exec();
    return res.render("manager/purchase", {
      title: "Purchase",
      purchaseData: purchaseData,
      vendorData: vendorData,
    });
  } catch (error) {
    return next(error);
  }
});


router.get("/order/:sortTo", mid.requiresSaleseman, function (req, res, next) {
  var { sortTo } = req.params;

  if (sortTo == 1) {
    sortTo = "invoice";
  } else if (sortTo == 2) {
    sortTo = "orderNo";
  }

  Order.find({})
    .sort({ [sortTo]: -1 })
    .exec(function (error, orderData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/order", {
          title: "Order",
          orderData: orderData,
        });
      }
    });
});

router.get("/order/:userID", mid.requiresSaleseman, function (req, res, next) {
  const { userID } = req.params;

  Order.find({ userID: userID })
    .sort({ _id: -1 })
    .exec(function (error, orderData) {
      if (error) {
        return next(error);
      } else {
        return res.render("manager/order", {
          title: "Order",
          orderData: orderData,
        });
      }
    });
});

router.get(
  "/orderMobile/:mobile",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { mobile } = req.params;

    Order.find({ mobile: mobile })
      .sort({ _id: -1 })
      .exec(function (error, orderData) {
        if (error) {
          return next(error);
        } else {
          return res.render("manager/order", {
            title: "Order",
            orderData: orderData,
          });
        }
      });
  },
);

router.get(
  "/transferRequest",
  mid.requiresSaleseman,
  function (req, res, next) {
    Product.find({})
      .sort({ _id: 1 })
      .exec(function (error, productData) {
        if (error) {
          return next(error);
        } else {
          console.log(productData);
          return res.render("manager/transferRequest", {
            title: "Transfer Request",
            productData: productData,
          });
        }
      });
  },
);

router.get(
  "/transferSenderApprove/:requstID/:fromName",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { requstID } = req.params;
    const { fromName } = req.params;
    console.log(req.session.userId);

    User.findOne({ _id: req.session.userId }).exec(function (error, userData) {
      if (error) {
        return next(error);
      } else {
        console.log(userData.managerOf);
        console.log(fromName);

        if (fromName == userData.managerOf) {
          console.log("your are the manager of: " + fromName);

          arr_update_dict = { $set: {} };
          arr_update_dict["$set"]["senderApprove"] = true;

          TransferRequest.findOneAndUpdate(
            { _id: requstID },
            arr_update_dict,
          ).then(function () {
            res.redirect("back");
          });
        } else {
          console.log("your are not the manager of: " + fromName);
          var err = new Error(
            "Your are not the manager of: " +
              fromName +
              ". Please call this place manager",
          );
          err.status = 401;
          return next(err);
        }
      }
    });
  },
);

router.get(
  "/transferReceiverApprove/:requstID/:toName/:fromName/:productID/:quantity",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { requstID } = req.params;
    const { toName } = req.params;
    const { fromName } = req.params;
    const { productID } = req.params;
    const { quantity } = req.params;

    console.log(req.session.userId);

    User.findOne({ _id: req.session.userId }).exec(function (error, userData) {
      if (error) {
        return next(error);
      } else {
        console.log(userData.managerOf);
        console.log(toName);

        if (toName == userData.managerOf) {
          console.log("your are the manager of: " + toName);

          function buildUpdateOneWriteOperations(
            toName,
            fromName,
            productID,
            quantity,
          ) {
            const writeOperations = [
              {
                updateOne: {
                  filter: { _id: productID },
                  update: {
                    $inc: { [toName]: +quantity, [fromName]: -quantity },
                  },
                },
              },
            ];
            // important this above , comma solved bulkWrite issue
            return writeOperations;
          }

          var writeOperations = buildUpdateOneWriteOperations(
            toName,
            fromName,
            productID,
            quantity,
          );

          console.log(writeOperations.updateOne);

          try {
            console.log("98");
            Product.bulkWrite(writeOperations).then(function () {
              console.log("97");
              res.redirect("back");
            });
          } catch (error) {
            return next(err);
          }

          // arr_update_dict = { "$set": {} };
          // arr_update_dict["$set"]["receiverApprove"] = true;

          // TransferRequest.findOneAndUpdate({ _id: requstID }, arr_update_dict).then(function() {

          //   res.redirect('back')

          // })
        } else {
          console.log("your are not the manager of: " + toName);
          var err = new Error(
            "Your are not the manager of: " +
              toName +
              ". Please call this place manager",
          );
          err.status = 401;
          return next(err);
        }
      }
    });
  },
);

router.get(
  "/purchasePage/:purchaseId/",
  mid.requiresSaleseman,
  async function (req, res, next) {
    const { purchaseId } = req.params;

    try {
      const purchaseData = await Purchase.findOne({ _id: purchaseId }).exec();
      const inventoryData = await Inventory.find({}).exec();
      
      return res.render("manager/purchasePage", {
        title: "Purchase",
        purchaseData: purchaseData,
        inventoryData: inventoryData,
      });
      
    } catch (error) {
      return next(error);
    }
  },
);

router.get(
  "/orderPage/:orderId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { orderId } = req.params;

    Order.findOne({ _id: orderId }).exec(function (error, orderData) {
      if (error) {
        return next(error);
      } else {
        Inventory.find({}).exec(function (error, inventoryData) {
          if (error) {
            return next(error);
          } else {
            return res.render("manager/orderPage", {
              title: "Order",
              orderData: orderData,
              inventoryData: inventoryData,
            });
          }
        });
      }
    });
  },
);

router.get(
  "/productPage/:productId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { productId } = req.params;

    Product.findOne({ _id: productId }).exec(function (error, productData) {
      if (error) {
        return next(error);
      } else {
        Inventory.find({ productID: productId }).exec(
          function (error, inventoryData) {
            if (error) {
              return next(error);
            } else {
              return res.render("manager/productPage", {
                title: "productPage",
                productData: productData,
                inventoryData: inventoryData,
              });
            }
          },
        );
      }
    });
  },
);


router.post("/addInventoryToOrder", mid.requiresSaleseman, function(req, res, next) {
 
  const { price, inventoryID, quantity, orderID } = req.body;

  Inventory.findById(inventoryID).exec(function(error, inventoryData) {
    if (error) {
      return next(error);
    } else if (!inventoryData) {
      var err = new Error('Inventory not found.');
      err.status = 404;
      return next(err);
    } else {
      Order.findByIdAndUpdate(
        orderID,
        {
          $push: {
            
            prices: price,
            inventoryIDs: inventoryID,
            inventoryQuantities: quantity,
            inventoryCosts: inventoryData.cost,
            nameAs: inventoryData.nameA,
            nameEs: inventoryData.nameE,
            productNos: inventoryData.productNo,
            productIDs: inventoryData.productID,
            brands: inventoryData.brand,
            productNameAs: inventoryData.productNameA,
            productNameEs: inventoryData.productNameE,
            producturl: inventoryData.producturl,
            warranties: inventoryData.warranty,
            

          }
        },
        { new: true }
      ).exec(function(error, order) {
        if (error) {
          return next(error);
        } else {
          res.redirect('/manager/orderPage/' + orderID);
        }
      });
    }
  });
});

router.post("/addInventoryToPurchase", mid.requiresSaleseman, function(req, res, next) {
 
  const { price, inventoryID, quantity, purchaseID } = req.body;

  Inventory.findById(inventoryID).exec(function(error, inventoryData) {
    if (error) {
      return next(error);
    } else if (!inventoryData) {
      var err = new Error('Inventory not found.');
      err.status = 404;
      return next(err);
    } else {
      Purchase.findByIdAndUpdate(
        purchaseID,
        {
          $push: {
            
            prices: price,
            inventoryIDs: inventoryID,
            inventoryQuantities: quantity,
            
            nameAs: inventoryData.nameA,
            nameEs: inventoryData.nameE,
            productNos: inventoryData.productNo,
            productIDs: inventoryData.productID,
            brands: inventoryData.brand,
            productNameAs: inventoryData.productNameA,
            productNameEs: inventoryData.productNameE,
            producturl: inventoryData.producturl,
            warranties: inventoryData.warranty,
            
            

          }
        },
        { new: true }
      ).exec(function(error, order) {
        if (error) {
          return next(error);
        } else {
          res.redirect('/manager/purchasePage/' + purchaseID);
        }
      });
    }
  });
});



router.get(
  "/editInventory/:inventoryID",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { inventoryID } = req.params;

    

    Inventory.findOne({ _id: inventoryID }).exec(
      function (error, inventoryData) {
        if (error) {
          return next(error);
        } else if (!inventoryData) {
          var err = new Error("Inventory not found.");
          err.status = 404;
          return next(err);
        } else {
          return res.render("manager/editInventory", {
            title: "Edit Inventory",
            inventoryData: inventoryData,
          });
        }
      },
    );
  },
);

router.post("/editInventory", mid.requiresSaleseman, function (req, res, next) {

  
  
  const inventoryID = req.body.inventoryID;
  const updatedData = {
    cost: req.body.cost,
    brand: req.body.brand,
    productNo: req.body.productNo,
    nameA: req.body.nameA,
    nameE: req.body.nameE,
    quantityShop: req.body.quantityShop,
    quantitywarehouse01: req.body.quantitywarehouse01,
    vendormobile: req.body.vendormobile,
    sellcount: req.body.sellcount,
    procurecount: req.body.procurecount,
    min: req.body.min,
    minShop: req.body.minShop,
    producturl: req.body.producturl,
    warranty: req.body.warranty,
  };

  

    Inventory.findByIdAndUpdate(
      inventoryID,
      updatedData,
      { new: true },
      function (error, inventory) {
        if (error) {
          return next(error);
        } else {
          res.redirect("/manager/inventory/" + updatedData.productNo);
        }
      },
    );
});

router.get(
  "/editAny/:collection/:id/:field/:value/:type/:returnTo",
  mid.requiresSaleseman,
  function (req, res, next) {
    const data = {
      collection: req.params.collection,
      value: req.params.value,
      id: req.params.id,
      field: req.params.field,
      type: req.params.type,
      returnTo: req.params.returnTo,
      referer: req.headers.referer,
    };

    if (
      (data.field == "category" && data.collection == "Product") ||
      data.field == "brand"
    ) {
      console.log("__________");
      if (data.collection == "Product") {
        var x = Product;
      } // is there somesing more todo
      else if (data.collection == "Category") {
        var x = Category;
      } else if (data.collection == "Inventory") {
        var x = Inventory;
      }

      if (data.field == "brand") {
        var y = Brand;
      } else if (data.field == "category") {
        var y = Category;
      }

      x.findOne({ _id: data.id }).exec(function (error, result) {
        if (error) {
          return next(error);
        } else {
          y.find({}).exec(function (error, subData) {
            if (error) {
              return next(error);
            } else {
              return res.render("manager/formEditAny", {
                title: "Upload",
                data: data,
                result: result,
                subData: subData,
              });
            }
          });
        }
      });
    } else {
      console.log("xxxcxxx_xxxxx");
      return res.render("manager/formEditAny", { title: "Edit", data: data });
    }
  },
);

router.get(
  "/uploadImage/:collection/:id/:returnTo/:field",
  mid.requiresSaleseman,
  function (req, res, next) {
    const data = {
      collection: req.params.collection,
      id: req.params.id,
      returnTo: req.params.returnTo,
      field: req.params.field,
    };
    console.log(data);

    if (data.collection == "Product") {
      var x = Product;
    } // is there somesing more todo
    else if (data.collection == "Category") {
      var x = Category;
    } else if (data.collection == "Order") {
      var x = Order;
    } else if (data.collection == "Purchase") {
      var x = Purchase;
    }

    x.findOne({ _id: data.id }).exec(function (error, result) {
      if (error) {
        return next(error);
      } else {
        console.log(result);

        //res.redirect(returnLink) // do to my specific product todo
        return res.render("manager/formUploadImage", {
          title: "Upload",
          data: data,
          result: result,
          field: data.field,
        });
      }
    });
  },
);

router.post(
  "/uploadImage/:collection/:id/:returnTo/:field",
  mid.requiresSaleseman,
  function (req, res, next) {
    const data = {
      collection: req.params.collection,
      id: req.params.id,
      returnTo: req.params.returnTo,
      field: req.params.field,
    };

    const host = req.headers.host;
    const referer = req.headers.referer;

    console.log(data);
    console.log("host: " + host);
    console.log("referer: " + referer);

    upload(req, res, (err) => {
      if (err) {
        res.send(err);
      } else {
        if (req.file) {
          const filename = req.file.filename;
          const fileLInk = `https://${host}/` + filename;
          console.log("filename");
          console.log(filename);
          console.log(fileLInk);
          addLinkImgLingToAny2(
            data.collection,
            data.id,
            data.returnTo,
            data.field,
            filename,
            res,
          );

          // return res.render("manager", { title: '', fileLInk: fileLInk });
        } else {
          res.send(`Error: No file selected`);
        }
      }
    });
  },
);

function addLinkImgLingToAny2(collection, id, returnTo, field, filename, res) {
  arr_update_dict = { $set: {} };
  //this shoudl be dynamic us refere
  
  var z = 0;
  if (collection == "Product") {
    var x = Product;
    var returnLink = "/manager/productPage/" + id;
    z = 1;
  } else if (collection == "Product" && returnTo == "productshop") {
    var x = Product;
    var returnLink = "../product/" + id;
    z = 1;
  } else if (collection == "Category") {
    var x = Category;
    var returnLink = "/manager/category/";
    z = 1;
  } else if (collection == "Order") {
    var x = Order;
    var returnLink = "/manager/orderPage/" + id;
    z = 1;
  } else if (collection == "Purchase") {
    var x = Purchase;
    var returnLink = "/manager/purchasePage/" + id;
    z = 1;
  }

  console.log("filename: " + filename);


  if (z == 1) {
    arr_update_dict["$set"][field] = "/img/upload/" + filename;
    x.findOneAndUpdate({ _id: id }, arr_update_dict)
      .then(function () {
        res.redirect(returnLink); // do to my specific product todo
      })
      .catch(function (error) {
        return next(error);
      });
  } else {
    res.send(`Error: No Collection provided`);
  }
}

router.post(
  "/uploadImageList/:collection/:id/:returnTo/:index",
  mid.requiresSaleseman,
  function (req, res, next) {
    const data = {
      collection: req.params.collection,
      id: req.params.id,
      returnTo: req.params.returnTo,
      index: req.params.index,
    };

    const host = req.headers.host;
    const referer = req.headers.referer;

    console.log(data);
    console.log("host: " + host);
    console.log("referer: " + referer);

    upload(req, res, (err) => {
      if (err) {
        res.send(err);
      } else {
        if (req.file) {
          const filename = req.file.filename;
          const fileLInk = `https://${host}/` + filename;
          console.log("filename");
          console.log(filename);
          console.log(fileLInk);
          addLinkImgLingToAny(
            data.collection,
            data.id,
            data.returnTo,
            filename,
            data.index,
            res,
          );

          // return res.render("manager", { title: '', fileLInk: fileLInk });
        } else {
          res.send(`Error: No file selected`);
        }
      }
    });
  },
);
function addLinkImgLingToAny(collection, id, returnTo, filename, index, res) {
  arr_update_dict = { $set: {} };
  //this shoudl be dynamic us refere
  var z = 0;
  if (collection == "Product") {
    var x = Product;
    var returnLink = "/manager/productPage/" + id;
    z = 1;
  } else if (collection == "Product" && returnTo == "productshop") {
    var x = Product;
    var returnLink = "../product/" + id;
    z = 1;
  } else if (collection == "Category") {
    var x = Category;
    var returnLink = "/manager/category/";
    z = 1;
  } else if (collection == "Order") {
    var x = Order;
    var returnLink = "/manager/orderPage/" + id;
    z = 1;
  }

  if (z == 1) {
    arr_update_dict["$set"][`img.${index}`] = "/img/upload/" + filename;
    x.findOneAndUpdate({ _id: id }, arr_update_dict)
      .then(function () {
        res.redirect(returnLink); // do to my specific product todo
      })
      .catch(function (error) {
        return next(error);
      });
  } else {
    res.send(`Error: No Collection provided`);
  }
}

router.post(
  "/editAny/:collection/:field/:id/:index",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { collection } = req.params;
    const { index } = req.params;
    const { field } = req.params;
    const { id } = req.params;
    const value = req.body.value;

    console.log(collection);
    console.log(index);
    console.log(id);
    console.log(value);

    addDataToAny(collection, id, value, index, field, res);
  },
);

function addDataToAny(collection, id, value, index, dataFiled, res) {
  arr_update_dict = { $set: {} };
  //this shoudl be dynamic us refere
  var z = 0;
  if (collection == "Product") {
    var x = Product;
    var returnLink = "/manager/productPage/" + id;
    z = 1;
  }
  // else if (collection == "Product" && returnTo == "productshop") { var x = Product; var returnLink = '../product/' + id; z = 1 }
  // else if (collection == "Category") { var x = Category;; var returnLink = '/manager/category/'; z = 1 }
  // else if (collection == "Order") { var x = Order;; var returnLink = '/manager/orderPage/' + id; z = 1 }

  if (z == 1) {
    arr_update_dict["$set"][`${dataFiled}.${index}`] = value;
    x.findOneAndUpdate({ _id: id }, arr_update_dict)
      .then(function () {
        res.redirect(returnLink); // do to my specific product todo
      })
      .catch(function (error) {
        return next(error);
      });
  } else {
    res.send(`Error: No Collection provided`);
  }
}

router.post("/editAny", mid.requiresSaleseman, function (req, res, next) {
  var data = {
    collection: req.body.collection,
    id: req.body.id,
    field: req.body.field,
    value: req.body.value,
    returnTo: req.body.returnTo,
    referer: req.body.referer,
  };

  if (data.collection == "Product") {
    var x = Product;
  } // is there somesing more todo
  else if (data.collection == "Category") {
    var x = Category;
  } else if (data.collection == "Vendor") {
    var x = Vendor;
  } else if (data.collection == "Brand") {
    var x = Brand;
  } else if (data.collection == "Warehouse") {
    var x = Warehouse;
  } else if (data.collection == "Order") {
    var x = Order;
  } else if (data.collection == "TransferRequest") {
    var x = TransferRequest;
  } else if (data.collection == "User") {
    var x = User;
  } else if (data.collection == "Inventory") {
    var x = Inventory;
  }

  if (data.field == "category") {
    var usingSplit = data.value.split(",");
    data.value = usingSplit;
  }

  console.log(usingSplit);
  console.log(data);
  console.log(x);

  arr_update_dict = { $set: {} };
  arr_update_dict["$set"][data.field] = data.value;
  x.findOneAndUpdate({ _id: data.id }, arr_update_dict)
    .then(function () {
      if (data.returnTo == "productshop") {
        return res.redirect(data.referer);
      } else if (data.collection == "Inventory") {
        return res.redirect("Inventory" + "/" + data.returnTo);
      } else {
        return res.redirect(data.returnTo + "/" + data.id);
      }
    })
    .catch(function (error) {
      return next(error);
    });
});

router.post("/editOrder", mid.requiresSaleseman, function (req, res, next) {
  console.log("lll");

  var data;

  var data = {
    orderID: req.body.orderID,
    field: req.body.field,
    Value: req.body.Value,
    index: req.body.index,
  };

  console.log(data);

  Order.update(
    { _id: data.orderID },
    { $set: { [data.field + "." + data.index]: data.Value } },
  ).then(function () {
    return res.redirect("back");
  });
});

router.get("/city", mid.requiresSaleseman, function (req, res, next) {
  City.find({}).exec(function (error, cityData) {
    if (error) {
      return next(error);
    } else {
      return res.render("manager/city", { title: "City", cityData: cityData });
    }
  });
});

router.post("/city", mid.requiresAdmin, function (req, res, next) {
  console.log(req.body.data);

  var x = JSON.parse(req.body.data);

  var cityEnglish = [];
  var cityArabic = [];
  var ID_CITY = [];
  var price = [];
  var cost = [];
  var shippingFrom = [];
  x.forEach(myFunction);

  function myFunction(value, index, array) {
    cityEnglish.push(value.cityEnglish);
    cityArabic.push(value.cityArabic);
    ID_CITY.push(value.ID_CITY);
    price.push(value.price);
    cost.push(value.cost);
    shippingFrom.push(value.shippingFrom);
  }

  arr_update_dict = { $set: {} };
  arr_update_dict["$set"]["cityEnglish"] = cityEnglish;
  arr_update_dict["$set"]["cityArabic"] = cityArabic;
  arr_update_dict["$set"]["ID_CITY"] = ID_CITY;
  arr_update_dict["$set"]["price"] = price;
  arr_update_dict["$set"]["cost"] = cost;
  arr_update_dict["$set"]["shippingFrom"] = shippingFrom;

  City.findOneAndUpdate({ _id: "63ad38dee77cc01557b258e4" }, arr_update_dict)
    .then(function () {
      res.redirect("back");
    })
    .catch(function (error) {
      return next(error);
    });
});

// This can be deleted
router.get("/test", mid.requiresAdmin, function (req, res, next) {
  Product.find({}, { name: 1 }).exec(function (error, productData) {
    if (error) {
      return next(error);
    } else {
      console.log(productData);
    }
  });
});

router.post('/approvePaymentPurchaseOrder/:purchaseId', mid.requiresSaleseman, async function(req, res, next) {
  // Your new code will be implemented here
  // Use appropriate indentation and follow the existing code style
  
  Purchase.findOneAndUpdate(
    { _id: req.params.purchaseId },
    { $set: { paymentStatus: true, paymentName: req.session.userName } },
    { new: true }
  )
  .exec(function(error, updatedPurchase) {
    if (error) {
      return next(error);
    } else {
      console.log('Payment status updated successfully.');
      res.redirect("back");
    }
  });

  
  
});


router.post('/completeOrder/:orderId', mid.requiresSaleseman, async function(req, res, next) {
  const { orderId } = req.params;
  try {
    const orderData = await Order.findOne({ _id: orderId }).exec();

    if (orderData.status == "completed"){      
      throw new Error('Order is already completed and can not be completed twice. الطلب بالفعل مكتمل. ولا يمكن اكماله مرة اخرى');
    }

    const updateData = {
      status: "completed",
      
      totalPrice: (orderData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * orderData.prices[index]);
      }, 0) - orderData.discount + orderData.shippingCost).toFixed(3),
      
      totalCost: (orderData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * orderData.inventoryCosts[index]);
      }, 0)).toFixed(3),

      
    };

    console.log(updateData);

    await Order.findOneAndUpdate({ _id: orderId }, { $set: updateData });

    const writeOperations = orderData.inventoryIDs.map((inventoryID, index) => ({
      updateOne: {
        filter: { _id: inventoryID },
        update: {
          $inc: {
            quantityShop: -orderData.inventoryQuantities[index],
            sellcount: orderData.inventoryQuantities[index],
          }
        }
      }
    }));

    

    await Inventory.bulkWrite(writeOperations);
    
    res.redirect("back");
  } catch (error) {
    next(error);
  }
})


router.post('/completePurchaseOrder/:purchaseId', mid.requiresSaleseman, async function(req, res, next) {
  const { purchaseId } = req.params;
  try {
    const purchaseData = await Purchase.findOne({ _id: purchaseId }).exec();

    if (purchaseData.receivingStatus == "received"){      
      throw new Error('Purchase Order is already recieved and can not be recieved twice. طلب الشراء بالفعل تم استلامه. ولا يمكن استلامه مرة اخرى');
    }

    const updateData = {
      receivingStatus: "received",
      
      totalPrice: (purchaseData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * purchaseData.prices[index]);
      }, 0)).toFixed(3),
      receivingName: req.session.userName,
      receivingDate: new Date(),
      
      

      
    };

    console.log(updateData);

    await Purchase.findOneAndUpdate({ _id: purchaseId }, { $set: updateData });

    const writeOperations = purchaseData.inventoryIDs.map((inventoryID, index) => ({
      updateOne: {
        filter: { _id: inventoryID },
        update: {
          $inc: {
            quantityShop: purchaseData.inventoryQuantities[index],
            procurecount: purchaseData.inventoryQuantities[index],
          }
        }
      }
    }));

    

    await Inventory.bulkWrite(writeOperations);
    
    res.redirect("back");
  } catch (error) {
    next(error);
  }
})

router.post('/returnPurchaseOrder/:purchaseId', mid.requiresSaleseman, async function(req, res, next) {
  const { purchaseId } = req.params;
  try {
    const purchaseData = await Purchase.findOne({ _id: purchaseId }).exec();

    if (purchaseData.receivingStatus == "returned"){      
      throw new Error('Purchase Order is already returned and can not be returned twice. طلب الشراء بالفعل تم ارجاعه. ولا يمكن ارجاعه مرة اخرى');
    }

    const updateData = {
      receivingStatus: "returned",
      
      totalPrice: (purchaseData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * purchaseData.prices[index]);
      }, 0)).toFixed(3),
      receivingName: req.session.userName,
      receivingDate: new Date(),
      
      

      
    };

    console.log(updateData);

    await Purchase.findOneAndUpdate({ _id: purchaseId }, { $set: updateData });

    const writeOperations = purchaseData.inventoryIDs.map((inventoryID, index) => ({
      updateOne: {
        filter: { _id: inventoryID },
        update: {
          $inc: {
            quantityShop: -purchaseData.inventoryQuantities[index],
            procurecount: -purchaseData.inventoryQuantities[index],
          }
        }
      }
    }));

    

    await Inventory.bulkWrite(writeOperations);
    
    res.redirect("back");
  } catch (error) {
    next(error);
  }
})


router.post('/returnOrder/:orderId', mid.requiresSaleseman, async function(req, res, next) {
  const { orderId } = req.params;
  try {
    const orderData = await Order.findOne({ _id: orderId }).exec();

    // if (orderData.status == "completed"){      
    //   throw new Error('Order is already completed and can not be completed twice. الطلب بالفعل مكتمل. ولا يمكن اكماله مرة اخرى');
    // }

    const updateData = {
      status: "returned",
      
      totalCost: (orderData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * orderData.prices[index]);
      }, 0) - orderData.discount + orderData.shippingCost).toFixed(3),
      
      totalPrice: (orderData.inventoryQuantities.reduce((total, qty, index) => {
        return total + (qty * orderData.inventoryCosts[index]);
      }, 0)).toFixed(3),

      
    };

    console.log(updateData);

    await Order.findOneAndUpdate({ _id: orderId }, { $set: updateData });

    const writeOperations = orderData.inventoryIDs.map((inventoryID, index) => ({
      updateOne: {
        filter: { _id: inventoryID },
        update: {
          $inc: {
            quantityShop: orderData.inventoryQuantities[index],
            sellcount: -orderData.inventoryQuantities[index],
          }
        }
      }
    }));

    

    await Inventory.bulkWrite(writeOperations);
    
    res.redirect("back");
  } catch (error) {
    next(error);
  }
})






router.get(
  "/completeOrder/:orderId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { orderId } = req.params;

    Order.findOne({ _id: orderId }).exec(function (error, orderData) {
      if (error) {
        return next(error);
      } else {
        arr_update_dict = { $set: {} };
        arr_update_dict["$set"]["status"] = "completed";
        arr_update_dict["$set"]["totalPrice"] = (
          orderData.quantity.reduce(function (r, a, i) {
            return r + a * orderData.price[i];
          }, 0) -
          orderData.discount +
          orderData.shippingCost
        ).toFixed(3);

        if (orderData.cost == orderData.price.length) {
          arr_update_dict["$set"]["totalCost"] = orderData.quantity
            .reduce(function (r, a, i) {
              return r + a * orderData.cost[i];
            }, 0)
            .toFixed(3);
        } else {
          console.log(2222);
          arr_update_dict["$set"]["totalCost"] = orderData.quantity
            .reduce(function (r, a, i) {
              return r + a * 0;
            }, 0)
            .toFixed(3);
        }

        Order.findOneAndUpdate({ _id: orderId }, arr_update_dict).then(
          function () {
            function buildUpdateOneWriteOperations(
              productIDs,
              warehouse,
              quantity,
            ) {
              console.log("warehouse: " + warehouse);

              const writeOperations = productIDs.map((productID, index) => ({
                updateOne: {
                  filter: { _id: productID },
                  update: {
                    $inc: {
                      [warehouse]: -quantity[index],
                      quantity: -quantity[index],
                      sellCount: +quantity[index],
                    },
                  },
                },
              }));

              return writeOperations;
            }

            var writeOperations = buildUpdateOneWriteOperations(
              orderData.productIDs,
              orderData.warehouse,
              orderData.quantity,
            );

            console.log(writeOperations);

            try {
              Product.bulkWrite(writeOperations).then(function () {
                res.redirect("back");
              });
            } catch (error) {
              print(error);
            }
            // res.redirect('back');
          },
        );
      }
    });
  },
);

router.get(
  "/returnOrder/:orderId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { orderId } = req.params;

    Order.findOne({ _id: orderId }).exec(function (error, orderData) {
      if (error) {
        return next(error);
      } else {
        arr_update_dict = { $set: {} };
        arr_update_dict["$set"]["status"] = "returned";
        arr_update_dict["$set"]["totalCost"] = (
          orderData.quantity.reduce(function (r, a, i) {
            return r + a * orderData.price[i];
          }, 0) -
          orderData.discount +
          orderData.shippingCost
        ).toFixed(3);
        arr_update_dict["$set"]["totalPrice"] = orderData.quantity
          .reduce(function (r, a, i) {
            return r + a * orderData.cost[i];
          }, 0)
          .toFixed(3);

        Order.findOneAndUpdate({ _id: orderId }, arr_update_dict).then(
          function () {
            function buildUpdateOneWriteOperations(
              productIDs,
              warehouse,
              quantity,
            ) {
              console.log("warehouse: " + warehouse);

              const writeOperations = productIDs.map((productID, index) => ({
                updateOne: {
                  filter: { _id: productID },
                  update: {
                    $inc: {
                      [warehouse]: +quantity[index],
                      quantity: +quantity[index],
                      sellCount: -quantity[index],
                    },
                  },
                },
              }));

              return writeOperations;
            }

            var writeOperations = buildUpdateOneWriteOperations(
              orderData.productIDs,
              orderData.warehouse,
              orderData.quantity,
            );

            console.log(writeOperations);

            try {
              Product.bulkWrite(writeOperations).then(function () {
                res.redirect("back");
              });
            } catch (error) {
              print(error);
            }
            // res.redirect('back');
          },
        );
      }
    });
  },
);

router.get(
  "/completePurchase/:purchaseId/",
  mid.requiresSaleseman,
  function (req, res, next) {
    const { purchaseId } = req.params;

    Purchase.findOne({ _id: purchaseId }).exec(function (error, purchaseData) {
      if (error) {
        return next(error);
      } else {
        arr_update_dict = { $set: {} };
        arr_update_dict["$set"]["status"] = "completed";
        if (purchaseData.cost) {
          console.log(1111);
          arr_update_dict["$set"]["totalCost"] = purchaseData.quantity.reduce(
            function (r, a, i) {
              return r + a * purchaseData.cost[i];
            },
            0,
          );
        } else {
          console.log(2222);
          arr_update_dict["$set"]["totalCost"] = purchaseData.quantity.reduce(
            function (r, a, i) {
              return r + a * 0;
            },
            0,
          );
        }

        Purchase.findOneAndUpdate({ _id: purchaseId }, arr_update_dict).then(
          function () {
            function buildUpdateOneWriteOperations(
              productIDs,
              warehouse,
              quantity,
            ) {
              console.log("warehouse: " + warehouse);

              const writeOperations = productIDs.map((productID, index) => ({
                updateOne: {
                  filter: { _id: productID },
                  update: {
                    $inc: {
                      [warehouse]: +quantity[index],
                      quantity: +quantity[index],
                    },
                  },
                },
              }));

              return writeOperations;
            }

            var writeOperations = buildUpdateOneWriteOperations(
              purchaseData.productIDs,
              purchaseData.warehouse,
              purchaseData.quantity,
            );

            console.log(writeOperations);

            try {
              Product.bulkWrite(writeOperations).then(function () {
                res.redirect("back");
              });
            } catch (error) {
              print(error);
            }
            // res.redirect('back');
          },
        );
      }
    });
  },
);

// POST /AddProduct
router.post("/AddInventory", mid.requiresAdmin, function (req, res, next) {
  var inventoryData = {
    productID: req.body.productID,
    cost: req.body.cost,
    nameA: req.body.nameA,
    nameE: req.body.nameE,
    productNo: req.body.productNo,
    brand: req.body.brand,
    productNameA: req.body.productNameA,
    productNameE: req.body.productNameE,
    producturl: req.body.producturl,
    quantityShop: req.body.quantityShop,
    quantitywarehouse01: req.body.quantitywarehouse01,
    vendormobile: req.body.vendormobile,
    min: req.body.min,
    minShop: req.body.minShop,
  };

  console.log("sendBack");
  console.log(inventoryData.sendBack);

  Inventory.create(inventoryData, function (error, theInventory) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("back");
    }
  });
});

// POST /AddProduct
router.post("/AddProduct", mid.requiresAdmin, function (req, res, next) {
  var productData = {
    // 'SKU':req.body.SKU,
    name: req.body.name,
    // 'variantName': req.body.variantName,
    // 'price': req.body.price,
    // 'cost': req.body.cost,
    // "status": req.body.status,
    // 'quantity': req.body.quantity,
    // 'naseem': req.body.naseem,
    // 'qurain': req.body.qurain,
    // "description": req.body.description,
    // "discountPrice": req.body.discountPrice,
    // "category": req.body.category.split("#")[0],
    // "categoryName": req.body.category.split("#")[1],
    // "categoryNo": req.body.category.split("#")[2],
    // "brand": req.body.brand.slice(0, 24),
    // "brandName": req.body.brand.slice(24),
    // "vendor": req.body.vendor.slice(0, 24),
    // "vendorName": req.body.vendor.slice(24),
    // 'SuperProductID': req.body.SuperProductID,
    // 'variant': req.body.variant,
    // 'group': req.body.group,
    // 'warranty': req.body.warranty
  };

  Product.create(productData, function (error, theProduct) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      if (productData.SuperProductID) {
        Product.findOneAndUpdate(
          { _id: productData.SuperProductID },
          {
            $push: {
              SubProductId: theProduct.id,
            },
          },
        )
          .then(function () {
            res.redirect("products");
          })
          .catch(function (error) {
            return next(error);
          });
      } else {
        res.redirect("products");
      }
    }
  });
});

// POST /AddCategory
router.post("/AddCategory", mid.requiresAdmin, function (req, res, next) {
  var categoryData = {
    name: req.body.name,
  };

  Category.create(categoryData, function (error, theCategory) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("category");
    }
  });
});

// POST /AddVendor
router.post("/AddVendor", mid.requiresAdmin, function (req, res, next) {
  var vendorData = {
    name: req.body.name,
    vendorNo: req.body.vendorNo,
  };

  Vendor.create(vendorData, function (error, theVendor) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("vendor");
    }
  });
});
// POST /AddBrand
router.post("/AddBrand", mid.requiresAdmin, function (req, res, next) {
  var brandData = {
    name: req.body.name,
  };

  Brand.create(brandData, function (error, theBrand) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("brand");
    }
  });
});

// POST /AddWarehouse
router.post("/AddWarehouse", mid.requiresAdmin, function (req, res, next) {
  var warehouseData = {
    name: req.body.name,
  };

  Warehouse.create(warehouseData, function (error, theWarehouse) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("/warehouse");
    }
  });
});

// POST /AddOrder
router.post("/AddOrder", mid.requiresSaleseman, function (req, res, next) {
  var orderData = {
    invoice: req.body.invoice,
    mobile: req.body.mobile,
  };
  console.log(orderData);

  Order.create(orderData, function (error, theOrder) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("orderPage/" + theOrder._id);
    }
  });
});

// POST /AddPurchase
router.post("/AddPurchase", mid.requiresSaleseman, function (req, res, next) {
  var purchaseData = {
    invoice: req.body.invoice,
    vendorID: req.body.vendor.split("#")[0],
    vendorName: req.body.vendor.split("#")[1], 
  };

  Purchase.create(purchaseData, function (error, thePurchase) {
    if (error) {
      console.log(error.code);
      return next(error);
    } else {
      res.redirect("purchasePage/" + thePurchase._id);
    }
  });
});

// GET /CreateTransferRequest
router.get('/transferRequestNew/:inventoryID/:from/:to/:url', mid.requiresSaleseman, function(req, res, next) {
  const { inventoryID } = req.params;
  const { from } = req.params;
  const { to } = req.params;
  const { url } = req.params;

  Inventory.findOne({ _id: inventoryID }).exec(function(error, inventoryData) {
    if (error) {
      return next(error);
    } else if (!inventoryData) {
      var err = new Error('Inventory not found.');
      err.status = 404;
      return next(err);
    } else {
      res.render('manager/transferRequestNew', {
        title: 'New Transfer Request',
        inventoryData: inventoryData,
        from: from,
        to: to,
        url: url
      });
    }
  });
});

router.post('/transferRequestNew', mid.requiresSaleseman, function(req, res, next) {
  var transferRequestData = {
    inventoryID: req.body.inventoryID,
    productID: req.body.productID,
    nameA: req.body.nameA,
    nameE: req.body.nameE,
    productNo: req.body.productNo,
    brand: req.body.brand,
    productNameA: req.body.productNameA,
    from: req.body.from,
    to: req.body.to,
    url: req.body.url,
    requestBy: req.session.userName,
    
    
    
    quantity: req.body.quantity
  };

  console.log("TransferRequest")
  console.log(transferRequestData)
  

  TransferRequest.create(transferRequestData, function(error, newTransferRequest) {
    if (error) {
      return next(error);
    } else {
      res.redirect('/manager/transferRequest');
    }
  });
});


// POST /Add Product to Order
router.post(
  "/AddProductToOrder",
  mid.requiresSaleseman,
  function (req, res, next) {
    const productID = req.body.productID.split("#")[0];
    const quantity = req.body.quantity;
    const orderID = req.body.orderID;
    const PriceO = req.body.PriceO;

    Product.findOne({ _id: productID }).exec(function (error, productData) {
      if (error) {
        return next(error);
      } else {
        Order.findOneAndUpdate(
          { _id: orderID },
          {
            $push: {
              productIDs: productData._id,
              quantity: quantity,
              productNames: productData.name,
              cost: productData.cost,
              warranty: productData.warranty,
              price: PriceO,
            },
          },
        )
          .catch(function (error) {
            return next(error);
          })
          .then(function () {
            return res.redirect("orderPage/" + orderID);
          });
      }
    });
  },
);

// POST /Add Product to Order
router.post(
  "/AddProductToPurchase",
  mid.requiresSaleseman,
  function (req, res, next) {
    const productID = req.body.productID.split("#")[0];
    const quantity = req.body.quantity;
    const purchaseID = req.body.purchaseID;
    const cost = req.body.cost;

    Product.findOne({ _id: productID }).exec(function (error, productData) {
      if (error) {
        return next(error);
      } else {
        Purchase.findOneAndUpdate(
          { _id: purchaseID },
          {
            $push: {
              productIDs: productData._id,
              quantity: quantity,
              productNames: productData.name,
              cost: cost,
            },
          },
        )
          .then(function () {
            return res.redirect("purchasePage/" + purchaseID);
          })
          .catch(function (error) {
            return next(error);
          });
      }
    });
  },
);

router.get(
  "/deleteInventory/:inventoryID/",
  mid.requiresAdmin,
  function (req, res) {
    const { inventoryID } = req.params;
    Inventory.deleteOne({ _id: inventoryID })
      .then(function () {
        res.redirect("back");
      })
      .catch(function (error) {
        res.status(500).send(error);
      });
  },
);

//Get //
router.get("/deletProduct/:productId/", mid.requiresAdmin, function (req, res) {
  const { productId } = req.params;
  Product.deleteOne({ _id: productId }).then(function () {
    res.redirect("back");
  });
});

router.get(
  "/deletCategory/:categoryId/",
  mid.requiresAdmin,
  function (req, res) {
    const { categoryId } = req.params;
    Category.deleteOne({ _id: categoryId }).then(function () {
      res.redirect("back");
    });
  },
);
router.get("/deletVendor/:vendorId/", mid.requiresAdmin, function (req, res) {
  const { vendorId } = req.params;
  Vendor.deleteOne({ _id: vendorId }).then(function () {
    res.redirect("back");
  });
});
router.get("/deletBrand/:brandId/", mid.requiresAdmin, function (req, res) {
  const { brandId } = req.params;
  Brand.deleteOne({ _id: brandId }).then(function () {
    res.redirect("back");
  });
});

router.get(
  "/deletWarehouse/:warehouseId/",
  mid.requiresAdmin,
  function (req, res) {
    const { warehouseId } = req.params;
    Warehouse.deleteOne({ _id: warehouseId }).then(function () {
      res.redirect("back");
    });
  },
);

router.get("/send", function (req, res) {
  const { user } = req.query;
  const { orderID } = req.query;
  const { mobile } = req.query;
  const { massege } = req.query;
  const { color } = req.query;
  const { KentStatus } = req.query;
  const { orderData } = req.query;

  console.log("orderID:" + orderID);

  const output = "Email Body";
  // get it from here https://myaccount.google.com/apppasswords
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eng.dugaim@gmail.com",
      pass: "kioxedtstdtierbv",
    },
  });

  var mailOptions = {
    from: "eng.dugaim@gmail.com",
    to: keys.internal.EmailsForOrders,
    subject: `${massege} رقم الطلب: ${orderID}`,
    text: `mobile: ${mobile},
  orderID: ${orderID}. 
  ${keys.internal.host}/manager/orderPage/${orderID},
  color: ${color},
  KentStatus: ${KentStatus},
  source: ${req.session.source}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);

      if (KentStatus == "CAPTURED") {
        return res.render("/redirectAfterPaymentSucsses", {
          title: "Order",
          KentStatus: KentStatus,
          orderData: orderData,
        });
      } else if (KentStatus == "CANCELLED") {
        return res.render("/redirectAfterPayment", {
          title: "Order",
          KentStatus: KentStatus,
          orderData: orderData,
        });
      } else if (KentStatus == "FAILED") {
        return res.render("/redirectAfterPayment", {
          title: "Order",
          KentStatus: KentStatus,
          orderData: orderData,
        });
      } else {
        res.redirect("/emptyCart");
      }
    }
  });
});

router.get(
  "/deletProductDiscount/:productId/",
  mid.requiresAdmin,
  function (req, res, next) {
    const { productId } = req.params;
    var noDiscount = 0;

    arr_update_dict = { $set: {} };
    arr_update_dict["$set"]["discountPrice"] = noDiscount;
    Product.findOneAndUpdate({ _id: productId }, arr_update_dict).then(
      function () {
        res.redirect("back");
      },
    );
  },
);

module.exports = router;

// this good set and mul examples, inside findOneAndUpdate
// $set: { "quantity": 3 }
// $mul: {quantity: 2}

// Product.updateMany({_id: { $in: [orderData.productIDs[0], orderData.productIDs[1]] }},{

//     $inc: { quantity: -1 }

// }).then(function(){
//     res.redirect('back')
// })

// roduct.bulkWrite(
//          [
//        { updateOne: {
//           filter: { _id: "638513a4ab6217c642c0cdc7" },
//           update: { $inc: { naseem: 1 } }
//        } },
//        { updateOne: {
//           filter: { _id: "6385142fab6217c642c0cdcc" },
//           update: { $inc: { naseem: 1 } }
//        } },

//     ]

//     ).then(function(){
//         res.redirect('back')
//     })

// arr_update_dict = { "$set": {} };
// arr_update_dict["$set"]["status"] = "completed" ;
// arr_update_dict["$set"]["totalPrice"] = "qurain" ;

// console.log(arr_update_dict)

// Order.findOneAndUpdate({_id:orderId},arr_update_dict).exec(function (error, orderData){
//     console.log(orderData);
//     res.redirect('back');
// })
