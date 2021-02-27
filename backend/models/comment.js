
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	text:String,
	commenting_timestamp:String,

// other model links
	image:{ type: Schema.Types.ObjectId, ref: 'Image'  , default: null},
	video: { type: Schema.Types.ObjectId, ref: 'Video' , default: null },
	blogpost: { type: Schema.Types.ObjectId, ref: 'BlogPost' , default: null},

	user:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
})

CommentSchema.pre('save', function(next) {

	this.commenting_timestamp = String( Date.now() )
	
    next();

});

CommentSchema.post('save', function() {

	// console.log('SAVED CONDITION')
 //    console.log(this)

});


mongoose.model('Comment', CommentSchema);