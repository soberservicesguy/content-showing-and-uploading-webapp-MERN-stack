require('../../models/video');
require('../../models/image');
require('../../models/comment');
require('../../models/like');
require('../../models/user');


const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Video = mongoose.model('Video');
const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedUploadingVideos } = require('../authMiddleware/isAllowedUploadingVideos')

const multer = require('multer');
const path = require('path')

// Set The Storage Engine
const video_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/videos/uploads/videos_uploaded_by_users'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForVideo(file, cb){
	// Allowed ext
	let filetypes = /mp4|avi|flv/;
	// Check ext
	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	let mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null,true);
	} else {
		cb('Error: mp4, avi,flv Videos Only!');
	}
}

// Init Upload
const upload_video_by_user = multer({
	storage: video_storage,
	limits:{fileSize: 20000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForVideo(file, cb);
	}
}).single('videos_uploaded_by_users'); // this is the field that will be dealt
// .array('blogpost_image_main', 12)




// create video with undefined
// USED IN CREATING Video
router.post('/create-video-with-user', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, function(req, res, next){
	
	console.log('OUTER LOG')
	console.log(req.body)

	upload_video_by_user(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {

				var video_id = ''
			// video is uploaded , NOW creating thumbnail from video using snapshot
 				ffmpeg(`./assets/videos/uploads/videos_uploaded_by_users/${filename_used_to_store_video_in_assets}`)
				.on('end', function() {
					console.log('Screenshots taken');
				})
				.on('error', function(err) {
					console.error(err);
				})
				.on('filenames', function(filenames) {
					console.log('screenshots are ' + filenames.join(', '));
				})
				// screenshots at mentioned times
				// .takeScreenshots({ 
				// 	count: 2, 
				// 	timemarks: [ '00:00:02.000', '6' ], 
				// 	filenames: [
				// 		`${filename_used_to_store_video_in_assets_without_format}1.png`, 
				// 		`${filename_used_to_store_video_in_assets_without_format}2.png`, 
				// 	],
				// 	size: '150x100', 
				// }, '../assets/videos/uploads/upload_thumbnails/')
				// screenshots at % completion ie 20%, 40%, 60%, 80%
				.screenshots({
					// filename: 'name-of-file.png', // if single snapshot is needed
					// timemarks: [ '00:00:02.000', '6' ], 
					// Will take screenshots at 20%, 40%, 60% and 80% of the video
					count: 4,
					filenames: [
						`${filename_used_to_store_video_in_assets_without_format}1.png`, 
						`${filename_used_to_store_video_in_assets_without_format}2.png`, 
						`${filename_used_to_store_video_in_assets_without_format}3.png`, 
						`${filename_used_to_store_video_in_assets_without_format}4.png`,
					],
					size: '150x100', 
					folder: './assets/videos/uploads/upload_thumbnails/',
				})


			// saving video in DB
				video_id = new mongoose.Types.ObjectId()
				const newVideo = new Video({
					_id: video_id,
					image_thumbnail: `${filename_used_to_store_video_in_assets_without_format}1.png`,
					timestamp_of_uploading: String( Date.now() ),
					video_filepath: `./assets/videos/uploads/videos_uploaded_by_users/${filename_used_to_store_video_in_assets}`,
					category: req.body.category,
					title: req.body.title,
					all_tags: req.body.all_tags,
					description: req.body.description,
					// endpoint:String, // will be taken care at db model
				})

				newVideo.save(function (err, newVideo) {

					if (err){
						res.status(404).json({ success: false, msg: 'couldnt create video database entry'})
						return console.log(err)
					}

					// assign user object then save
					User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
					.then((user) => {
						if (user){

							newVideo.user = user
							newVideo.save()
						// finding video saved to access its endpoint since its created at model level
							
						} else {

							res.status(200).json({ success: false, msg: "user doesnt exists, try logging in again" });

						}
					})
					.then(() => {

						Video.findOne({ _id: video_id })
						.then((saved_video) => {
							res.status(200).json({ success: true, msg: 'new user saved', video_endpoint: saved_video.endpoint});	

						})

					})
					.catch((err) => {

						next(err);

					})

					// not needed, used for multer
					// res.status(200).json({ success: false, msg: 'couldnt create video database entry',file: `uploads/${req.file.filename}`})
				})
			}
		}
	})
})


// get n childs of blogpost
// USED 
router.get('/get-all-comments-of-video', async function(req, res, next){

	let list_of_promises = []

	var video_with_comments = await Video.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	then((video) => {

		if ( video ){

			return video.comments

		} else {

			null
		}
	})
	.catch((err) => console.log(err))

	// console.log('COMMENTS FOUND')
	// console.log(video_with_comments)

	list_of_promises.push( video_with_comments )

	var users_list_who_commented = await Promise.all(video_with_comments.map(async (comment_object) => {
	// find user from each like
		return await User.findOne({_id:comment_object.user})
		.then(async (user_object) => {

			if (user_object){
				console.log('USER FOUND')
				console.log(user_object)
				return {
					// ...user_object, // NEVER SPREAD IN MONGOOSE, IT INCLUDES _doc and lots of other info
					user_name:user_object.user_name,
					user_image:user_object.user_image,
					text:comment_object.text
				}

			} else {
				null
			}
		})

	}))

	// console.log('PROMISE RESULT 1')
	// console.log(users_list_who_commented)

// find image from user
	var final_comments_payload = await Promise.all(users_list_who_commented.map(async (user_object) => {
		console.log('QUERY')
		console.log(user_object.user_image)
		return await Image.findOne({_id:user_object.user_image})
		.then(async (image_object) => {
			console.log(image_object)

			if (image_object){
				console.log('IMAGE FOUND')
				// console.log(image_object)

				return {
					user_name:user_object.user_name,
					user_image:base64_encode(image_object.image_filepath),
					comment_text:user_object.text,
				}

			} else {
				console.log('IMAGE NOT FOUND')
				null
			}

		})

	}))

	// console.log('PROMISE RESULT 2')
	// console.log(final_comments_payload)

	Promise.all(list_of_promises)
	.then(() => {

		// console.log('COMMENTS SENT')
		// console.log(final_comments_payload)
		res.status(200).json( final_comments_payload );

	})

})

// USED
router.get('/get-all-likes-of-video',async function(req, res, next){

	let list_of_promises = []

// find video
	var video_with_likes = await Video.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	then((video_with_likes) => {

		if ( video_with_likes ){

			return video_with_likes.likes
	
		} else {

			null

		}

	})

	list_of_promises.push( video_with_likes )

// find likes from video
	let users_list_who_liked = await Promise.all(video_with_likes.map(async (like_object) => {

	// find user from each like
		return await User.findOne({_id:like_object.user})
		.then(async (user_object) => {

			if (user_object){

				return user_object

			} else {
				null
			}
		})
		
	}))

	// console.log('PROMISE RESULT 1')
	// console.log(users_list_who_liked)

// find image from user
	let final_liked_payload = await Promise.all(users_list_who_liked.map(async (user_object) => {
	
		return await Image.findOne({_id:user_object.user_image})
		.then(async (image_object) => {

			if (image_object){

				return {
					user_name:user_object.user_name,
					user_image:base64_encode(image_object.image_filepath),
				}

			} else {
				null
			}

		})

	}))

	// console.log('PROMISE RESULT 2')
	// console.log(final_liked_payload)

	Promise.all(list_of_promises)
	.then(() => {

		// console.log(final_liked_payload)
		res.status(200).json( final_liked_payload );

	})

})




// USED FOR CREATING COMMENT
router.post('/create-comment-for-video', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	var comment_text = req.body.comment_text	
	var video_endpoint = req.body.video_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newComment.user = user

	// finding video object
		Video.findOne({endpoint: video_endpoint})
		.then((video) => {

			video.comments.push( newComment )

			newComment.video = video
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			video.save((err, video) => res.status(200).json(video) )
		})
		.catch((err1) => {
			console.log(err1)
		})

	})
	.catch((err) => {
		console.log(err)
	})

})


// will be used for creating like
router.post('/create-like-for-video', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	var video_endpoint = req.body.video_endpoint

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})

	// // check if
	// if (req.user){

	// } else {
	// 	res.status(200).json({ msg: "user unprivileged, get privileges or try logging in again" });
	// }

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newLike.user = user

	// finding video object
		Video.findOne({endpoint: video_endpoint})
		.then((video) => {

			video.likes.push( newLike )

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})
				
			video.save((err, video) => res.status(200).json(video) )
		})
		.catch((err1) => {
			console.log(err1)
		})

	})
	.catch((err) => {
		console.log(err)
	})

})




// get blogposts_list_with_children
// USED
router.get('/videos-list-with-children', function(req, res, next){
	console.log('called')

	Video.
	find().
	limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then((videos)=>{
		var newVideos_list = []
		videos.map((video, index)=>{
			var newVideo = {}

			newVideo.category = video[ 'category' ]
			newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
			newVideo.title = video[ 'title' ]
			newVideo.all_tags = video[ 'all_tags' ]
			newVideo.description = video[ 'description' ]
			newVideo.endpoint = video[ 'endpoint' ]

			newVideos_list.push({...newVideo})
			newVideo = {}
		});

		return newVideos_list
	})
	.then((newVideos_list) => {

		if (!newVideos_list) {

			res.status(401).json({ success: false, msg: "could not find video_list" });

		} else {

			res.status(200).json(newVideos_list);

		}

	})
	.catch((err) => {

		console.log(err)
		next(err);

	});
});



















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