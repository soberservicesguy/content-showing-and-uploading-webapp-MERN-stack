
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	category:String,
	image_source:String,
	title:String,
	description:String,
	date_of_publishing:String,
	author_name:String,
	total_likes:String,
	total_shares:String,
	endpoint:String,
	all_tags:String,
	uploader_details:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	total_comments:0,

})

mongoose.model('Image', ImageSchema);
	
ImageSchema.pre('save', function(next) {
	this.total_comments = this.comments.length

    next();

});
