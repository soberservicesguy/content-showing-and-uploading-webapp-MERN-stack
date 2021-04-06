
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrivilegeSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,
	// privilege_name:String,
	privilege_name:{ type:String, enum:[
		// 'admin_control', 
		'allow_surfing', 
		'is_allowed_image_upload', 
		'is_allowed_video_upload',		
		'is_allowed_writing_blopost',
	]},

	total_users:0,

// other model links
	users:[{ type: Schema.Types.ObjectId, ref: 'User'  }],

})

	
PrivilegeSchema.pre('save', function(next) {

	this.total_users = this.users.length
    next();

});

// allow_surfing
// allow_image_upoading
// allow_video_uploading
// allow_blogpost_uploading
mongoose.model('Privilege', PrivilegeSchema);