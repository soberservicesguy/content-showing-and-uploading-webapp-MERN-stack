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

var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot
var filename_used_to_store_video_in_assets = ''
var filename_used_to_store_video_in_assets_without_format = ''

const {
	get_snapshots_fullname_and_path,
	get_file_path_to_use_alternate,
	get_image_to_display,
	store_video_at_tmp_and_get_its_path,
	// delete_video_at_tmp,
	// get_multer_storage_to_use,
	get_multer_storage_to_use_alternate,
	// get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	// get_file_path_to_use_for_bulk_files,
	get_snapshots_storage_path,
	// get_snapshots_fullname_and_path,

	gcp_bucket,
	// save_file_to_gcp_storage,
	save_file_to_gcp,
	// save_file_to_gcp_for_bulk_files,
	use_gcp_storage,
	// get_file_from_gcp,
	
	use_aws_s3_storage,
	// save_file_to_s3,
	// get_file_from_aws,
	save_file_to_aws_s3,
	// save_file_to_aws_s3_for_bulk_files,

	checkFileTypeForImages,
	checkFileTypeForVideos,
	// checkFileTypeForImageAndVideo,
	// checkFileTypeForImagesAndExcelSheet,
} = require('../../config/storage/')

const {
	select_random_screenshot,
	create_snapshots_from_uploaded_video,
	// save_socialpost_and_activity,
	save_generated_snapshots,
	// get_post_details,
} = require('./functions')

let timestamp

const total_snapshots_count = 4

// Init Upload
function upload_video_by_user(){

	return multer({
		storage: get_multer_storage_to_use_alternate(timestamp),
		limits:{fileSize: 20000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForVideos(file, cb);
		}
	}).single('videos_uploaded_by_user'); // this is the field that will be dealt
	// .array('blogpost_image_main', 12)

}




// create video with undefined
// USED IN CREATING Video
router.post('/create-video-with-user', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, function(req, res, next){
	
	timestamp = Date.now()

	upload_video_by_user(timestamp)(req, res, (err) => {

		{(async () => {

			if(err){

				console.log(err)

			} else {

				if(req.file == undefined){

					res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

				} else {


					let promises = []
					let save_image_or_video_promise

					if (use_gcp_storage){

						// save_image_or_video_promise = await save_file_to_gcp(timestamp, req.file)
						save_image_or_video_promise = save_file_to_gcp(timestamp, req.file)
						promises.push(save_image_or_video_promise)

						console.log('SAVED TO GCP')

					} else if (use_aws_s3_storage) {

						// save_image_or_video_promise = await save_file_to_aws_s3( req.file )
						save_image_or_video_promise = save_file_to_aws_s3( req.file, timestamp )
						promises.push(save_image_or_video_promise)
						// console.log(save_image_or_video_promise)
						console.log('SAVED TO AWS')

					} else {

						console.log('SAVED TO DISK STORAGE')

					}

					let store_video_at_tmp_promise
					let create_snapshots_promise
					let save_snapshots_promises
					let video_path = get_file_path_to_use_alternate(req.file, 'videos_uploaded_by_users', timestamp)

					if (use_gcp_storage){

						video_for_post = `https://storage.googleapis.com/${ gcp_bucket }/${ video_path }`

					} else if (use_aws_s3_storage){

						// since we will be using cloud front
						video_for_post = `${ video_path }`

					} else {

						video_for_post = get_file_path_to_use_alternate(req.file, 'videos_uploaded_by_users', timestamp)

					}


					var video_id = ''

					if (use_gcp_storage || use_aws_s3_storage){

						store_video_at_tmp_promise = store_video_at_tmp_and_get_its_path( req.file, video_path )
						promises.push(store_video_at_tmp_promise)

						promise_fulfilled = await Promise.all(promises)

						create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.file, promise_fulfilled[1], total_snapshots_count)

						save_snapshots_promises = await save_generated_snapshots(req.file, timestamp, total_snapshots_count)

						await Promise.all(save_snapshots_promises)

					} else {

						create_snapshots_promise = await create_snapshots_from_uploaded_video(timestamp, req.file, video_for_post, total_snapshots_count)

					}

					let user = await User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware

					let file_without_format = path.basename( req.file.originalname, path.extname( req.file.originalname ) )

					let random_screenshot = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp)  
					
					let get_random_screenshot = select_random_screenshot(random_screenshot, total_snapshots_count)

					let video_thumbnail_image_to_use
					if (use_gcp_storage || use_aws_s3_storage){

					// getting image from cloud
						video_thumbnail_image_to_use = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp)

					} else {

						video_thumbnail_image_to_use = `${get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp)}/${file_without_format}-${timestamp}_.png`

					}


					const newThumbnailImage = new Image({

						_id: new mongoose.Types.ObjectId(),
						category: 'video_thumbnail',
						image_filepath: video_thumbnail_image_to_use,
						// image_filepath: `${get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp)}/${file_without_format}-${timestamp}_.png`,
						// image_filepath: `./assets/images/uploads/images_uploaded_by_user/${filename_used_to_store_image_in_assets}`,
						title: req.body.title,
						description: req.body.description,
						all_tags: req.body.all_tags,
						object_files_hosted_at: get_file_storage_venue(),
						// timestamp_of_uploading: String( Date.now() ),
						// endpoint: req.body.endpoint, // this will be taken care in db model

					});

					await newThumbnailImage.save()


					video_id = new mongoose.Types.ObjectId()


					const newVideo = new Video({
						_id: video_id,
						image_thumbnail: newThumbnailImage._id,
						// image_thumbnail: get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp),
						// image_thumbnail: `./assets/videos/uploads/upload_thumbnails/${filename_used_to_store_video_in_assets_without_format}_1.png`,
						object_files_hosted_at: get_file_storage_venue(),
						timestamp_of_uploading: String( Date.now() ),
						video_filepath: video_for_post,
						// video_filepath: video_path,
						// video_filepath: `./assets/videos/uploads/videos_uploaded_by_user/${filename_used_to_store_video_in_assets}`,
						category: req.body.category,
						title: req.body.title,
						all_tags: req.body.all_tags,
						description: req.body.description,
						// endpoint:String, // will be taken care at db model
					})

					newVideo.user = user
					await newVideo.save()

					user.videos.push(newVideo)
					await user.save()

					let saved_video = await Video.findOne({ _id: video_id })
				
					if (use_gcp_storage || use_aws_s3_storage){

						video_thumbnail_image_to_use = await get_image_to_display(`upload_thumbnails/${get_random_screenshot}`, get_file_storage_venue())

					} else {

						let filepath_for_screenshot = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, timestamp)  
						get_random_screenshot = select_random_screenshot(`${filepath_for_screenshot}/${file_without_format}-${timestamp}_.png`, total_snapshots_count)
						video_thumbnail_image_to_use = await get_image_to_display(`${get_snapshots_storage_path()}/${get_random_screenshot}`, get_file_storage_venue())

					}


					console.log('saved_video.video_filepath')
					console.log(saved_video.video_filepath)

					res.status(200).json({ 
						category: saved_video.category,
						image_thumbnail: video_thumbnail_image_to_use,
						// image_thumbnail: newThumbnailImage.image_filepath,
						object_files_hosted_at:get_file_storage_venue(),
						// image_thumbnail: base64_encode( saved_video.image_thumbnail ),
						video_filepath: saved_video.video_filepath, // THIS IS SECURITY CONCERN THOUGH
						title: saved_video.title,
						endpoint: saved_video.endpoint,
						description: saved_video.description,
						timestamp_of_uploading: saved_video.timestamp_of_uploading,
						all_tags: saved_video.all_tags,
						total_comments: saved_video.total_comments,
						total_likes: saved_video.total_likes,
						// success: true, msg: 'new video saved', endpoint: saved_video.endpoint
					});	

				}
			}

		})()}

	})
})


// get n childs of blogpost
// USED 
router.get('/get-all-comments-of-video', async function(req, res, next){

	var video_with_comments = await Video.findOne({endpoint:req.query.endpoint}).populate('comments')
	var users_list_who_commented = await Promise.all(video_with_comments.comments.map(async (comment_object) => {

		let user_object = await User.findOne({_id:comment_object.user})

		return {
			// ...user_object, // NEVER SPREAD IN MONGOOSE, IT INCLUDES _doc and lots of other info
			user_name:user_object.user_name,
			user_image:user_object.user_image,
			text:comment_object.text
		}

	}))

// find image from user
	let final_result = []
	let image_in_base64_encoding

	let final_commments_payload = await Promise.all(users_list_who_commented.map(async (user_object) => {

		let image_object = await Image.findOne({_id:user_object.user_image})
		image_in_base64_encoding = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

		final_result.push({
			user_name:user_object.user_name,
			user_image:image_in_base64_encoding,
			// user_image:base64_encode(image_object.image_filepath),
			comment_text:user_object.text,
		})

	}))

	res.status(200).json( final_result );
})

// USED
router.get('/get-all-likes-of-video',async function(req, res, next){

// find video
	var video_with_likes = await Video.findOne({endpoint:req.query.endpoint}).populate('likes')

// find likes from video
	let users_list_who_liked = await Promise.all(video_with_likes.likes.map(async (like_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:like_object.user})
		return user_object
	}))

// find image from user
	let final_result = []
	let image_in_base64_encoding

	let final_liked_payload = await Promise.all(users_list_who_liked.map(async (user_object) => {

		let image_object = await Image.findOne({_id:user_object.user_image})
		image_in_base64_encoding = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
		final_result.push({
			user_name:user_object.user_name,
			user_image:image_in_base64_encoding,
			// user_image:base64_encode(image_object.image_filepath),
		})

	}))

	res.status(200).json( final_result );
})




// USED FOR CREATING COMMENT
router.post('/create-comment-for-video', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){

	var comment_text = req.body.comment_text	
	var video_endpoint = req.body.video_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {

		let image_in_base64_encoding

		newComment.user = user
		user.videos_comments.push(newComment)

	// finding video object
		Video.findOne({endpoint: video_endpoint})
		.then(async (video) => {

			video.comments.push( newComment )

			newComment.video = video
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			let image_object = await Image.findOne({_id:req.user.user_object.user_image})
			image_in_base64_encoding = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

			video.save((err, video) => {
				res.status(200).json({
					category: video.category,
					image_thumbnail: image_in_base64_encoding,
					// image_thumbnail: base64_encode( video.image_thumbnail ),
					video_filepath: video.video_filepath,
					title: video.title,
					endpoint: video.endpoint,
					description: video.description,
					all_tags: video.all_tags,
					total_comments: video.total_comments,
					total_likes: video.total_likes,
				})
			})
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
router.post('/create-like-for-video', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){

	var video_endpoint = req.body.video_endpoint

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {

		let image_in_base64_encoding

					
		newLike.user = user
		user.videos_likes.push(newLike)

	// finding video object
		Video.findOne({endpoint: video_endpoint})
		.then(async (video) => {

			video.likes.push( newLike )

			newLike.video = video

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})

			// let image_object = await Image.findOne({_id:video.image_thumbnail})
			let image_object = await Image.findOne({_id:req.user.user_object.user_image})
			image_in_base64_encoding = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

			video.save((err, video) => {
				// console.log('video')
				// console.log(video)
				res.status(200).json({
					category: video.category,
					image_thumbnail: image_in_base64_encoding,
					// image_thumbnail: base64_encode( video.image_thumbnail ),
					video_filepath: video.video_filepath,
					title: video.title,
					endpoint: video.endpoint,
					description: video.description,
					all_tags: video.all_tags,
					total_comments: video.total_comments,
					total_likes: video.total_likes,
				})
			})
		})
		.catch((err1) => {
			console.log(err1)
		})

	})
	.catch((err) => {
		console.log(err)
	})

})


router.get('/get-image', async function(req, res, next){

	let image_object = await Image.findOne({ _id: req.query.image_object_id })

	let random_thumbnail = select_random_screenshot(image_object.image_filepath, total_snapshots_count)
	let base64_encoded_image

	if (use_gcp_storage || use_aws_s3_storage){
		`/${random_thumbnail}`
		// newVideo.image_thumbnail = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
			base64_encoded_image = await get_image_to_display(`upload_thumbnails/${random_thumbnail}`, image_object.object_files_hosted_at)

	} else {

			base64_encoded_image = await get_image_to_display(`${get_snapshots_storage_path()}/${random_thumbnail}`, image_object.object_files_hosted_at)

	}

	res.status(200).json({success: true, image: base64_encoded_image});


})



// DOESNT SEND IMAGE IN BASE64 VER, BUT RATHER INSTEAD IMAGE OBJECT ID
router.get('/videos-list-with-children-light', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){
	console.log('called')

	Video.
	find().
	// limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then(async (videos)=>{
		console.log(`total videos are ${videos.length}`)

		var newVideos_list = []

		let all_videos = await Promise.all(videos.map(async (video, index)=>{
			var newVideo = {}
			
			newVideo.category = video[ 'category' ]


		// 	let image_object = await Image.findOne({ _id: video.image_thumbnail })
		// 	// let image_object = await Image.findOne({_id:req.user.user_object.user_image})

		// // video_thumbnail_image_to_use = await get_image_to_display(`${get_snapshots_storage_path()}/${get_random_screenshot}`, get_file_storage_venue())

		// 	let random_thumbnail = select_random_screenshot(image_object.image_filepath, total_snapshots_count)
			

		// 	if (use_gcp_storage || use_aws_s3_storage){
		// 		`/${random_thumbnail}`
		// 		// newVideo.image_thumbnail = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
	 // 			newVideo.image_thumbnail = await get_image_to_display(`upload_thumbnails/${random_thumbnail}`, image_object.object_files_hosted_at)

		// 	} else {

	 // 			newVideo.image_thumbnail = await get_image_to_display(`${get_snapshots_storage_path()}/${random_thumbnail}`, image_object.object_files_hosted_at)

		// 	}

			newVideo.image_thumbnail = video.image_thumbnail

			newVideo.video_filepath = video[ 'video_filepath' ] 
			let title_to_use = video[ 'title' ].split("-").join(" ")
			title_to_use = title_to_use.split('.').slice(0, -1).join('.') // removing file format name from end
			newVideo.title = title_to_use


			newVideo.all_tags = video[ 'all_tags' ]
			newVideo.description = video[ 'description' ]
			newVideo.endpoint = video[ 'endpoint' ]
			newVideo.object_files_hosted_at = video[ 'object_files_hosted_at' ]

			newVideo.total_comments = video['total_comments']
			newVideo.total_likes = video['total_likes']

			newVideos_list.push({...newVideo})
			newVideo = {}
		}))

		return newVideos_list
	})
	.then((newVideos_list) => {

		if (newVideos_list.length > 0) {

			res.status(200).json({success: true, videos:newVideos_list});

		} else {

			res.status(200).json({ success: false, msg: "could not find video_list" });

		}

	})
	.catch((err) => {

		console.log(err)
		next(err);

	});
});






// get blogposts_list_with_children
// USED
router.get('/videos-list-with-children', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){
	console.log('called')

	Video.
	find().
	// limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then(async (videos)=>{
		console.log(`total videos are ${videos.length}`)

		var newVideos_list = []

		let all_videos = await Promise.all(videos.map(async (video, index)=>{
			var newVideo = {}
			
			newVideo.category = video[ 'category' ]


			let image_object = await Image.findOne({ _id: video.image_thumbnail })
			// let image_object = await Image.findOne({_id:req.user.user_object.user_image})

		// video_thumbnail_image_to_use = await get_image_to_display(`${get_snapshots_storage_path()}/${get_random_screenshot}`, get_file_storage_venue())

			let random_thumbnail = select_random_screenshot(image_object.image_filepath, total_snapshots_count)
			

			if (use_gcp_storage || use_aws_s3_storage){
				`/${random_thumbnail}`
				// newVideo.image_thumbnail = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
	 			newVideo.image_thumbnail = await get_image_to_display(`upload_thumbnails/${random_thumbnail}`, image_object.object_files_hosted_at)

			} else {

	 			newVideo.image_thumbnail = await get_image_to_display(`${get_snapshots_storage_path()}/${random_thumbnail}`, image_object.object_files_hosted_at)

			}

			newVideo.video_filepath = video[ 'video_filepath' ] 
			let title_to_use = video[ 'title' ].split("-").join(" ")
			title_to_use = title_to_use.split('.').slice(0, -1).join('.') // removing file format name from end
			newVideo.title = title_to_use


			newVideo.all_tags = video[ 'all_tags' ]
			newVideo.description = video[ 'description' ]
			newVideo.endpoint = video[ 'endpoint' ]
			newVideo.object_files_hosted_at = video[ 'object_files_hosted_at' ]

			newVideo.total_comments = video['total_comments']
			newVideo.total_likes = video['total_likes']

			newVideos_list.push({...newVideo})
			newVideo = {}
		}))

		return newVideos_list
	})
	.then((newVideos_list) => {

		if (newVideos_list.length > 0) {

			res.status(200).json({success: true, videos:newVideos_list});

		} else {

			res.status(200).json({ success: false, msg: "could not find video_list" });

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

router.get('/videos-list-with-children', async function(req, res, next){

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
		then(async (videos)=>{

			var newVideos_list = []

			let all_videos = await Promise.all(videos.map(async (video, index)=>{
				var newVideo = {}


				let image_object = await Image.findOne({ _id: video.image_thumbnail })
				console.log('image_object.image_filepath')
				console.log(image_object.image_filepath)

				let random_screenshot = `upload_thumbnails/${select_random_screenshot(image_object.image_filepath, total_snapshots_count)}`
				// newVideo.image_thumbnail = await get_image_to_display(`${image_object.image_filepath}`, image_object.object_files_hosted_at)
				console.log('random_screenshot')
				console.log(random_screenshot)
				newVideo.image_thumbnail = await get_image_to_display(random_screenshot, image_object.object_files_hosted_at)

				newVideo.category = video[ 'category' ]
				// newVideo.image_thumbnail = base64_encode( video[ 'image_thumbnail' ] )
				// newVideo.video_filename = video[ 'video_filename' ]
				newVideo.title = video[ 'title' ]
				newVideo.endpoint = video[ 'endpoint' ]

				newVideos_list.push({...newVideo})
				newVideo = {}
			}))

			return newVideos_list
		})

		.then((newVideos_list) => {

			if (!newVideos_list) {

				res.status(401).json({ success: false, msg: "could not find Videos_list" });

			} else {

				console.log('newVideos_list')
				console.log(newVideos_list)
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