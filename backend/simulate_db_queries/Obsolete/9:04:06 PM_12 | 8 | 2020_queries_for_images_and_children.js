
const mongoose = require('mongoose');
require('dotenv').config();

require('../models/blogpost');
require('../models/comment');
require('../models/user');
require('../models/video');
require('../models/comment');
require('../models/image');
require('../models/comment');
const BlogPost = mongoose.model('BlogPost');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');
const Video = mongoose.model('Video');
const Comment = mongoose.model('Comment');
const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the '.env' file.  To implement this, place the following
 * string into the '.env' file
 * 
 * DB_STRING=mongodb://localhost:27017/database_name
 * DB_STRING_PROD=<your production database string>
 */ 

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

// Connect to thae correct environment database
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(prodConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });

} else {

    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });
}


BlogPost.
	find()
	.then((blogposts) => {

		if (!blogposts) {

		    console.log('no blogposts exist')

		} else {

		    console.log('Number of blogposts are', blogposts.length)
		    console.log('blogposts are', blogposts)

		}
	})
	.catch((err) => {
		console.log(err)
});




Comment.
	find()
	.then((comments) => {

		if (!comments) {

		    console.log('no comments exist')

		} else {

		    console.log('Number of comments are', comments.length)
		    console.log('comments are', comments)

		}
	})
	.catch((err) => {
		console.log(err)
});




User.
	find()
	.then((users) => {

		if (!users) {

		    console.log('no users exist')

		} else {

		    console.log('Number of users are', users.length)
		    console.log('users are', users)

		}
	})
	.catch((err) => {
		console.log(err)
});




Video.
	find()
	.then((videos) => {

		if (!videos) {

		    console.log('no videos exist')

		} else {

		    console.log('Number of videos are', videos.length)
		    console.log('videos are', videos)

		}
	})
	.catch((err) => {
		console.log(err)
});




Comment.
	find()
	.then((comments) => {

		if (!comments) {

		    console.log('no comments exist')

		} else {

		    console.log('Number of comments are', comments.length)
		    console.log('comments are', comments)

		}
	})
	.catch((err) => {
		console.log(err)
});




Image.
	find()
	.then((images) => {

		if (!images) {

		    console.log('no images exist')

		} else {

		    console.log('Number of images are', images.length)
		    console.log('images are', images)

		}
	})
	.catch((err) => {
		console.log(err)
});




Comment.
	find()
	.then((comments) => {

		if (!comments) {

		    console.log('no comments exist')

		} else {

		    console.log('Number of comments are', comments.length)
		    console.log('comments are', comments)

		}
	})
	.catch((err) => {
		console.log(err)
});



// showing blogpost and populating children

BlogPost.
	find(). 

	populate('Comment').
	populate('User').

	exec(function (err, blogposts) {

	    if (err){
	      console.log('ERROR', err);
	    } 

	    console.log('blogpost is %s', blogposts)		// console.log('The comments %s', blogpost.comments);
		// console.log('The users %s', blogpost.users);
});// showing video and populating children

Video.
	find(). 

	populate('Comment').

	exec(function (err, videos) {

	    if (err){
	      console.log('ERROR', err);
	    } 

	    console.log('video is %s', videos)		// console.log('The comments %s', video.comments);
});// showing image and populating children

Image.
	find(). 

	populate('Comment').

	exec(function (err, images) {

	    if (err){
	      console.log('ERROR', err);
	    } 

	    console.log('image is %s', images)		// console.log('The comments %s', image.comments);
});