var express = require('express');
var router = express.Router();

var Charge = require('../models/charge');
var Chapter = require('../models/chapter');
var Course = require('../models/course');

var Product = require('../models/product');
var Category = require('../models/category');
var Vendor = require('../models/vendor');
var Brand = require('../models/brand');
var Warehouse = require('../models/warehouse');
var Order = require('../models/order');
var TransferRequest = require('../models/transferRequest');
var User = require('../models/user');
var City = require('../models/city');


var mid = require('../middleware');

var nodemailer = require('nodemailer');
const url = require('url');




router.get('/invoicePrint/:orderNo', function(req, res, next) {

  const { orderNo } = req.params;

  Order.findOne({ orderNo: orderNo }).exec(function(error, orderData) {
    if (error) {
      return next(error);
    } else {
      return res.render('invoicePrint', { title: 'invoicePrint' , orderData: orderData});
    }
  })

  


})


router.post('/Disc', function(req, res, next) {

  var code = req.body.code;

  console.log("code: " + code);


  if (code == "ITC") {
    res.redirect('/mutlaa')

  } else {
    return res.render('mutlaa2', { title: 'ITC Discount' });
  }



})


router.get('/mutlaaWelcome', function(req, res, next) {

  return res.render('mutlaa2', { title: 'ITC Discount' });


});
router.get('/sheet', function(req, res, next) {

  Product.find({ googleSheet: true }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      return res.render('sheet', { title: 'sheet', productData: productData });


    }
  });




});





router.get('/orderReceived', function(req, res, next) {

  return res.render('redirect', { title: 'ITC Discount' });


});




router.get('/mutlaa', function(req, res, next) {
  // res.send('Hello World!')
  req.session.mutlaa = true;
  req.session.save(function(err) {
    // session saved
    return res.render('mutlaa', { title: 'ITC Discount' });
  })


});



router.get('/', function(req, res, next) {
  // res.send('Hello World!')

  Category.find({}).sort({ categoryNo: 1 }).exec(function(error, categoryData) {
    if (error) {
      return next(error);
    } else {
      return res.render('home', { title: 'Home', categoryData: categoryData });
    }
  });

});


router.post('/upSellApprove', function(req, res, next) {

  var cartData = req.session.cartData0;

  console.log(cartData);

  var IDs = []; var Names = []; var Prices = []; var Quantities = []; Warrantys = []; var Costs = []; var Warranties = []; cartIDs = [];

  cartData.forEach(function(product, index, array) {
    Names.push(product.Name);
    cartIDs.push(product.ID);
    Prices.push(product.upsell); 
    Costs.push(product.cost); 
    Quantities.push(product.Quantity);
    Warrantys.push(product.warranty);
    // Warranties.push(product.warranty);
  });

  var orderData = {
    'mobile': req.body.mobile,
    'note': req.body.color,
    //'invoice': req.body.invoice,
    'address': req.body.address,
    // 'discount': req.body.discount,
    'customerName': req.body.customerName,
    'shippingCost': 1.5,
    'price': Prices,
    'cost': Costs,
    'productIDs': cartIDs,
    'quantity': Quantities,
    'warranty': Warrantys,
    'warehouse': "qurain",
    'productNames': Names,

  };




  FindOrderAndUpdate()

  function FindOrderAndUpdate() {

    arr_update_dict = { "$set": {} };
    // arr_update_dict["$set"]["cost"] = Costs;
    arr_update_dict["$set"]["price"] = Prices;
    arr_update_dict["$set"]["cost"] = Costs;
    arr_update_dict["$set"]["productNames"] = Names
    arr_update_dict["$set"]["productIDs"] = cartIDs;
    arr_update_dict["$set"]["quantity"] = Quantities;
    arr_update_dict["$set"]["warranty"] = Warrantys;
    // arr_update_dict["$set"]["warranty"] = Warranties;


    arr_update_dict["$set"]["warehouse"] = "qurain";
    arr_update_dict["$set"]["mobile"] = orderData.mobile;
    arr_update_dict["$set"]["address"] = orderData.address;
    // arr_update_dict["$set"]["invoice"] = orderData.invoice;
    // arr_update_dict["$set"]["discount"] = orderData.discount;
    arr_update_dict["$set"]["customerName"] = orderData.customerName;
    arr_update_dict["$set"]["shippingCost"] = orderData.shippingCost;
    // arr_update_dict["$set"]["userID"] = orderData.userID;    
    // arr_update_dict["$set"]["email"] = orderData.email;
    // arr_update_dict["$set"]["ID_CITY"] = orderData.ID_CITY;    
    // arr_update_dict["$set"]["city"] = orderData.city;




    Order.create(orderData, function(error, theOrder) {
      if (error) {
        console.log(error.code);
        return next(error);
      } else {
        console.log("order created")
        console.log("")
        console.log(theOrder._id)
        console.log((theOrder._id).toString())
        // res.redirect('/emptyCart')

        res.redirect(url.format({
          pathname: "manager/send",
          query: {
            "user": "customer",
            "orderID": (theOrder._id).toString(),
            "mobile": orderData.mobile,
            "color": orderData.note,
            "massege": "تم استلام طلب جديد upsell"
          }
        }));
      }

    })
  }


  // Order.create(orderData, function(error, theOrder) {
  //   if (error) {
  //     console.log(error.code);
  //     return next(error);
  //   } else {
  //     // console.log("ORDER CREATED")
  //     // console.log("ORDER ID: " + theOrder.id)
  //     req.session.orderID = theOrder.id;
  //     req.session.save(function(err) {
  //       // session saved
  //       // res.redirect('/')
  //       findProductsThenRoute()
  //     })
  //   }
  // });

})

router.get('/upSellCart', function(req, res, next) {

  console.log("req.session.cartData0: " + req.session.cartData0)

  if (!req.session.cartData0) {
    console.log("rrr")
    req.session.cartData0 = []
    var old = req.session.cartData0;
    res.redirect('/')
  } else {
    console.log("ttt")

    var old = req.session.cartData0;
  }


  cartData = old;


  return res.render('upSell2', { title: 'Product', cartData: cartData })
})




// /upSellAdd/:productNo
router.get('/upSellAdd/:productNo/:upsellPrice', function(req, res, next) {
  const { productNo } = req.params;
  const { upsellPrice } = req.params;

  console.log("productNo :" + productNo);
  console.log("upsellPrice :" + upsellPrice);


  var productExistInCart = false;
  const host = req.headers.host;
  var hostNew = "";

  Product.findOne({ productNo: productNo }).exec(function(error, productData) {

    if (productData.upsell == 0) {
      res.redirect('/emptyCart')
    }

    console.log("productData.upsell :" + productData.upsell);

    if (error) {
      return next(error);
    } else {




      if (host == "localhost:3000") {
        hostNew = "itcstore.net";
      } else {
        hostNew = host;
      }

      var newProduct = {
        ID: productData._id,
        Name: productData.name,
        img: productData.img,
        Quantity: 1,
        Price: productData.price,
        Cost: productData.cost,
        upsell: productData.discountPrice,
        nextUpSell: productData.upsell,
        isUpSell: true,
        productNo: parseFloat(productNo),
        parentNo: parseFloat(productData.parentNo),
        warranty: parseFloat(productData.warranty),
        colortype: parseFloat(productData.colortype),
        // total : parseInt(req.body.quantity)*parseFloat(req.body.price)
      }

      if (upsellPrice == productData.upsell) {

        console.log("upsellPrice  == productData.upsell :" + "true");

        newProduct.Price = productData.price;
        newProduct.upsell = productData.upsell;
        newProduct.isUpSellSecond = true
      }

      console.log("newProduct.isUpSellSecond = " + newProduct.isUpSellSecond)


      if (!req.session.cartData0) {
        if (upsellPrice != productData.discountPrice) {
          newProduct.upsell = productData.discountPrice;
        }

        req.session.cartData0 = []
        var old = req.session.cartData0;


      } else if (newProduct.isUpSellSecond) {


        var old = req.session.cartData0;




      } else {
        console.log("5")
        req.session.cartData0 = []
        var old = req.session.cartData0;
      }

      // req.session.cartData0 = []
      var old = req.session.cartData0;
      console.log(old)


      cartData = req.session.cartData0;

      old.push(newProduct);
      req.session.cartData0 = old;
      req.session.cartData0 = old;
      req.session.cartCount = req.session.cartData0.length;
      // console.log(req.session.cartData0.length);
      req.session.save(function(err) {
        // session saved
        res.redirect('/upSellCart')

        // return res.render('upSell2', { title: 'Product', cartData:cartData})
        // return res.redirect(`https://${hostNew}/product/${newProduct.parentNo}?ShowModal=yes&Q=${newProduct.Quantity}`);
      })

    }
  })



})







router.get('/upsellCategory/:productNo/:source', function(req, res, next) {
  const { productNo } = req.params;
  const { source } = req.params;
  const { ShowModal } = req.query;
  const { Q } = req.query;

  req.session.source = source;
  req.session.save(function(err) {
    // session saved
    // return res.render('mutlaa', { title: 'ITC Discount' });
  })


  Product.findOne({ productNo: productNo }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      if (productData.upsell == 0) {
        res.redirect('/emptyCart')
      }

      Product.find({ SuperProductID: productData._id }).exec(function(error, productSub) {
        if (error) {
          return next(error);
        } else {



          //console.log(productSub); JSON.parse
          // let reqq= JSON.parse(req);

          console.log(req.headers.host)
          console.log(req.headers.referer)

          // return res.render('upsellCategory', { title: 'Product', productData: productData, ShowModal: ShowModal, Q: Q, productSub: productSub , currentURL: req });


          req.session.save(function(err) {
            return res.render('upsellCategory', { title: 'Product', productData: productData, ShowModal: ShowModal, Q: Q, productSub: productSub, currentURL: req });
            // session saved
            // return res.render('mutlaa', { title: 'ITC Discount' });
          })


        }
      });


    }
  });

});
router.get('/upSell/:productNo/:source', function(req, res, next) {
  const { productNo } = req.params;
  const { source } = req.params;
  const { ShowModal } = req.query;
  const { Q } = req.query;


  req.session.source = source;
  req.session.save(function(err) {
    // session saved
    // return res.render('mutlaa', { title: 'ITC Discount' });
  })

  Product.findOne({ productNo: productNo }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      // if ( productData.upsell == 0) {
      //   res.redirect('/emptyCart')
      // }

      Product.find({ SuperProductID: productData._id, variant: true }).exec(function(error, productSub) {
        if (error) {
          return next(error);
        } else {



          //console.log(productSub); JSON.parse
          // let reqq= JSON.parse(req);

          console.log(req.headers.host)
          console.log(req.headers.referer)

          return res.render('upSell', { title: 'Product', productData: productData, ShowModal: ShowModal, Q: Q, productSub: productSub, currentURL: req });


        }
      });


    }
  });

});






router.get('/test', function(req, res, next) {
  return res.render('test')
});



router.get('/category/:categoryNo', function(req, res, next) {
  const { categoryNo } = req.params;

  Product.find({ categoryNo: categoryNo, status: "A" }).sort({ productNo: 1 }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      if (productData[0]) { var title = productData[0].categoryName }
      else { var title = categoryNo }

      return res.render('category', { title: title, productData: productData });

    }
  });

});


router.get('/product/:productNo', function(req, res, next) {
  const { productNo } = req.params;
  const { ShowModal } = req.query;
  const { Q } = req.query;


  Product.findOne({ productNo: productNo }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      Product.find({ SuperProductID: productData._id, variant: true }).exec(function(error, productSub) {
        if (error) {
          return next(error);
        } else {



          //console.log(productSub); JSON.parse
          // let reqq= JSON.parse(req);

          console.log(req.headers.host)
          console.log(req.headers.referer)
          return res.render('product', { title: productData.name, productData: productData, ShowModal: ShowModal, Q: Q, productSub: productSub, currentURL: req });


        }
      });


    }
  });

});


const accountSid = 'ACa3ea7f269ecdff5eedf49b833ec2c5b9';
const authToken = 'c300ca1c68fb6b403bd4e68f9c06876f';
const client = require('twilio')(accountSid, authToken);

router.get('/sms', function(req, res, next) {
  client.messages.create({
    body: 'Thank your for order form TingStore شكرا لطلبك',
    from: '+12149831341',
    to: '+96551755332'
  }, function(err, data) {
    if (err) {
      console.log(err);
    }
    console.log(data)
  })
    .then(message => console.log(message.sid));

});

router.get('/editProductQuantite2/:productID/:newQuantity/:newPrice', function(req, res) {
  const { productID } = req.params;
  const { newQuantity } = req.params;
  const { newPrice } = req.params;
  var old = req.session.cartData0;

  console.log("productID: " + productID)
  console.log("newQuantity: " + newQuantity)
  console.log("newPrice: " + newPrice)
  console.log("old: " + old)

  try {
    var data = {
      quantity: 0,
      price: 0,
      totalPrice: 0
    }

    if (old) {
      old.forEach(function(product, index, array) {
        if (product.ID == productID) {
          console.log("product: " + JSON.stringify(product));
          console.log("array[index]: " + JSON.stringify(array[index]));
          array[index].Price = Number(newPrice)
          array[index].Quantity = Number(newQuantity)


        }

      })
    }
  } finally {
    console.log("old: " + JSON.stringify(old))

    req.session.save(function(err) {

      req.session.cartData0 = old;
      return res.send("done");
    })
  }

})


router.get('/editProductQuantite2/:productID/:newQuantity', function(req, res) {
  const { productID } = req.params;
  const { newQuantity } = req.params;
  var old = req.session.cartData0;

  // console.log("you reached editProductQuantite")

  try {
    var data = {
      quantity: 0,
      price: 0,
      totalPrice: 0
    }
    var indexToSplice = 1000000;


    if (req.session.cartData0) {
      old.forEach(function(product, index, array) {
        // data.totalPrice += product.Price*1000 * product.Quantity/1000;
        console.log("product.Price " + product.Price)
        if (product.ID == productID) {
          data.totalPrice += product.Price * 1000 * newQuantity / 1000;
          if (newQuantity == 0) {
            // array.splice(index, 1);
            indexToSplice = index;
            data.quantity = newQuantity;
            data.price = product.Price;
          } else {
            array[index].Quantity = newQuantity;
            data.quantity = newQuantity;
            data.price = product.Price;
          }

        } else {
          data.totalPrice += product.Price * 1000 * product.Quantity / 1000;
        }
      });

    }
  } finally {
    if (indexToSplice != 1000000) {
      old.splice(indexToSplice, 1);
    }


    req.session.cartData0 = old;
    if (old.length == 0) {
      req.session.cartCount = null;
    }



    req.session.save(function(err) {
      req.session.cartData0 = old;
      return res.send(data);
    })
  }

})



router.get('/editProductQuantite/:productID/:newQuantity/:newPrice', function(req, res) {
  const { productID } = req.params;
  const { newQuantity } = req.params;
  const { newPrice } = req.params;
  var old = req.session.cartData0;

  console.log("newQuantity :" + newQuantity);
  console.log("newPrice :" + newPrice);
  console.log(1);
  console.log(newPrice);

  // console.log("you reached editProductQuantite")

  try {
    var data = {
      quantity: 0,
      price: 0,
      totalPrice: 0
    }
    var indexToSplice = 1000000;

    console.log(2);


    if (req.session.cartData0) {
      old.forEach(function(product, index, array) {
        // data.totalPrice += product.Price*1000 * product.Quantity/1000;
        // console.log("product.Price " + product.Price)
        console.log(3);
        if (product.ID == productID) {
          data.totalPrice += newPrice * 1000 * newQuantity / 1000;
          if (newQuantity == 0) {
            // array.splice(index, 1);
            indexToSplice = index;
            data.quantity = newQuantity;
            data.price = newPrice;

            console.log(4);
          } else {
            // console.log("array[index]  " + JSON.stringify(array[index]));

            array[index].Quantity = newQuantity;
            array[index].Price = newPrice;
            // console.log(newPrice);
            // console.log("array[index]  " + JSON.stringify(array[index]));

            data.quantity = newQuantity;
            data.price = newPrice;

            console.log(5);
          }

        } else {
          data.totalPrice +=
            newPrice * 1000 * product.Quantity / 1000;
          console.log(6);
          console.log(newPrice * 1000 * product.Quantity / 1000)

        }
      });

    }
  } finally {
    if (indexToSplice != 1000000) {
      old.splice(indexToSplice, 1);
      console.log(7);
    }


    req.session.cartData0 = old;
    if (old.length == 0) {
      req.session.cartCount = null;
      console.log(8);
    }



    req.session.save(function(err) {
      console.log(9);
      console.log(old);
      console.log(data);
      req.session.cartData0 = old;
      return res.send(data);
    })
  }

})





router.get('/cart', function(req, res, next) {

  var cartIDs = [];
  var productData = [];
  var cartData = [];
  var orderData = {};

  console.log("theSaleseman: " + req.session.theSaleseman);
  console.log("manager: " + req.session.manager);

  var renderCart = "cart";
  if (req.session.theSaleseman || req.session.manager) {
    renderCart = "cart2";
  }


  if (req.session.orderID == null && req.session.cartData0 == null) {
    // cart totally empty and the User just get in without adding any product
    // Rout him to the cart so he can see Empty Cart
    return res.render('cart', { title: 'Cart', cartData: productData, cartData2: cartData });

  } else if (req.session.orderID == null && req.session.cartData0 != null) {
    // The User have added product to Cart and we SHOULD make for him orderID here
    // Create Order then route to the Cart
    createOrder_SafeOrederIdToSession_thenRout();

  } else if (req.session.orderID != null && req.session.cartData0 == null) {
    // Cart empty and we had made for him order 
    // this scenario not possible
    // Do nothing
  } else if (req.session.orderID != null && req.session.cartData0 != null) {
    // The User have added product to Cart and we have made for him orderID here
    // Just Rout him to the Cart to see his Cart
    findProductsThenRoute()
  }


  function createOrder_SafeOrederIdToSession_thenRout() {
    Order.create(orderData, function(error, theOrder) {
      if (error) {
        console.log(error.code);
        return next(error);
      } else {
        // console.log("ORDER CREATED")
        // console.log("ORDER ID: " + theOrder.id)
        req.session.orderID = theOrder.id;
        req.session.save(function(err) {
          // session saved
          // res.redirect('/')
          findProductsThenRoute()
        })
      }
    });
  }

  function findProductsThenRoute() {
    var cartIDs = [];
    var cartData = req.session.cartData0;
    if (cartData) {
      cartData.forEach(function(product, index, array) {
        cartIDs.push(product.ID);
      });
    }

    Product.find({ _id: { $in: cartIDs } }).exec(function(error, productData) {
      // console.log("cartIDs:  " + cartIDs)
      // console.log("cartData: " + JSON.stringify(cartData))


      City.findOne({ _id: "63ad38dee77cc01557b258e4" }).exec(function(error, citytData) {
        if (error) {
          return next(error);
        } else {



          // return res.render('product', { title: 'Product]', productData: productData, ShowModal:ShowModal, Q:Q });
          return res.render(renderCart, { title: 'Cart', cartData: productData, cartData2: cartData, citytData: citytData });


        }
      });

    });
  }

})



router.post('/AddOrder2', function(req, res, next) {



  var cartIDs = [];
  var cartData = req.session.cartData0;
  var orderID = req.session.orderID;
  var IDs = []; var Names = []; var Prices = []; var Quantities = []; var Costs = []; var Warranties = [];

  var orderData = {
    'mobile': req.body.mobile,
    'invoice': req.body.invoice,
    'address': req.body.address,
    'discount': req.body.discount,
    'customerName': req.body.customerName,
    'shippingCost': req.body.shippingCost,
    // 'userID': req.body.userID,    
    // 'email': req.body.email,    
    // 'ID_CITY': req.body.city.split("#")[0],
    // 'shippingCost': req.body.city.split("#")[1],
    // 'city': req.body.city.split("#")[2],
  };


  // console.log("req.session");
  // console.log(req.session);
  // console.log("req.body");
  // console.log(JSON.stringify(req.body));

  cartData.forEach(function(product, index, array) {
    Names.push(product.Name);
    cartIDs.push(product.ID);
    Prices.push(product.Price);
    Quantities.push(product.Quantity);
    Warranties.push(product.warranty);
  });



  Product.find({ _id: { $in: cartIDs } }, { name: 1, price: 1, discountPrice: 1, cost: 1, warranty: 1, productNo: 1 }).exec(function(error, productData) {

    cartData.forEach(function(product, index, array) {
      let z = product.productNo;
      console.log("z(" + index + "): " + z);
      let obj2 = productData.find(o => o.productNo === z);
      Costs.push(obj2.cost);

    })

    FindOrderAndUpdate();

  })




  function FindOrderAndUpdate() {

    arr_update_dict = { "$set": {} };
    arr_update_dict["$set"]["cost"] = Costs;
    arr_update_dict["$set"]["price"] = Prices;
    arr_update_dict["$set"]["productNames"] = Names
    arr_update_dict["$set"]["productIDs"] = cartIDs;
    arr_update_dict["$set"]["quantity"] = Quantities;
    arr_update_dict["$set"]["warranty"] = Warranties;


    arr_update_dict["$set"]["warehouse"] = "qurain";
    arr_update_dict["$set"]["mobile"] = orderData.mobile;
    arr_update_dict["$set"]["address"] = orderData.address;
    arr_update_dict["$set"]["invoice"] = orderData.invoice;
    arr_update_dict["$set"]["discount"] = orderData.discount;
    arr_update_dict["$set"]["customerName"] = orderData.customerName;
    arr_update_dict["$set"]["shippingCost"] = orderData.shippingCost;
    // arr_update_dict["$set"]["userID"] = orderData.userID;    
    // arr_update_dict["$set"]["email"] = orderData.email;
    // arr_update_dict["$set"]["ID_CITY"] = orderData.ID_CITY;    
    // arr_update_dict["$set"]["city"] = orderData.city;




    Order.findOneAndUpdate({ _id: orderID }, arr_update_dict).then(function() {
      req.session.cartData0 = null;
      req.session.orderID = null;
      req.session.cartCount = null;
    
      req.session.save(function(err) {
        // session saved
        res.redirect('/manager/orderPage/'+orderID)
      })
      
    })
  }

})

// POST /AddOrder 
router.post('/AddOrder', function(req, res, next) {

  console.log("......req.session.mutlaa" + req.session.mutlaa);

  var cartIDs = [];
  var cartData = req.session.cartData0;
  var orderID = req.session.orderID;

  if (cartData == null) { res.redirect('/cart') }

  var orderData = {
    'userID': req.body.userID,
    'customerName': req.body.customerName,
    'mobile': req.body.mobile,
    'email': req.body.email,
    'address': req.body.address,
    'ID_CITY': req.body.city.split("#")[0],
    'shippingCost': req.body.city.split("#")[1],
    'city': req.body.city.split("#")[2],

  };

  console.log("orderData");

  console.log(orderData);
  console.log(req.body);

  var IDs = []; var Names = []; var Prices = []; var Quantities = [];

  cartData.forEach(function(product, index, array) {
    cartIDs.push(product.ID);
  });



  Product.find({ _id: { $in: cartIDs } }, { name: 1, price: 1, discountPrice: 1 }).exec(function(error, productData) {

    productData.forEach(function(product, index) {
      IDs[index] = product._id
      Names[index] = product.name
      Prices[index] = product.price
      if (product.discountPrice != 0) { Prices[index] = product.discountPrice }
      Quantities[index] = cartData[index].Quantity
      if (req.session.mutlaa) { Prices[index] = product.discountPrice };
    });


    arr_update_dict = { "$set": {} };
    arr_update_dict["$set"]["productIDs"] = IDs;
    arr_update_dict["$set"]["quantity"] = Quantities;
    arr_update_dict["$set"]["productNames"] = Names;
    arr_update_dict["$set"]["price"] = Prices;

    arr_update_dict["$set"]["warehouse"] = "qurain";
    arr_update_dict["$set"]["userID"] = orderData.userID;
    arr_update_dict["$set"]["customerName"] = orderData.customerName;
    arr_update_dict["$set"]["mobile"] = orderData.mobile;
    arr_update_dict["$set"]["email"] = orderData.email;
    arr_update_dict["$set"]["address"] = orderData.address;
    arr_update_dict["$set"]["ID_CITY"] = orderData.ID_CITY;
    arr_update_dict["$set"]["shippingCost"] = orderData.shippingCost;
    arr_update_dict["$set"]["city"] = orderData.city;


    Order.findOneAndUpdate({ _id: orderID }, arr_update_dict).then(function() {
      //res.redirect('/send')

      res.redirect(url.format({
        pathname: "manager/send",
        query: {
          "user": "customer",
          "orderID": orderID,
          "mobile": orderData.mobile,
          "massege": "تم استلام طلب جديد"
        }
      }));
      //res.redirect('/emptyCart')
    })


    // res.redirect('/cart')
  });



})







// GET /emptyCart
router.get('/emptyCart', function(req, res, next) {
  // if (!req.session.cartData0){
  req.session.cartData0 = null;
  req.session.orderID = null;
  req.session.cartCount = null;

  req.session.save(function(err) {
    // session saved
    return res.redirect('/orderReceived');
  })
  // }


});

// addToCart
router.post('/cart', function(req, res, next) {
  var productExistInCart = false;
  const host = req.headers.host;
  var hostNew = "";

  if (host == "localhost:3000") {
    hostNew = "itcstore.net";
  } else {
    hostNew = host;
  }
  var newProduct = {
    ID: req.body.productId,
    Name: req.body.name,
    Quantity: parseInt(req.body.quantity),
    Price: parseFloat(req.body.price),
    productNo: parseFloat(req.body.productNo),
    parentNo: parseFloat(req.body.parentNo),
    warranty: parseFloat(req.body.warranty),
    // total : parseInt(req.body.quantity)*parseFloat(req.body.price)
  }


  console.log("req.session.cartData0" + req.session.cartData0);


  if (!req.session.cartData0) {
    req.session.cartData0 = []
    var old = req.session.cartData0;
  } else {

    var old = req.session.cartData0;
    var productExistInCart = false;

    old.forEach(function(product, index, array) {
      if (product.ID == req.body.productId) {
        array[index].Quantity += newProduct.Quantity;
        productExistInCart = true;
      }
    });
  }

  if (productExistInCart) {
    req.session.cartData0 = old;
    req.session.save(function(err) {
      // session saved
      return res.redirect(`https://${hostNew}/product/${newProduct.parentNo}?ShowModal=yes&Q=${newProduct.Quantity}`);
    })
  } else {
    old.push(newProduct);
    req.session.cartData0 = old;
    req.session.cartData0 = old;
    req.session.cartCount = req.session.cartData0.length;
    // console.log(req.session.cartData0.length);
    req.session.save(function(err) {
      // session saved
      return res.redirect(`https://${hostNew}/product/${newProduct.parentNo}?ShowModal=yes&Q=${newProduct.Quantity}`);
    })
  }

})





// GET /product 
router.get('/product/:id', function(req, res, next) {
  const { id } = req.params;
  Chapter.findOne({ _id: id }).exec(function(error, productData) {
    if (error) {
      // console.log(error.name);
      if (error.name == 'CastError') {
        var err = new Error('File Not Found');
        err.status = 404;
        next(err);
      }
      return next(error);
    } else if (productData == null) {
      var err = new Error('File Not Found');
      err.status = 404;
      next(err);
    } else {
      return res.render('product', { title: 'Product', productData: productData });
    }
  });

});

router.get('/forgotPassword', function(req, res, next) {
  // res.render('forgotPassword', { title: 'Reset Password'} )
  return res.render('forgotPassword', { title: 'Reset Password' });
})

router.post('/sendResetEmail', function(req, res, next) {

  const output = 'Email Body';

  // console.log(req.body.email);
  // res.send(req.body.email);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.ethereal.email',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: "add014mam@gmail.com", // generated ethereal user
      pass: "Aldhufiri014" // generated ethereal password
    }
  });

  let mailOptions = {
    from: 'add014mam@gmail.com',
    to: req.body.email,
    subject: 'Resset Password',
    text: 'You are trying to reset your password!'
  }

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log(err)
      res.send('error ocurs');
    } else {
      res.send('email sent!!!');
    }
  });

})


// Get  /Course
router.get('/Course/:id', function(req, res, next) {
  const { id } = req.params;
  Course.findOne({ _id: id }).exec(function(error, courseData) {
    if (error) {
      // console.log(error.name);
      if (error.name == 'CastError') {
        var err = new Error('File Not Found');
        err.status = 404;
        next(err);
      }
      return next(error);
    } else {
      var find = Chapter.find({ courseID: id }).sort({ order: 1 }).exec(function(error, ChaptersData) {
        try {
          // // console.log(ChaptersData)
          var ChaptersDataEdited = [];

          if (req.session.userId) {
            // console.log(req.session.userId);
            var subscriptions = User.findById(req.session.userId)
              .exec(function(error, user) {
                if (error) {
                  return next(error);
                } else {
                  // // console.log( "name:"+ user.name+ " / favorite:"+ user.favoriteBook + " / subscription:" + user.subscription );
                  // console.log('xxx---xxxx')
                  passPermitedLinks(user.subscription);
                }
              })
          } else {
            passPermitedLinks("NoUserSignedIn")
          }

          function passPermitedLinks(subscription) {
            try {

              for (const chapter of ChaptersData) {

                if (chapter.price > 0) {
                  // console.log(chapter._id)

                  if (subscription != "NoUserSignedIn") {
                    function checkSubscription(sub) {
                      return sub == chapter._id;
                    }


                    var x = subscription.some(checkSubscription);
                    // console.log(subscription.some(checkSubscription))
                  }


                  if (x) {
                    // not free ==> But subscribed
                    chapter.status = 'subscribed';
                  } else {
                    // not free not subscribed
                    chapter.sectionsLinks = [null];
                  }
                  // chapter is not free the user can not see links unless he has paid

                } else {
                  // chapter is free the user can see links
                  chapter.status = 'free';
                }
              }
              return res.render('Course', { title: 'Course', courseData: courseData, ChaptersData: ChaptersData });
            } catch (e) {
              return next(e);
            }
          }
        } catch (e) {
          return next(e);
        }

      })
    }
  });
});


// GET /redirect
router.get('/redirect', function(req, res, next) {
  // console.log("__________Redirect has been called______");

  const { tap_id } = req.query;
  console.log(tap_id);

  var http = require("https");

  var options = {
    "method": "GET",
    "hostname": `api.tap.company`,
    "port": null,
    "path": `/v2/charges/${tap_id}`,
    "headers": {
      "authorization": "Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ"
    }
  };

  var req = http.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    res.on("end", function() {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write("{}");
  req.end();

});


router.get('/redirect2', function(req, res, next) {
  var request = require("request");

  // console.log("__________Redirect2 has been called______");

  const { tap_id } = req.query;
  // console.log(tap_id);

  var options = {
    method: 'GET',
    url: `https://api.tap.company/v2/charges/${tap_id}`,
    headers: { authorization: 'Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ' },
    body: '{}'
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    bodyJSON = JSON.parse(body)
    // console.log(body);

    if (bodyJSON.response) {
      const status = bodyJSON.response.message;
      console.log(`_Redirect2 _______________________________`)
      console.log(`   - Charge Id=${bodyJSON.id}`)
      console.log(`   - status = ${status}`)
      console.log(`   - MetaData = ${JSON.stringify(bodyJSON.metadata)}`)


      console.log(`__________________________________________`)



      Charge.findOne({ _id: bodyJSON.metadata.ChargeID }).exec(function(error, chargeData) {
        if (error) {
          // console.log(error.name);
          return next(error);
        } else {
          if (status == "Captured") {
            req.session.cartData0 = []
            req.session.save(function(err) {
              // session saved
              // return res.redirect('cart');
              return res.render('redirect', { title: 'Payment Statment', status: status, chargeData: chargeData, courseId: "courseId" });
            })
          } else {
            return res.render('redirect', { title: 'Payment Statment', status: status, chargeData: chargeData, courseId: "courseId" });
          }
        }
      });
    } else {
      var err = new Error('Error P01');
      // err.status = 404;
      return next(err);
    }


  });


});


// post /pay /// this should connet tap payment
router.post('/pay', async function(req, res1, next) {
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  var internalChgId = makeid(8);

  var http = require("https");
  const id = req.body.chapterId;
  const host = req.headers.host;
  const referer = req.headers.referer;

  const userData = req.body;

  userData.host = req.headers.host;
  userData.referer = req.headers.referer;
  userData.userId = "Guest";

  // console.log("userData: "+ JSON.stringify(userData));

  var totalPrice = 0;

  var cartIDs = []; // to use in find
  var cartData = req.session.cartData0;
  cartData.forEach(function(product, index, array) {
    cartIDs.push(product.ID);
  });

  // todo: use same in cart
  Chapter.find({ _id: { $in: cartIDs } }, { name: 1, price: 1 }).exec(function(error, productData) {
    if (error) {
      // console.log(error.name);
      if (error.name == 'CastError') {
        var err = new Error('File Not Found');
        err.status = 404;
        next(err);
      }
      return next(error);
    } else {
      var ProductIDs = [];
      var Quantity = [];
      var Price = [];
      var Name = [];
      // console.log("productData: "+productData);
      // console.log("cartData: "+cartIDs);
      for (var i = 0; i < productData.length; i++) {
        console.log("productData(" + i + "): " + productData[i]._id);
        console.log("cartData(" + i + ")   : " + cartData[i].ID);
        console.log("cartIDs(" + i + ")    : " + cartIDs[i]);

        if (productData[i]._id == cartData[i].ID) {

          ProductIDs.push(productData[i]._id);
          Quantity.push(parseInt(cartData[i].Quantity));
          Price.push(productData[i].price);
          Name.push(productData[i].name);

          totalPrice += productData[i].price * 1000 * cartData[i].Quantity / 1000;

        } else {
          var err = new Error('Error E0001');
          err.status = 404;
          next(err);
        }
      }

      chargeData = {
        ProductIDs: ProductIDs,
        Quantity: Quantity,
        Price: Price,
        Name: Name,
        CustomerID: userData.userId,
        CustomerName: userData.name,
        TotalPrice: totalPrice,
        Email: userData.email ? userData.email : 'none@none.none',
        Mobile: userData.mobile,
        Address: userData.address,
        InternalChgId: internalChgId,
        Status: "onProgress"
      }


      console.log("chargeData: " + JSON.stringify(chargeData));
      console.log("chargeData: " + chargeData);
      console.log("TotalPrice: " + chargeData.TotalPrice);


      // payforThis(chargeData, userData, totalPrice);
      Charge.create(chargeData, function(error, ChargeResult) {
        if (error) {
          console.log(error.code);
        } else {
          console.log("ChargeResult: " + JSON.stringify(ChargeResult));
          payforThis(ChargeResult);
        }
      });
    }
  })

  function payforThis(ChargeResult) {
    var options = {
      "method": "POST",
      "hostname": "api.tap.company",
      "port": null,
      "path": "/v2/charges",
      "headers": {
        "authorization": "Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ",
        "content-type": "application/json"
      }
    };

    // console.log("dataToPay"+JSON.stringify(dataToPay));

    var req = http.request(options, function(res) {
      var chunks = [];

      res.on("data", function(chunk) {
        chunks.push(chunk);
      });

      res.on("end", function() {
        var body = Buffer.concat(chunks);
        // // console.log(body.toString());
        var profile = JSON.parse(body);
        if (!profile.transaction) {
          console.log("profile.transaction)");
          var err = new Error('Error E002: Payment Gateway Error');
          next(err);
        } else {
          transactionUrl = profile.transaction.url;
          return res1.redirect(transactionUrl)
        }
      });
    });

    req.write(JSON.stringify({
      amount: ChargeResult.TotalPrice,
      currency: 'KWD',
      threeDSecure: true,
      save_card: false,
      description: 'TengStore payment',
      statement_descriptor: "pay for products",


      metadata: {
        ChargeID: ChargeResult._id,
        InternalChgId: ChargeResult.InternalChgId
      },

      reference: { transaction: 'txn_0001', order: 'ord_0001' },
      receipt: { email: false, sms: true },
      customer:
      {
        first_name: ChargeResult.CustomerName,
        middle_name: "userId",
        last_name: 'test',
        email: ChargeResult.Email,
        phone: { country_code: '965', number: ChargeResult.Mobile }
      },
      source: { id: 'src_kw.knet' },
      post: { url: `https://${host}/getPay` },
      redirect: { url: `https://${host}/redirect2` }
    }));
    req.end();
  }


});

// GET /Courses Page /safe
router.get('/', function(req, res, next) {
  Course.find({}).exec(function(error, courseData) {
    if (error) {
      return next(error);
    } else {
      Chapter.find({}).exec(function(error, chapterData) {
        if (error) {
          return next(error);
        } else {


          return res.render('CoursesPage', { title: 'Home Page', courseData: courseData, chapterData: chapterData });
        }
      });

      // return res.render('CoursesPage', { title: 'Home Page', courseData: courseData, length: courseData.length});
    }
  });
});



// POST /
router.post('/getPay', function(req, res, next) {
  // 


  var chargeData = {
    ChargeID: req.body.metadata.ChargeID,
    InternalChgId: req.body.metadata.InternalChgId,
  }

  console.log("status:       " + req.body.status.toLowerCase());
  console.log("ChargeID:     " + chargeData.ChargeID);
  console.log("InternalChgId:" + chargeData.InternalChgId);


  arr_update_dict = { "$set": {} };
  arr_update_dict["$set"]["status"] = req.body.status.toLowerCase();
  Charge.findOneAndUpdate({ _id: chargeData.ChargeID }, arr_update_dict).then(function() {
    if (error) {
      console.log(error.code);
    } else {
      return res.send('getPay has been called -1');
    }
  })

  // todo 2020 find user and update
  // User.findOneAndUpdate({_id: chargeData.userId},
  //   {$push:
  //     {
  //       subscription: chargeData.chapterId,
  //       charge: chargeData.charge,
  //       courseName: chargeData.courseName,
  //       chapterName: chargeData.chapterName,
  //     }
  //   }).then(function(){

  //     Charge.create(chargeData, function (error, user) {
  //       if (error) {
  //         console.log(error.code);
  //       } else {
  //         return res.send('getPay has been called -1');
  //       }
  //     });

  // }).catch(function(error){
  //   return next(error);
  // });

  // return res.send('getPay has been called -2');
});



// GET /about /safe
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact /safe
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});



// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', function(req, res, next) {
  console.log(req)
  // console.log('login from main')
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email.toLowerCase(), req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.manager = user.admin;
        req.session.theSaleseman = user.saleseman;
        req.session.userName = user.name;
        console.log("admin: " + user.admin)
        console.log("saleseman: " + user.saleseman)

        // return res.redirect('/');
        req.session.save(function(err) {
          // session saved
          res.redirect('/')
        })
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  console.log(req)
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword) {

    // confirm that user typed same password twice
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    // create object with form input
    var userData = {
      email: req.body.email.toLowerCase(),
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password,
    };

    // use schema's `create` method to insert document into Mongo
    User.create(userData, function(error, user) {
      if (error) {
        console.log(error.code);
        if (error.code === 11000) {
          // res.redirect('back')
          var err = new Error('Email already registered.');
          // err.status = 400;
          return next(err);
        }
        return next(error);
      } else {
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.save(function(err) {
          // session saved
          res.redirect('/')
        })
        // return res.redirect('/');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
module.exports = router;
