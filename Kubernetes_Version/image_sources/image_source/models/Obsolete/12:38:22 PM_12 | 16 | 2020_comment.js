
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	text:String,
	commenting_timestamp:String,

// other model links
	video:{ type: Schema.Types.ObjectId, ref: 'Video'  },
	user:{ type: Schema.Types.ObjectId, ref: 'User'  },
	total_video:0,

})

mongoose.model('Comment', CommentSchema);