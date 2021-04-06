const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 393893

const BlogPostSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

	category:String,
	image_main_filepath:String,
	title:String,
	timestamp_of_uploading:String,
	initial_tags:String,
	first_para:String,
	second_para:String,
	qouted_para:String,
	third_para:String,
	fourth_para:String,
	all_tags:String,
	endpoint:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],

	user:{ type: Schema.Types.ObjectId, ref: 'User' },

	total_comments:0,
	total_likes:0,

})

BlogPostSchema.pre('save', function(next) {

	endpoint_number += 1

	this.total_comments = this.comments.length
	this.total_likes = this.likes.length

	this.endpoint = String( endpoint_number )
	this.timestamp_of_uploading = String( Date.now() )
	
    next();

});

BlogPostSchema.post('save', function() {

	// console.log('SAVED CONDITION')
 //    console.log(this)

});

mongoose.model('BlogPost', BlogPostSchema);