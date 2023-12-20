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
const keys = require('../config/keys');
var nodemailer = require('nodemailer');




router.get('/send', function(req, res) {

  const { user } = req.query;
  const { orderID } = req.query;
  const { mobile } = req.query;
  const { massege } = req.query;
  const { color } = req.query;
  const { KentStatus } = req.query;
  const { orderNo } = req.query;

  console.log("orderID:" + orderID)

 

   const output = 'Email Body';
  // get it from here https://myaccount.google.com/apppasswords
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eng.dugaim@gmail.com',
    pass: 'kioxedtstdtierbv'
  }
    
});

var mailOptions = {
  from: 'eng.dugaim@gmail.com',
  to: 'eng.dugaim@gmail.com, ting.storee@gmail.com',
  subject: `${massege} رقم الطلب: ${orderID}`,
  text: `mobile: ${mobile},
  orderID: ${orderID}. 
  https://www.tingstorekw.com/manager/orderPage/${orderID}, 
  color: ${color},
  KentStatus: ${KentStatus},
  source: ${req.session.source}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);

    if (KentStatus == "CAPTURED") {
      req.session.cartData0 = null;
      req.session.orderID = null;
      req.session.cartCount = null;
    
      req.session.save(function(err) {
        // session saved
        return res.render('redirectAfterPayment', { title: 'Order' , KentStatus:KentStatus, orderNo:orderNo});
      })
      
    } else if (KentStatus == "CANCELLED") {
      return res.render('redirectAfterPayment', { title: 'Order' , KentStatus:KentStatus, orderNo:orderNo});
    } else if (KentStatus == "FAILED") {
      return res.render('redirectAfterPayment', { title: 'Order' , KentStatus:KentStatus, orderNo:orderNo});
    }else {
      res.redirect('emptyCart')
    }
    
  }
}); 
  
})


var mid = require('../middleware');

var nodemailer = require('nodemailer');
const url = require('url');

//Get // editCoureName
router.get('/modal', function(req, res){
  console.log("modal modal");
  return res.render('includes/modal', { title: 'here we are'});
})


router.get('/sitemap2.xml', function(req, res) {
res.sendFile('/sitemap.xml');
});


router.get('/invoicePrint/:id', function(req, res, next) {

  const { id } = req.params;
  
  const googleAPI = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="
  const ourLink = `${keys.internal.host}/orderStatus/${id}`
  const payLink = googleAPI + ourLink

  

  Order.findOne({ _id: id }).exec(function(error, orderData) {
    if (error) {
      return next(error);
    } else {
      return res.render('invoicePrint', { title: `invoice no: ${orderData.orderNo}` , orderData: orderData, payLink:payLink });
    }
  })

  


})


router.post('/Disc', function(req, res, next) {

  var code = req.body.code;




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

  return res.render('redirect', { title: 'Order' });


});




router.get('/mutlaa', function(req, res, next) {
  // res.send('Hello World!')
  req.session.mutlaa = true;
  req.session.save(function(err) {
    // session saved
    return res.render('mutlaa', { title: 'ITC Discount' });
  })


});


router.get('/category/:category',async function(req, res, next) {
  const { category } = req.params;


  try {

    const productDataAll = await Product.find({ "category": category, showInWebsite: true}).sort({ productNo: 1 })
    const categoryData = await Category.findOne({ "URLname": category})
    const subCategoryData = await Category.find({ "parent": categoryData.thisCategory })


    return res.render('category', { title: categoryData.name, productDataAll: productDataAll, categoryData:categoryData, subCategoryData:subCategoryData });

    
  } catch (error) {
    return next(error);
  }
});

router.get('/search',async function(req, res, next) {
  const { text } = req.query;


  

  try {
   

    const productSearch = await Product.aggregate(
      [
        {
          $search: {
            index: "TheITCSearch",
            text: {
              query: text,
              path: {
                wildcard: "*"
              }
            }
          }
        }
      ]
    )
    
   

    return res.render('search', { title: `Search result for: ${text}`,text:text, productSearch: productSearch });

    
  } catch (error) {
    return next(error);
  }
});




router.get('/', async function(req, res, next) {
  // res.send('Hello World!')

  console.log("router //")

  var productDataAll = [];
  var categoriesPass = [];

  try {
    const categoryData = await Category.find({}).sort({ categoryNo: 1 })
    
    
    

    
    for (let i = 0; i < categoryData.length; i++) {
      if ( categoryData[i].parent == "/") {        
        categoriesPass.push(categoryData[i])
        var prouct = await Product.find({ "category": categoryData[i].URLname, showInWebsite: true})
        productDataAll.push(prouct)
      }
    }

    
    
    
    return res.render('home', { title: 'Home', categoryData: categoryData, productDataAll:productDataAll, categoriesPass : categoriesPass});
  } catch (error) {
    return next(error);
  }
});


router.post('/upSellApprove', function(req, res, next) {

  var cartData = req.session.cartData0;


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
        return next(error);
      } else {
       
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
  
  //     return next(error);
  //   } else {
  
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

 

  if (!req.session.cartData0) {
   
    req.session.cartData0 = []
    var old = req.session.cartData0;
    res.redirect('/')
  } else {
   

    var old = req.session.cartData0;
  }


  cartData = old;


  return res.render('upSell2', { title: 'Product', cartData: cartData })
})




// /upSellAdd/:productNo
router.get('/upSellAdd/:productNo/:upsellPrice', function(req, res, next) {
  const { productNo } = req.params;
  const { upsellPrice } = req.params;

 

  var productExistInCart = false;
  const host = req.headers.host;
  var hostNew = "";

  Product.findOne({ productNo: productNo }).exec(function(error, productData) {

    if (productData.upsell == 0) {
      res.redirect('/emptyCart')
    }

   
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

        

        newProduct.Price = productData.price;
        newProduct.upsell = productData.upsell;
        newProduct.isUpSellSecond = true
      }

     

      if (!req.session.cartData0) {
        if (upsellPrice != productData.discountPrice) {
          newProduct.upsell = productData.discountPrice;
        }

        req.session.cartData0 = []
        var old = req.session.cartData0;


      } else if (newProduct.isUpSellSecond) {


        var old = req.session.cartData0;




      } else {
        
        req.session.cartData0 = []
        var old = req.session.cartData0;
      }

      // req.session.cartData0 = []
      var old = req.session.cartData0;
     

      cartData = req.session.cartData0;

      old.push(newProduct);
      req.session.cartData0 = old;
      req.session.cartData0 = old;
      req.session.cartCount = req.session.cartData0.length;
      
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



         

          return res.render('upSell', { title: 'Product', productData: productData, ShowModal: ShowModal, Q: Q, productSub: productSub, currentURL: req });


        }
      });


    }
  });

});






router.get('/test', function(req, res, next) {

  arr_update_dict = { "$set": {} };
  arr_update_dict["$set"]["KentStatusBackEnd"] = "yyy";

  Order.findOneAndUpdate({ _id: "6502b878222dfa25640b0666" }, arr_update_dict).then(function() {
    req.session.cartData0 = null;
    req.session.orderID = null;
    req.session.cartCount = null;
  
    req.session.save(function(err) {
      // session saved
      return res.render('test')
    })
    
  })
  
  
});



router.get('/category/:category', function(req, res, next) {
  const { category } = req.params;
  //, status: "A" 
  Product.find({ "category": category, showInWebsite: true}).sort({ productNo: 1 }).exec(function(error, productData) {
    if (error) {
      return next(error);
    } else {

      Category.findOne({ "URLname": category},  { name: 1} ).exec(function(error, categoryData) {
        if (error) {
          return next(error);
        } else {
          
          


          
          
          return res.render('category', { title: categoryData.name, productData: productData, categoryData:categoryData });
        }
      });
    }
  });

});


router.get('/product/:url', function(req, res, next) {
  const { url } = req.params;
  const { ShowModal } = req.query;
  const { Q } = req.query;


  
  try {
    Product.findOne({ url: url }).exec(function(error, productData) {
      if (error) {
        return next(error);
      } else {

        var title = ""
        if(productData){
          title = productData.name
        }
        if (ShowModal == "yes")  {
          return res.render('product2', { title: title, productData: productData, ShowModal:ShowModal, Q:Q});
        } else {
          return res.render('product', { title: title, productData: productData, ShowModal:ShowModal, Q:Q});
        }
       
  
      }
    });

    
  } catch (error) {
    return next(error);
  }
  
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
   
  })
    .then(message => console.log(message.sid));

});

router.get('/editProductQuantite2/:productID/:newQuantity/:newPrice', function(req, res) {
  const { productID } = req.params;
  const { newQuantity } = req.params;
  const { newPrice } = req.params;
  var old = req.session.cartData0;

 

  try {
    var data = {
      quantity: 0,
      price: 0,
      totalPrice: 0
    }

    if (old) {
      old.forEach(function(product, index, array) {
        if (product.ID == productID) {
          
          array[index].Price = Number(newPrice)
          array[index].Quantity = Number(newQuantity)


        }

      })
    }
  } finally {
    

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
        
        
        if (product.ID == productID) {
          data.totalPrice += newPrice * 1000 * newQuantity / 1000;
          if (newQuantity == 0) {
            // array.splice(index, 1);
            indexToSplice = index;
            data.quantity = newQuantity;
            data.price = newPrice;

            
          } else {
            
            array[index].Quantity = newQuantity;
            array[index].Price = newPrice;
            
            data.quantity = newQuantity;
            data.price = newPrice;

            
          }

        } else {
          data.totalPrice +=
            newPrice * 1000 * product.Quantity / 1000;
          

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





router.get('/cart', function(req, res, next) {

  var cartIDs = [];
  var productData = [];
  var cartData = [];
  var orderData = {};

 
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
        return next(error);
      } else {
        
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

router.get('/orderStatus/:id', async function(req, res, next) {
  const { id } = req.params;
  const orderData = await Order.findOne({ _id: id})

  var shippingCost = Number(orderData.shippingCost)

  var totalPayed = 0;

  orderData.quantity.forEach(function(q, index, array) {
    totalPayed += orderData.quantity[index] * orderData.price[index]
  })

  console.log("totalPayed: " + totalPayed)
  var amount = totalPayed + shippingCost
  
  return res.render("orderStatus", { title: 'Order Status', orderData:orderData, amount:amount});
});






router.post('/AddOrder2', function(req, res, next) {



  var cartIDs = [];
  var cartData = req.session.cartData0;
  var orderID = req.session.orderID;
  var IDs = []; var Names = []; var Prices = []; var Quantities = []; var Variations = []; var Costs = []; var Warranties = [];

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

  


 

  cartData.forEach(function(product, index, array) {
    Names.push(product.Name);
    cartIDs.push(product.ID);
    Prices.push(product.Price);
    Quantities.push(product.Quantity);
    Variations.push(product.variation);
    Warranties.push(product.warranty);
  });



  Product.find({ _id: { $in: cartIDs } }, { name: 1, price: 1, discountPrice: 1, cost: 1, warranty: 1, productNo: 1 }).exec(function(error, productData) {

    cartData.forEach(function(product, index, array) {
      let z = product.productNo;
      
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
    arr_update_dict["$set"]["variation"] = Variations;
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

router.post('/AddOrder', function(req, res1, next) {
  var cartIDs = [];
  var cartData = req.session.cartData0;
  var orderID = req.session.orderID;

  console.log(orderID);

  if (cartData == null) { res.redirect('/cart') }

  var orderData = {
    'userID': req.body.userID,
    'payment_method': req.body.payment_method,
    'customerName': req.body.customerName,
    'mobile': req.body.mobile,
    'email': req.body.email,
    'address': req.body.address,
    'ID_CITY': req.body.city.split("#")[0],
    'shippingCost': req.body.city.split("#")[1],
    'city': req.body.city.split("#")[2],
  };

  console.log("orderData.shippingCost orderData.shippingCost orderData.shippingCost: " + orderData.shippingCost)
  

  //console.log("orderData.payment_method: " + orderData.payment_method);
  
  var IDs = []; var Names = []; var Prices = []; var Quantities = []; var Variations = [];  var warehouseNos = []

  cartData.forEach(function(product, index, array) {
    cartIDs.push(product.ID);
  });





  
  Product.find({ _id: { $in: cartIDs } }, { name: 1, price: 1, discountPrice: 1, discounted: 1, warehouseNo:1 }).exec(function(error, productData) {

    productData.forEach(function(product, index) {
      IDs[index] = product._id
      Names[index] = product.name
      Prices[index] = product.price
      warehouseNos[index] = product.warehouseNo
      if (product.discounted) { Prices[index] = product.discountPrice }
      
      if (req.session.mutlaa) { Prices[index] = product.discountPrice };

      cartData.forEach(function(cartProduct, index2) {
        if (cartProduct.ID == product._id) {
          Quantities[index] = cartProduct.Quantity
          Variations[index] = cartProduct.variation
        }
      })
  
      
    });

    var totalPayed = 0;

    Quantities.forEach(function(product, index, array) {
      totalPayed += Quantities[index] * Prices[index]
    })

    //console.log(" totalPayed: " + totalPayed)

    
    

    setOrder ()
    

    function setOrder () {
      arr_update_dict = { "$set": {} };
      arr_update_dict["$set"]["productIDs"] = IDs;
      arr_update_dict["$set"]["payment_method"] = orderData.payment_method;
      arr_update_dict["$set"]["quantity"] = Quantities;
      arr_update_dict["$set"]["variation"] = Variations;
      arr_update_dict["$set"]["productNames"] = Names;
      arr_update_dict["$set"]["price"] = Prices;
      arr_update_dict["$set"]["warehouseNo"] = warehouseNos;
      
      arr_update_dict["$set"]["warehouse"] = "qurain";
      arr_update_dict["$set"]["userID"] = orderData.userID;
      arr_update_dict["$set"]["customerName"] = orderData.customerName;
      arr_update_dict["$set"]["mobile"] = orderData.mobile;
      arr_update_dict["$set"]["email"] = orderData.email;
      arr_update_dict["$set"]["address"] = orderData.address;
      arr_update_dict["$set"]["ID_CITY"] = orderData.ID_CITY;
      arr_update_dict["$set"]["shippingCost"] = orderData.shippingCost;
      arr_update_dict["$set"]["city"] = orderData.city;
  

      function Sendmail() {
        res1.redirect(url.format({
          pathname: "manager/send",
          query: {
            "user": "customer",
            "orderID": orderID,
            "mobile": orderData.mobile,
            "massege": "تم استلام طلب جديد"
          }
        }));
      }
      
      Order.findOneAndUpdate({ _id: orderID }, arr_update_dict).then(function() {
      // res.redirect('/send')
        if (orderData.payment_method == "knet") {
          payforThis()
        } else if (orderData.payment_method == "cash") {
          Sendmail()
        }
      })
      
    }


    function payforThis() {
      var myWbsite = keys.internal.host;
      var postURL =  myWbsite + '/getPay';
      //console.log("myWbsite: " + myWbsite)
      //console.log("keys: " + keys.tapPayment.authorization)
      var shippingCost = Number(orderData.shippingCost)
      var amount = totalPayed + shippingCost
      var request = require("request");
      console.log("postURL: " + postURL)
      //console.log("keys.tapPayment.authorization: " + keys.tapPayment.authorization)

      var http = require("https");
      var options = {
        "method": "POST",
        "hostname": "api.tap.company",
        "port": null,
        "path": "/v2/charges",
        "headers": {
          "authorization": keys.tapPayment.authorization,
          "content-type": "application/json"
        }
      };

      var req = http.request(options, function(res) {
        var chunks = [];
  
        res.on("data", function(chunk) {
          chunks.push(chunk);
        });
  
        res.on("end", function() {
          var body = Buffer.concat(chunks);
          console.log("body.toString(): " + body.toString());
          var profile = JSON.parse(body);
          console.log("_______________________________________profile.transaction_______________________________________" + body.transaction)
          var transactionUrl = profile.transaction.url;
          console.log("transactionUrl: " + transactionUrl)
          return res1.redirect(transactionUrl);
  
        });

        
      });

      req.write(JSON.stringify({
        amount: amount,
        currency: 'KWD',
        threeDSecure: true,
        save_card: false,
        description: 'Test Description',
        statement_descriptor: 'Sample',
        metadata: { udf1: orderID, udf2: 'test 2' },
        reference: { transaction: 'txn_0001', order: 'tng' },
        receipt: { email: false, sms: true },
        customer:
        {
          first_name: orderData.customerName,
          middle_name: 'test',
          last_name: 'test',
          email: 'test@test.com',
          phone: { country_code: '965', number: orderData.mobile }
        },
        merchant: { id: '' },
        source: { id: 'src_kw.knet' },
        post: { url:postURL },
        redirect: { url:myWbsite + '/tapRedirect' }
      }));
      req.end();

  };

    
  });
})

router.get('/payforThis/:id', async function(req, res1, next) {
  const { id } = req.params;
  const orderData = await Order.findOne({ _id: id})
  var totalPayed = 0
  orderData.quantity.forEach(function(q, index, array) {
    totalPayed += orderData.quantity[index] * orderData.price[index]
  })
  
  var shippingCost = Number(orderData.shippingCost)
  var myWbsite = keys.internal.host;
  var postURL =  myWbsite + '/getPay';
  
  var amount = totalPayed + shippingCost
  var request = require("request");
   
    

  var http = require("https");
  var options = {
    "method": "POST",
    "hostname": "api.tap.company",
    "port": null,
    "path": "/v2/charges",
    "headers": {
      "authorization": keys.tapPayment.authorization,
      "content-type": "application/json"
    }
  };

  var req = http.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    res.on("end", function() {
      var body = Buffer.concat(chunks);
      var profile = JSON.parse(body);
      var transactionUrl = profile.transaction.url;
      console.log("transactionUrl: " + transactionUrl)
      return res1.redirect(transactionUrl);
    });    
  });

  req.write(JSON.stringify({
    amount: amount,
    currency: 'KWD',
    threeDSecure: true,
    save_card: false,
    description: 'Test Description',
    statement_descriptor: 'Sample',
    metadata: { udf1: id, udf2: 'test 2' },
    reference: { transaction: 'txn_0001', order: 'tng' },
    receipt: { email: false, sms: true },
    customer:
    {
      first_name: orderData.customerName,
      middle_name: 'test',
      last_name: 'test',
      email: 'test@test.com',
      phone: { country_code: '965', number: orderData.mobile }
    },
    merchant: { id: '' },
    source: { id: 'src_kw.knet' },
    post: { url:postURL },
    redirect: { url:myWbsite + '/tapRedirect2' }
  }));
  req.end();
})




router.get('/tapRedirect', async function(req, res1, next) {
  

  const { tap_id } = req.query;

  // console.log('tapRedirect')
  // console.log(tap_id)
  // console.log(req.body)

  retrieveCharge();
  
  function retrieveCharge() {
    var http = require("https");

    var options = {
      "method": "GET",
      "hostname": "api.tap.company",
      "port": null,
      "path": `/v2/charges/${tap_id}`,
      "headers": {
        "authorization": keys.tapPayment.authorization,
      }
    };
    
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", async function () {
        var body = Buffer.concat(chunks);
        var profile = JSON.parse(body);
        var KentStatus = profile.status;
        var OrderId = profile.metadata.udf1

        

        const orderData = await Order.findOne({ _id: OrderId})

       
        
        
        arr_update_dict = { "$set": {} };
        arr_update_dict["$set"]["KentStatus"] = KentStatus
        
      
        Order.findOneAndUpdate({ _id: OrderId }, arr_update_dict).then(function() {
    
          // CANCELLED | FAILED | CAPTURED xxx
          

          res1.redirect(url.format({
            pathname: "/send",
            query: {
              "user": "customer",
              "orderID": (OrderId).toString(),
              "massege": "Ting طلب جديد دفع كينت",
              "KentStatus": KentStatus,
              "orderNo": orderData.orderNo
            }
          }));
          

          
          
        })
        
        
      });
    });
    
    req.write("{}");
    req.end();
  }

  
});


router.get('/tapRedirect2', async function(req, res1, next) {
  

  const { tap_id } = req.query;

  retrieveCharge();
  
  function retrieveCharge() {
    var http = require("https");

    var options = {
      "method": "GET",
      "hostname": "api.tap.company",
      "port": null,
      "path": `/v2/charges/${tap_id}`,
      "headers": {
        "authorization": keys.tapPayment.authorization,
      }
    };
    
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", async function () {
        var body = Buffer.concat(chunks);
        var profile = JSON.parse(body);
        var KentStatus = profile.status;
        var OrderId = profile.metadata.udf1

        

        const orderData = await Order.findOne({ _id: OrderId})

       
        
        
        arr_update_dict = { "$set": {} };
        arr_update_dict["$set"]["KentStatus"] = KentStatus
        
      
        Order.findOneAndUpdate({ _id: OrderId }, arr_update_dict).then(function() {
    
          // CANCELLED | FAILED | CAPTURED xxx
          

          

          return res1.render('redirectAfterPayment', { title: 'Order' , KentStatus:KentStatus, orderNo:orderData.orderNo});
          

          
          
        })
        
        
      });
    });
    
    req.write("{}");
    req.end();
  }

  
});








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
  const referer = req.headers.referer;

  
  
  var newProduct = {
    ID: req.body.productId,
    Name: req.body.name,
    Quantity: parseInt(req.body.quantity),
    Price: parseFloat(req.body.price),
    productNo: parseFloat(req.body.productNo),
    parentNo: parseFloat(req.body.parentNo),
    warranty: parseFloat(req.body.warranty),
    variation: req.body.variation,
  }

  hostNew = host;

  if (!req.session.cartData0) {
    req.session.cartData0 = []
    var old = req.session.cartData0;
    console.log("New Empty Cart Created")
  } else {

    var old = req.session.cartData0;
    console.log("We Already have a cart")
    // console.log("Now we will check if productExistInCart")
    // old.forEach(function(product, index, array) {
    //   console.log("If Yes will update quantity ")
    //   if (product.ID == newProduct.ID) {
    //     array[index].Quantity = newProduct.Quantity;
    //     productExistInCart = true;
    //     console.log("One of products Exist on the cart and we updated Quantity")
    //   }
    // });
    // console.log("productExistInCart: " + productExistInCart)

   
    
  }
  
  console.log("referrer.split('/')[2]: " + referer.split('/')[2])
  console.log(hostNew)
  console.log(newProduct)
  console.log(req.headers.referer)
  var productName = referer.split('/')[4]
  console.log("productName: " + productName)
  // constrer = req.headers.referer host = req.headers.host;
  // const refe;

  console.log("Now the product is not in the cart we will make push + update session + redirect + cartCount")
  old.push(newProduct);
  req.session.cartData0 = old;
  req.session.cartCount = req.session.cartData0.length;

  req.session.save(function(err) {
    // session saved
    return res.redirect(`https://${referer.split('/')[2]}/product/${productName}?ShowModal=yes&Q=${newProduct.Quantity}`);
  })

  

  

  // if (productExistInCart) {
  //   console.log("Now the product is in the cart we will update session and redirect")
  //   req.session.cartData0 = old;
  //   req.session.save(function(err) {
  //     // session saved
  //     return res.redirect(`https://${referer.split('/')[2]}/product/${productName}?ShowModal=yes&Q=${newProduct.Quantity}`);
  //   })
  // } else {
  //   console.log("Now the product is not in the cart we will make push + update session + redirect + cartCount")
  //   old.push(newProduct);
  //   req.session.cartData0 = old;
  //   req.session.cartCount = req.session.cartData0.length;
    
  //   req.session.save(function(err) {
  //     // session saved
  //     return res.redirect(`https://${referer.split('/')[2]}/product/${productName}?ShowModal=yes&Q=${newProduct.Quantity}`);
  //   })
  // }


  
  // if (host == "localhost:3000") {
  //   hostNew = "itcstore.net";
  // } else {
  //   hostNew = host;
  // }
  // var newProduct = {
  //   ID: req.body.productId,
  //   Name: req.body.name,
  //   Quantity: parseInt(req.body.quantity),
  //   Price: parseFloat(req.body.price),
  //   productNo: parseFloat(req.body.productNo),
  //   parentNo: parseFloat(req.body.parentNo),
  //   warranty: parseFloat(req.body.warranty),
  //   // total : parseInt(req.body.quantity)*parseFloat(req.body.price)
  // }



  // if (!req.session.cartData0) {
  //   req.session.cartData0 = []
  //   var old = req.session.cartData0;
  // } else {

  //   var old = req.session.cartData0;
  //   var productExistInCart = false;

  //   old.forEach(function(product, index, array) {
  //     if (product.ID == req.body.productId) {
  //       array[index].Quantity += newProduct.Quantity;
  //       productExistInCart = true;
  //     }
  //   });
  // }

  // if (productExistInCart) {
  //   req.session.cartData0 = old;
  //   req.session.save(function(err) {
  //     // session saved
  //     return res.redirect(`https://${hostNew}/product/${newProduct.parentNo}?ShowModal=yes&Q=${newProduct.Quantity}`);
  //   })
  // } else {
  //   old.push(newProduct);
  //   req.session.cartData0 = old;
  //   req.session.cartData0 = old;
  //   req.session.cartCount = req.session.cartData0.length;
    
  //   req.session.save(function(err) {
  //     // session saved
  //     return res.redirect(`https://${hostNew}/product/${newProduct.parentNo}?ShowModal=yes&Q=${newProduct.Quantity}`);
  //   })
  // }

})





// GET /product 
router.get('/product/:id', function(req, res, next) {
  const { id } = req.params;
  Chapter.findOne({ _id: id }).exec(function(error, productData) {
    if (error) {
     
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
    
      if (error.name == 'CastError') {
        var err = new Error('File Not Found');
        err.status = 404;
        next(err);
      }
      return next(error);
    } else {
      var find = Chapter.find({ courseID: id }).sort({ order: 1 }).exec(function(error, ChaptersData) {
        try {
         
          var ChaptersDataEdited = [];

          if (req.session.userId) {
            
            var subscriptions = User.findById(req.session.userId)
              .exec(function(error, user) {
                
          
                if (error) {
                  return next(error);
                } else {
                 
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
                

                  if (subscription != "NoUserSignedIn") {
                    function checkSubscription(sub) {
                      return sub == chapter._id;
                    }


                    var x = subscription.some(checkSubscription);
                   
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
 
  const { tap_id } = req.query;
  

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
     
    });
  });

  req.write("{}");
  req.end();

});


router.get('/redirect2', function(req, res, next) {
  var request = require("request");

  
  const { tap_id } = req.query;
 
  var options = {
    method: 'GET',
    url: `https://api.tap.company/v2/charges/${tap_id}`,
    headers: { authorization: 'Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ' },
    body: '{}'
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    bodyJSON = JSON.parse(body)
   

    if (bodyJSON.response) {
      const status = bodyJSON.response.message;
      


      Charge.findOne({ _id: bodyJSON.metadata.ChargeID }).exec(function(error, chargeData) {
        if (error) {
          
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

 
  var totalPrice = 0;

  var cartIDs = []; // to use in find
  var cartData = req.session.cartData0;
  cartData.forEach(function(product, index, array) {
    cartIDs.push(product.ID);
  });

  // todo: use same in cart
  Chapter.find({ _id: { $in: cartIDs } }, { name: 1, price: 1 }).exec(function(error, productData) {
    if (error) {
      
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
      
      for (var i = 0; i < productData.length; i++) {
       

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


    
      // payforThis(chargeData, userData, totalPrice);
      Charge.create(chargeData, function(error, ChargeResult) {
        if (error) {
         
        } else {
         
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

   

    var req = http.request(options, function(res) {
      var chunks = [];

      res.on("data", function(chunk) {
        chunks.push(chunk);
      });

      res.on("end", function() {
        var body = Buffer.concat(chunks);
       
        var profile = JSON.parse(body);
        if (!profile.transaction) {
         
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

      reference: { transaction: 'txn_0001', order: 'tng' },
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







// POST /
router.post('/getPay', function(req, res, next) {
  // 


  var OrderId = req.body.metadata.udf1;
  
 

  
  arr_update_dict = { "$set": {} };
  arr_update_dict["$set"]["KentStatusBackEnd"] = req.body.status
  arr_update_dict["$set"]["paymentLog"] = req.body

  Order.findOneAndUpdate({ _id: OrderId }, arr_update_dict).then(function() {
    return res.send('getPay has been called -1');
    
  })

  
});



// GET /about /safe
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact /safe
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /contact /safe
router.get('/tree', function(req, res, next) {
  return res.render('tree', { title: 'Links' });
});

// GET /contact /safe
router.get('/return-and-refund', function(req, res, next) {
  return res.render('return-and-refund', { title: 'return-and-refund' });
});

// GET /contact /safe
router.get('/privacy', function(req, res, next) {
  return res.render('privacy', { title: 'privacy' });
});

router.get('/FAQ', function(req, res, next) {
  return res.render('FAQ', { title: 'FAQ' });
});



// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', function(req, res, next) {
  
 
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
