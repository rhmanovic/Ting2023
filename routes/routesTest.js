var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  
  // return res.send('x')
});




module.exports = router;