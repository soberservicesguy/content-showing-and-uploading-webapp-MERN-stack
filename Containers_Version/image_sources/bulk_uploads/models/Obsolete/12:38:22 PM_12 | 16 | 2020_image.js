
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	category:String,
	image_source:String,
	title:String,
	endpoint:String,
	timestamp_of_uploading:String,
	description:String,
	all_tags:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	total_comments:0,
	total_likes:0,

})

mongoose.model('Image', ImageSchema);
	
ImageSchema.pre('save', function(next) {
	this.total_comments = this.comments.length
	this.total_likes = this.likes.length

    next();

});
