var express 	= require("express");
var router  	= express.Router();
var passport  = require("passport");
var User 			= require("../models/user");

// ===============
// Auth routes
// ===============


// Index and misc routes
router.get("/", function(req, res) {
	res.render("home");
});

router.get("/profile", function(req, res) {
	res.render("profile", {currentUser: req.user});
});

// Register routes

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/posts");
		});
	});
});



// Login routes

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/posts",
	failureRedirect: "/login",
}), function(req, res) {

});


// Logout routes

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});


// Middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

module.exports = router;