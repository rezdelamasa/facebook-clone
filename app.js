var express 							= require("express"),
		app 									= express(),
		bodyParser 						= require("body-parser"),
		mongoose 							= require("mongoose"),
		seedDB								= require("./seeds");
		Post 									= require("./models/post"),
		User 									= require("./models/user"),
		Comment     					= require("./models/comment"),
		passport 							= require("passport"),
		LocalStrategy					= require("passport-local"),
		passportLocalMongoose = require("passport-local-mongoose");


var postsRoutes = require("./routes/posts"),
		authRoutes  = require("./routes/auth");

mongoose.connect("mongodb://localhost/facebook_clone");

seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.use(require("express-session") ({
	// Secrete can be anything
	secret: "This is my secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// These two lines are responsible for encoding/decoding session data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function() {
	console.log("Facebook Clone server has started.");
});