
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	user_name:String,
	phone_number:String,
	user_image:String,
	hash:String,
	salt:String,

// other model links
	blogposts:[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }],
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	videos:[{ type: Schema.Types.ObjectId, ref: 'Video'  }],
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	total_blogposts:0,
	total_comments:0,
	total_likes:0,
	total_videos:0,
	total_comments:0,
	total_likes:0,

})

mongoose.model('User', UserSchema);
	
UserSchema.pre('save', function(next) {
	this.total_blogposts = this.blogposts.length
	this.total_comments = this.comments.length
	this.total_likes = this.likes.length
	this.total_videos = this.videos.length
	this.total_comments = this.comments.length
	this.total_likes = this.likes.length

    next();

});
