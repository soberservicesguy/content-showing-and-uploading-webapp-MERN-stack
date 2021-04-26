
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	category:String,
	image_main:String,
	title:String,
	date_of_publishing:String,
	initial_tags:String,
	endpoint:String,
	first_para:String,
	second_para:String,
	qouted_para:String,
	third_para:String,
	fourth_para:String,
	all_tags:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	total_comments:0,
	total_likes:0,

})

mongoose.model('BlogPost', BlogPostSchema);
	
BlogPostSchema.pre('save', function(next) {
	this.total_comments = this.comments.length
	this.total_likes = this.likes.length

    next();

});
