
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	timestamp_of_liking:String,

// other model links
	video:{ type: Schema.Types.ObjectId, ref: 'Video'  },
	user:{ type: Schema.Types.ObjectId, ref: 'User'  },
	total_video:0,

})

mongoose.model('Like', LikeSchema);