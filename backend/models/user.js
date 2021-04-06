
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

	user_name:String,
	phone_number:String,
	hash:String,
	salt:String,
	isLoggedIn: Boolean,

// other model links 
	privileges: [{ type: Schema.Types.ObjectId, ref: 'Privilege'  }],
	user_image:{ type: Schema.Types.ObjectId, ref: 'Image'  },

	blogposts:[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }],
	blogpost_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	blogpost_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],

	videos:[{ type: Schema.Types.ObjectId, ref: 'Video'  }],
	videos_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	videos_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	
	images:[{ type: Schema.Types.ObjectId, ref: 'Image'  }],
	images_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
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

	
UserSchema.pre('save', function(next) {
	this.total_blogposts = this.blogposts.length
	this.total_blogposts_comments = this.blogpost_comments.length
	this.total_blogposts_likes = this.blogpost_likes.length

	this.total_videos = this.videos.length
	this.total_videos_comments = this.videos_comments.length
	this.total_videos_likes = this.videos_likes.length
	
	this.total_images = this.images.length
	this.total_images_comments = this.images_comments.length
	this.total_images_likes = this.images_likes.length

    next();

});

UserSchema.post('save', function() {

	// console.log('SAVED CONDITION')
    // console.log(this)

});


mongoose.model('User', UserSchema);