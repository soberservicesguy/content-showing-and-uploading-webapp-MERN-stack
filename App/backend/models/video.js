
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 3938931

const VideoSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

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

	// adding timestamp and endpoint when post is created ie likes, comments, shares are 0
	if ( this.comments.length === 0 && this.likes.length === 0 ){

		this.endpoint = String( endpoint_number )
		this.timestamp_of_uploading = String( Date.now() )

		console.log(`assigning endpoint to new post ${endpoint_number}`)
	}

    next();
});

VideoSchema.post('save', function() {

	// console.log('SAVED CONDITION')
    // console.log(this)

});


mongoose.model('Video', VideoSchema);