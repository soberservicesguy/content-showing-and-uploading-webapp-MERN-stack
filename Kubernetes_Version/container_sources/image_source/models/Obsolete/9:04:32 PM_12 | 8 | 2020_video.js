
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	category:String,
	image_main:String,
	title:String,
	description:String,
	date_of_publishing:String,
	author_name:String,
	first_para:String,
	total_likes:String,
	total_shares:String,
	endpoint:String,
	initial_tags:String,
	video_path:String,
	video_format:String,
	all_tags:String,
	uploader_details:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	total_comments:0,

})

mongoose.model('Video', VideoSchema);
	
VideoSchema.pre('save', function(next) {
	this.total_comments = this.comments.length

    next();

});
