
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 393893

const VideoSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	category:String,
	image_thumbnail:String,
	video_filepath:String,
	title:String,
	endpoint:String,
	description:String,
	timestamp_of_uploading:String,
	all_tags:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],

	user:{ type: Schema.Types.ObjectId, ref: 'User' },

	total_comments:0,
	total_likes:0,

})

VideoSchema.pre('save', function(next) {

	endpoint_number += 1

	this.total_comments = this.comments.length
	this.total_likes = this.likes.length

	this.timestamp_of_uploading = String( Date.now() )
	this.endpoint = String( endpoint_number )
	// console.log('THIS')
    // console.log(this)

    next();
});

VideoSchema.post('save', function() {

	// console.log('SAVED CONDITION')
 //    console.log(this)

});


mongoose.model('Video', VideoSchema);