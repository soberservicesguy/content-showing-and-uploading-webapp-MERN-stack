
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	timestamp_of_liking:String,

// other model links
	image:{ type: Schema.Types.ObjectId, ref: 'Image'  , default: null},
	video: { type: Schema.Types.ObjectId, ref: 'Video' , default: null },
	blogpost: { type: Schema.Types.ObjectId, ref: 'BlogPost' , default: null},

	user:{ type: Schema.Types.ObjectId, ref: 'User', required:true},

})

LikeSchema.pre('save', function(next) {

	this.timestamp_of_liking = String( Date.now() )
    next();

});

LikeSchema.post('save', function() {

	console.log('SAVED CONDITION')
    console.log(this)

});


mongoose.model('Like', LikeSchema);