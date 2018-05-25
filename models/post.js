var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
	author: String,
	post: String,
	likes: Number,
	comments: [ 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Post", postSchema);