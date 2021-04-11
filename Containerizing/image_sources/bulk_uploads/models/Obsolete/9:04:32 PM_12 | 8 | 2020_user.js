
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	user_name:String,
	phone_number:String,

// other model links
	blogposts:[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }],
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	total_blogposts:0,
	total_comments:0,

})

mongoose.model('User', UserSchema);
	
UserSchema.pre('save', function(next) {
	this.total_blogposts = this.blogposts.length
	this.total_comments = this.comments.length

    next();

});
