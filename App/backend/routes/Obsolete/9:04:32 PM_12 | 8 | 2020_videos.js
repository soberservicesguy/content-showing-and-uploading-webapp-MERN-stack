require('../models/video');
require('../models/comment');


const base64_encode = require('../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Video = mongoose.model('Video');
const Comment = mongoose.model('Comment');

// create a new video with children

router.post('/create-video-with-children', function(req, res, next){
	const newVideo = new Video({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_main: req.body.parent.image_main,
		title: req.body.parent.title,
		description: req.body.parent.description,
		date_of_publishing: req.body.parent.date_of_publishing,
		author_name: req.body.parent.author_name,
		first_para: req.body.parent.first_para,
		total_likes: req.body.parent.total_likes,
		total_shares: req.body.parent.total_shares,
		endpoint: req.body.parent.endpoint,
		initial_tags: req.body.parent.initial_tags,
		video_path: req.body.parent.video_path,
		video_format: req.body.parent.video_format,
		all_tags: req.body.parent.all_tags,
		uploader_details: req.body.parent.uploader_details,

	});

	newVideo.save(function (err, newVideo) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			image_thumbnail: req.body.children.image_thumbnail,
			text: req.body.children.text,
			date_of_publishing: req.body.children.date_of_publishing,
			author_name: req.body.children.author_name,
			comment_order: req.body.children.comment_order,

		//assigning parent
			video:newVideo._id,
			user:newVideo._id,

		});

		newVideo.comments.push(newComment._id)

	newVideo.save();

	});

});

// find video
	
router.get('/find-video', function(req, res, next){

	Video.findOne({ endpoint: req.body.endpoint })
		.then((video) => {

			video[ image_main ] = base64_encode( video[ 'image_main' ] )

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

			comment[ image_thumbnail ] = base64_encode( comment[ 'image_thumbnail' ] )

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

// get n childs of video

router.get('/top-n-comment-of-video', function(req, res, next){
		Video.
			findOne({endpoint:req.body.endpoint}).
	
		populate('comments').

		exec(function (err, video_with_comments) {
	
			if (err) return console.log(err);
	

			var comments = video_with_comments.comments
			new_comment_collection = []				
				for (let i = 0; i < comments.length; i++) {
					if ( i === req.body.child_count ){
						break
					}

					new_comment_collection.push( comments[i] )
				} 


		res.status(200).json(new_comment_collection);

	});
})

// get n childs of video

router.get('/get-all-comments-of-video', function(req, res, next){
	Video.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	exec(function (err, video_with_comments) {

		if (err) return console.log(err);

		if ( video_with_comments ){

			var comments = video_with_comments.comments
			res.status(200).json( comments );

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



// create Comment for video

router.post('/create-comment-for-video', function(req, res, next){

	var comment_object = req.body.comment_object	
	var video_object = req.body.video_object
	var user_object = req.body.user_object

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		...comment_object
	})

	newComment.save(function (err, newComment) {
		if (err) return console.log(err);

			User.findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newComment.user = user

			// finding Video object
					Video.findOne({endpoint: video_object.endpoint})
				.then((video) => {

					if ( !video ){

						console.log('no Video found')

					} else {

						video.comments.push( newComment )
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
			newVideo.image_main = base64_encode( video[ 'image_main' ] )
			newVideo.title = video[ 'title' ]
			newVideo.description = video[ 'description' ]
			newVideo.date_of_publishing = video[ 'date_of_publishing' ]
			newVideo.author_name = video[ 'author_name' ]
			newVideo.first_para = video[ 'first_para' ]
			newVideo.total_likes = video[ 'total_likes' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((videos)=>{
			var newVideos_list = []
			videos.map((video, index)=>{
				var newVideo = {}

				newVideo.category = video[ 'category' ]
				newVideo.image_main = base64_encode( video[ 'image_main' ] )
				newVideo.title = video[ 'title' ]
				newVideo.description = video[ 'description' ]
				newVideo.date_of_publishing = video[ 'date_of_publishing' ]
				newVideo.author_name = video[ 'author_name' ]
				newVideo.first_para = video[ 'first_para' ]
				newVideo.total_likes = video[ 'total_likes' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((videos)=>{
			var newVideos_list = []
			videos.map((video, index)=>{
				var newVideo = {}

				newVideo.category = video[ 'category' ]
				newVideo.image_main = base64_encode( video[ 'image_main' ] )
				newVideo.title = video[ 'title' ]
				newVideo.description = video[ 'description' ]
				newVideo.date_of_publishing = video[ 'date_of_publishing' ]
				newVideo.author_name = video[ 'author_name' ]
				newVideo.first_para = video[ 'first_para' ]
				newVideo.total_likes = video[ 'total_likes' ]

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

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = video_with_children.comments
			new_comments = []

			current_comments.map((comment, index)=>{
				var newComment = {}

	
				newComment.image_thumbnail = comment[ 'image_thumbnail' ]
				newComment.text = comment[ 'text' ]
				newComment.date_of_publishing = comment[ 'date_of_publishing' ]
				newComment.author_name = comment[ 'author_name' ]
				newComment.comment_order = comment[ 'comment_order' ]

				new_comments.push({...newComment})
				newComment = {}
			});

			video_with_children.comments = new_comments

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
					newVideo.image_main = base64_encode( video[ 'image_main' ] )
					newVideo.title = video[ 'title' ]
					newVideo.description = video[ 'description' ]
					newVideo.date_of_publishing = video[ 'date_of_publishing' ]
					newVideo.author_name = video[ 'author_name' ]
					newVideo.first_para = video[ 'first_para' ]
					newVideo.total_likes = video[ 'total_likes' ]

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


// create User

router.post('/create-user', function(req, res, next){

	User.findOne({
		user_name: req.body.user_name,
		phone_number: req.body.phone_number,
	})
	.then((user) => {

		if (!user) {


			const newUser = new User({
				_id: new mongoose.Types.ObjectId(),
				user_name: req.body.user_name,
				phone_number: req.body.phone_number,
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