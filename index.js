var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var mid = require('./middleware');
// const passport = require('passport');
// const passportSetup = require('./config/passport-setup');
var bodyParser = require('body-parser');
const multer = require('multer');
const keys = require('./config/keys');


var routes = require('./routes/index');
var privates = require('./privates/index');
var routesAdmin = require('./routes/admin/index');
var routesManager = require('./routes/manager/index');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');



var app = express();

// set view engine
app.set('view engine', 'pug');

// Bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());





// dublicted in app an admin
const storage = multer.diskStorage({
  destination: './privates/index/upLoads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
// init upload
const upload = multer({
  storage: storage
}).single('myFile');


// connect to mongodb ATLAS
mongoose.set('strictQuery', false);
mongoose.connect(keys.mongodb.dbURI, () => { console.log('connected to mongodb') });


// mongoose.connect(keys.mongodb.dbURI)
//   .then(() => console.log('connected to mongo'))
//   .catch((err) => console.log('Connection failed'));



var db = mongoose.connection;




// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
  secret: 'We loves you',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: keys.mongodb.dbURI
  }),
})
);




// make user ID available in templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  res.locals.cartCountNow = req.session.cartCount;
  res.locals.managerNow = req.session.manager;
  res.locals.theSalesemanNow = req.session.theSaleseman;
  res.locals.currentUserName = req.session.userName;
  res.locals.theMutlaa = req.session.mutlaa;
  res.locals.source = req.session.source;

  next();
});





// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));


// include routes
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/privates', privates);
app.use('/admin', routesAdmin);
app.use('/manager', routesManager);
app.use('/profile', profileRoutes);
app.set('views', __dirname + '/views');
app.set('views/admin', __dirname + '/views/manager');
app.set('views/manager', __dirname + '/views/manager');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 5000
app.listen(3000, function() {
  console.log('Express app listening on port 3000');
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  // .json(response.error(err.status || 500));
});

module.exports = app;
