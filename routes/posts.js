var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");
var Comment = require("../models/comment");

// ===============
// Posts routes
// ===============

router.get("/posts", isLoggedIn, function(req, res) {
	Post.find({}, function(err, allPosts) {
		if(err) {
			console.log(err);
		} else {
			res.render("posts", {posts: allPosts})
		}
	});
});

router.post("/posts", isLoggedIn, function(req, res) {
	var post = req.body.post;
  var author = req.user.username;
  var newPost = {post: post, author: author};
  console.log(newPost);
  // Create a new campground and save to DB
  Post.create(newPost, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          //redirect back to posts page
          newlyCreated.author.id = req.user._id;
	        newlyCreated.author.username = req.user.username;
	        //save comment
	        newlyCreated.save();
          res.redirect("/posts");
      }
  });
});

//Show route - shows one post in more detail 
router.get("/posts/:id", function(req, res) {
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

router.post("/posts/:id", isLoggedIn, function(req, res) {
	Post.findById(req.params.id, function(err, post) {
		if(err) {
			console.log(err);
			res.redirect("/posts");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					post.comments.unshift(comment);
					post.save();
					res.redirect("back");
				}
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

module.exports = router;