
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
	blogpost_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	blogpost_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],

	videos:[{ type: Schema.Types.ObjectId, ref: 'Video'  }],
	videos_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	videos_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	
	images:[{ type: Schema.Types.ObjectId, ref: 'Image'  }],
	images_blogpost_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	images_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	
	total_blogposts:0,
	total_blogposts_comments:0,
	total_blogposts_likes:0,

	total_videos:0,
	total_videos_comments:0,
	total_videos_likes:0,

	total_images:0,
	total_images_comments:0,
	total_images_likes:0,

})

mongoose.model('User', UserSchema);
	
UserSchema.pre('save', function(next) {
	this.total_blogposts = this.blogposts.length
	this.total_blogposts_comments = this.comments.length
	this.total_blogposts_likes = this.likes.length

	this.total_videos = this.videos.length
	this.total_videos_comments = this.comments.length
	this.total_videos_likes = this.likes.length
	
	this.total_images = this.images.length
	this.total_images_comments = this.comments.length
	this.total_images_likes = this.likes.length

    next();

});
