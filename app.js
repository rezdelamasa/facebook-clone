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



// ======================
// Index route
// ======================

app.get("/", function(req, res) {
	res.render("home");
});

// ======================
// Register routes
// ======================

app.get("/register", function(req, res) {
	res.render("register");
});

app.post("/register", function(req, res) {
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



// ======================
// Login routes
// ======================

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/posts",
	failureRedirect: "/login",
}), function(req, res) {

});


// ======================
// Logout routes
// ======================
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

app.get("/posts", isLoggedIn, function(req, res) {
	Post.find({}, function(err, allPosts) {
		if(err) {
			console.log(err);
		} else {
			res.render("posts", {posts: allPosts})
		}
	});
});

app.post("/posts", isLoggedIn, function(req, res) {
	var post = req.body.post;
	var newPost = {post: post};
	Post.create(newPost, function(err, newlyPosted) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/posts");
		}
	});
});

//Show route - shows one post in more detail 
app.get("/posts/:id", function(req, res) {
	// Find the campground with provided ID
	Post.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
		if(err) {
			console.log("Errorrrrrr");
			console.log(err);
		} else {
			// render show template
			res.render("show", {post: foundPost, currentUser: req.user});
		}
	});
});

app.post("/posts/:id", isLoggedIn, function(req, res) {
	Post.findById(req.params.id, function(err, post) {
		if(err) {
			console.log(err);
			res.redirect("/posts");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					post.comments.unshift(comment);
					post.save();
					res.redirect("back");
				}
			});
		}
	});
});

app.get("/profile", function(req, res) {
	res.render("profile", {currentUser: req.user});
});

// Middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

app.listen(3000, function() {
	console.log("Facebook Clone server has started.");
});