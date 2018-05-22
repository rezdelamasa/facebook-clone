// ===============
// Auth routes
// ===============


// Index and misc routes
app.get("/", function(req, res) {
	res.render("home");
});

app.get("/profile", function(req, res) {
	res.render("profile", {currentUser: req.user});
});

// Register routes

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



// Login routes

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/posts",
	failureRedirect: "/login",
}), function(req, res) {

});


// Logout routes

app.get("/logout", function(req, res) {
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