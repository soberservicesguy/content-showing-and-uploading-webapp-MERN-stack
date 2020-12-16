require('../../models/video');
require('../../models/comment');
require('../../models/like');
require('../../models/user');


const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Video = mongoose.model('Video');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

// create a new video with children

router.post('/create-video-with-children', function(req, res, next){
	const newVideo = new Video({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_thumbnail: req.body.parent.image_thumbnail,
		video_filename: req.body.parent.video_filename,
		title: req.body.parent.title,
		endpoint: req.body.parent.endpoint,
		description: req.body.parent.description,
		timestamp_of_uploading: req.body.parent.timestamp_of_uploading,
		all_tags: req.body.parent.all_tags,

	});

	newVideo.save(function (err, newVideo) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			text: req.body.children.text,
			commenting_timestamp: req.body.children.commenting_timestamp,

		//assigning parent
			video:newVideo._id,
			user:newVideo._id,

		});

		newVideo.comments.push(newComment._id)
		const newLike = new Like({

			_id: new mongoose.Types.ObjectId(),
			timestamp_of_liking: req.body.children.timestamp_of_liking,

		//assigning parent
			video:newVideo._id,
			user:newVideo._id,

		});

		newVideo.likes.push(newLike._id)
		const newUser = new User({

			_id: new mongoose.Types.ObjectId(),
			user_name: req.body.children.user_name,
			phone_number: req.body.children.phone_number,
			user_image: req.body.children.user_image,
			hash: req.body.children.hash,
			salt: req.body.children.salt,

		//assigning parent
			blogposts:newVideo._id,
			comments:newVideo._id,
			likes:newVideo._id,
			videos:newVideo._id,
			comments:newVideo._id,
			likes:newVideo._id,

		});

		newVideo.users.push(newUser._id)

	newVideo.save();

	});

});

// find video
	
router.get('/find-video', function(req, res, next){

	Video.findOne({ endpoint: req.body.endpoint })
		.then((video) => {

			video[ image_thumbnail ] = base64_encode( video[ 'image_thumbnail' ] )

			if (!video) {

				res.status(401).json({ success: false, msg: "could not find video" });

			} else {

				res.status(200).json(video);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// find comment
	
router.get('/find-comment', function(req, res, next){

	Comment.findOne({ comment_order: req.body.comment_order })
		.then((comment) => {
			if (!comment) {

				res.status(401).json({ success: false, msg: "could not find comment" });

			} else {

				res.status(200).json(comment);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// find like
	
router.get('/find-like', function(req, res, next){

	Like.findOne({ time_of_liking: req.body.time_of_liking })
		.then((like) => {
			if (!like) {

				res.status(401).json({ success: false, msg: "could not find like" });

			} else {

				res.status(200).json(like);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// find user
	
router.get('/find-user', function(req, res, next){

	User.findOne({ phone_number: req.body.phone_number })
		.then((user) => {

			user[ user_image ] = base64_encode( user[ 'user_image' ] )

			if (!user) {

				res.status(401).json({ success: false, msg: "could not find user" });

			} else {

				res.status(200).json(user);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get n childs of video

router.get('/top-n-like-of-video', function(req, res, next){
		Video.
			findOne({endpoint:req.body.endpoint}).
	
		populate('likes').

		exec(function (err, video_with_likes) {
	
			if (err) return console.log(err);
	

			var likes = video_with_likes.likes
			new_like_collection = []				
				for (let i = 0; i < likes.length; i++) {
					if ( i === req.body.child_count ){
						break
					}

					new_like_collection.push( likes[i] )
				} 


		res.status(200).json(new_like_collection);

	});
})

// get n childs of video

router.get('/get-all-likes-of-video', function(req, res, next){
	Video.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	exec(function (err, video_with_likes) {

		if (err) return console.log(err);

		if ( video_with_likes ){

			var likes = video_with_likes.likes
			res.status(200).json( likes );

		} else {

			res.status(500).json({msg: 'sorry no video found'});				

		}
	})
})


// create video with undefined

router.post('/create-video-with-user', function(req, res, next){
	
	var video_object = req.body.video_object
	var user_object = req.body.user_object

	var newVideo = new Video({
		_id: new mongoose.Types.ObjectId(),
		...video_object
	})

	newVideo.save(function (err, newVideo) {
		if (err) return console.log(err);

			User.
			findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newVideo.user = user
				res.status(200).json( newVideo )
			
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// create Like for video

router.post('/create-like-for-video', function(req, res, next){

	var like_object = req.body.like_object	
	var video_object = req.body.video_object
	var user_object = req.body.user_object

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
		...like_object
	})

	newLike.save(function (err, newLike) {
		if (err) return console.log(err);

			User.findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newLike.user = user

			// finding Video object
					Video.findOne({endpoint: video_object.endpoint})
				.then((video) => {

					if ( !video ){

						console.log('no Video found')

					} else {

						video.likes.push( newLike )
						video.save((err, blogpost) => res.status(200).json(video) )
						
					}
				})
				.catch((err1) => {
					console.log(err1)
				})

			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// get videos_list

router.get('/videos-list', function(req, res, next){

Video.
	find().
	limit(10).
	then((videos)=>{
		var newVideos_list = []
		videos.map((video, index)=>{
			var newVideo = {}

			newVideo.category = video[ 'category' ]
			newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
			newVideo.video_filename = video[ 'video_filename' ]
			newVideo.title = video[ 'title' ]
			newVideo.endpoint = video[ 'endpoint' ]

			newVideos_list.push({...newVideo})
			newVideo = {}
		});

		return newVideos_list
	})

	.then((newVideos_list) => {

		if (!newVideos_list) {

			res.status(401).json({ success: false, msg: "could not find Videos_list" });

		} else {

			res.status(200).json(newVideos_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});

// get videos_list_with_children

router.get('/videos-list-with-children', function(req, res, next){

	Video.
		find().
		limit(10).
		populate('comments').
		populate('likes').
		populate('user').
		populate('comments').
		populate('likes').
		populate('user').
		populate('comments').
		populate('likes').
		populate('user').
		then((videos)=>{
			var newVideos_list = []
			videos.map((video, index)=>{
				var newVideo = {}

				newVideo.category = video[ 'category' ]
				newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
				newVideo.video_filename = video[ 'video_filename' ]
				newVideo.title = video[ 'title' ]
				newVideo.endpoint = video[ 'endpoint' ]

				newVideos_list.push({...newVideo})
				newVideo = {}
			});

			return newVideos_list
		})

		.then((newVideos_list) => {

			if (!newVideos_list) {

				res.status(401).json({ success: false, msg: "could not find Videos_list" });

			} else {

				res.status(200).json(newVideos_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get videos_list_next_10_with_children

router.get('/videos-list-next-10-with-children', function(req, res, next){

	Video.
		find().
		skip(10).
		limit(10).
		populate('comments').
		populate('likes').
		populate('user').
		populate('comments').
		populate('likes').
		populate('user').
		populate('comments').
		populate('likes').
		populate('user').
		then((videos)=>{
			var newVideos_list = []
			videos.map((video, index)=>{
				var newVideo = {}

				newVideo.category = video[ 'category' ]
				newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
				newVideo.video_filename = video[ 'video_filename' ]
				newVideo.title = video[ 'title' ]
				newVideo.endpoint = video[ 'endpoint' ]

				newVideos_list.push({...newVideo})
				newVideo = {}
			});

			return newVideos_list
		})

		.then((newVideos_list) => {

			if (!newVideos_list) {

				res.status(401).json({ success: false, msg: "could not find Videos_list" });

			} else {

				res.status(200).json(newVideos_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get video with children

router.get('/video-with-children', function(req, res, next){
	Video.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, video_with_children) {
			if (err) return console.log(err);

			res.status(200).json(video_with_children);
		});
})


// get video with summarized children

router.get('/video-with-summarized-children', function(req, res, next){
	Video.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = video_with_children.comments
			new_comments = []

			var current_likes = video_with_children.likes
			new_likes = []

			var current_user = video_with_children.user
			new_user = []

			current_comments.map((comment, index)=>{
				var newComment = {}

	
				newComment.text = comment[ 'text' ]
				newComment.commenting_timestamp = comment[ 'commenting_timestamp' ]

				new_comments.push({...newComment})
				newComment = {}
			});

			video_with_children.comments = new_comments

			current_likes.map((like, index)=>{
				var newLike = {}

	
				newLike.timestamp_of_liking = like[ 'timestamp_of_liking' ]

				new_likes.push({...newLike})
				newLike = {}
			});

			video_with_children.likes = new_likes

			current_users.map((user, index)=>{
				var newUser = {}

	
				newUser.user_name = user[ 'user_name' ]
				newUser.phone_number = user[ 'phone_number' ]
				newUser.user_image = user[ 'user_image' ]

				new_users.push({...newUser})
				newUser = {}
			});

			video_with_children.users = new_users

		res.status(200).json(video_with_children);

	});
})

// get next 10 videos_list

router.get('/videos-next-10-list', function(req, res, next){

	Video.
		find().
		limit(10).
		skip(10).
		then( 
			(videos) => {
				var newVideos_list = []
				videos.map((video, index) => {
					var newVideo = {}
	
					newVideo.category = video[ 'category' ]
					newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
					newVideo.video_filename = video[ 'video_filename' ]
					newVideo.title = video[ 'title' ]
					newVideo.endpoint = video[ 'endpoint' ]

					newVideos_list.push({...newVideo})
					newVideo = {}
					})
			})

			return newVideos_list

		.then((newVideos_list) => {

			if (!newVideos_list) {

				res.status(401).json({ success: false, msg: "could not find Videos_list" });

			} else {

				res.status(200).json(newVideos_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});
// create a comment for some video
router.post('/remove-comment-from-video', function(req, res, next){

	Video.findOne({ endpoint: req.body.endpoint })
	.then((video) => {

		video.save(function (err, video) {
			if (err) return console.log(err);

				Comment.findOne({ comment_order: req.body.child_index })


				.then((comment)=>{

				let index_of_comment = video.comments.indexOf(comment);

				if (index_of_comment !== -1){

					video.comments.splice(index, 1);

				}
			})

			Comment.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		video.save();

	});

});

// create a like for some video
router.post('/remove-like-from-video', function(req, res, next){

	Video.findOne({ endpoint: req.body.endpoint })
	.then((video) => {

		video.save(function (err, video) {
			if (err) return console.log(err);

				Like.findOne({ time_of_liking: req.body.child_index })


				.then((like)=>{

				let index_of_like = video.likes.indexOf(like);

				if (index_of_like !== -1){

					video.likes.splice(index, 1);

				}
			})

			Like.findOneAndRemove( { time_of_liking: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		video.save();

	});

});


// create User

router.post('/create-user', function(req, res, next){

	User.findOne({
		user_name: req.body.user_name,
		phone_number: req.body.phone_number,
		user_image: req.body.user_image,
		hash: req.body.hash,
		salt: req.body.salt,
		user_name: req.body.user_name,
		phone_number: req.body.phone_number,
		user_image: req.body.user_image,
		hash: req.body.hash,
		salt: req.body.salt,
		user_name: req.body.user_name,
		phone_number: req.body.phone_number,
		user_image: req.body.user_image,
		hash: req.body.hash,
		salt: req.body.salt,
	})
	.then((user) => {

		if (!user) {


			const newUser = new User({
				_id: new mongoose.Types.ObjectId(),
				user_name: req.body.user_name,
				phone_number: req.body.phone_number,
				user_image: req.body.user_image,
				hash: req.body.hash,
				salt: req.body.salt,
			});

			newUser.save(function (err, newUser) {

				if (err) return console.log(err);

				res.status(200).json({success: true})
				
			})

		} else {

			res.status(401).json({ success: false, msg: "user already registered, try another or login" })

		}

	})
	.catch((err) => {

		console.log(err)
		// next(err)

	});
})


module.exports = router;