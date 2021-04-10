require('../../models/blogpost');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedWritingBlogposts } = require('../authMiddleware/isAllowedWritingBlogposts')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const BlogPost = mongoose.model('BlogPost');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const Image = mongoose.model('Image');

const multer = require('multer');
const path = require('path')

const {
	get_image_to_display,
	// store_video_at_tmp_and_get_its_path,
	// delete_video_at_tmp,
	get_multer_storage_to_use,
	// get_multer_storage_to_use_alternate,
	// get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	// get_file_path_to_use_for_bulk_files,
	// get_snapshots_storage_path,
	// get_snapshots_fullname_and_path,

	// gcp_bucket,
	// save_file_to_gcp_storage,
	save_file_to_gcp,
	// save_file_to_gcp_for_bulk_files,
	use_gcp_storage,
	// get_file_from_gcp,
	
	use_aws_s3_storage,
	// save_file_to_s3,
	// get_file_from_aws,
	// save_file_to_aws_s3,
	// save_file_to_aws_s3_for_bulk_files,

	checkFileTypeForImages,
	// checkFileTypeForImageAndVideo,
	// checkFileTypeForImagesAndExcelSheet,
} = require('../../config/storage/')

let timestamp

// NOT NEEDED
// Set The Storage Engine
// const image_storage = multer.diskStorage({
// 	destination: path.join(__dirname , '../../assets/images/uploads/blogpost_image_main'),
// 	filename: function(req, file, cb){
// 		// file name pattern fieldname-currentDate-fileformat
// 		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
// 		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

// 		filename_used_to_store_image_in_assets = file.originalname
// 		cb(null, file.originalname);

// 	}
// });

// NOT NEEDED
// Check File Type
// function checkFileTypeForBlogpostImage(file, cb){
// 	// Allowed ext
// 	let filetypes = /jpeg|jpg|png|gif/;
// 	// Check ext
// 	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// 	// Check mime
// 	let mimetype = filetypes.test(file.mimetype);

// 	if(mimetype && extname){
// 		return cb(null,true);
// 	} else {
// 		cb('Error: jpeg, jpg, png, gif Images Only!');
// 	}
// }

// Init Upload
function upload_main_image_by_user_of_blog(timestamp){

	return multer({
		storage: get_multer_storage_to_use(timestamp),
		limits:{fileSize: 20000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImages(file, cb);
		}
	}).single('blogpost_image_main'); // this is the field that will be dealt
	// .array('blogpost_image_main', 12)

} 




// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-blogpost-with-user', passport.authenticate('jwt', { session: false }), isAllowedWritingBlogposts, function(req, res, next){

	console.log('roeute called')	

	console.log('OUTER LOG')
	console.log(req.body)

	timestamp = Date.now()

	upload_main_image_by_user_of_blog(timestamp)(req, res, (err) => {

		{(async () => {

			if(err){

				console.log(err)

			} else {

				if(req.file == undefined){

					res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

				} else {

					if (use_gcp_storage){

						await save_file_to_gcp(timestamp, req.file)

					} else if (use_aws_s3_storage) {

						console.log('SAVED AUTOMATICALLY TO AWS')

					} else {

					}

					// console.log('INNER LOG')
					// console.log(req.body)

					const newBlogpostImage = new Image({

						_id: new mongoose.Types.ObjectId(),
						category: 'blogpost_image',
						image_filepath: get_file_path_to_use(req.file, 'blogpost_image_mains', timestamp),
						// image_filepath: `assets/blogpost_image_main/${file_without_format}-${timestamp}_.png`,
						// image_filepath: `./assets/images/uploads/images_uploaded_by_user/${filename_used_to_store_image_in_assets}`,
						title: req.body.title,
						description: req.body.description,
						all_tags: req.body.all_tags,
						object_files_hosted_at: get_file_storage_venue(),
						// timestamp_of_uploading: String( Date.now() ),
						// endpoint: req.body.endpoint, // this will be taken care in db model

					});

					await newBlogpostImage.save()


				// image is uploaded , now saving image in db
					const newBlogPost = new BlogPost({

						_id: new mongoose.Types.ObjectId(),
						category: req.body.category,
						title: req.body.title,
						initial_tags: req.body.initial_tags,
						first_para: req.body.first_para,
						second_para: req.body.second_para,
						qouted_para: req.body.qouted_para,
						third_para: req.body.third_para,
						fourth_para: req.body.fourth_para,
						all_tags: req.body.all_tags,
						image_main_filepath: newBlogpostImage._id,
						// image_main_filepath: get_file_path_to_use(req.file, 'blogpost_image_mains', timestamp),
						object_files_hosted_at: get_file_storage_venue(),
						// image_main_filepath: `./assets/images/uploads/blogpost_image_main/${filename_used_to_store_image_in_assets}`,
						// timestamp_of_uploading: String( Date.now() ),
						// endpoint: req.body.endpoint, // this will be taken care in db model

					});

					newBlogPost.save(async function (err, newBlogPost) {

						if (err){
							res.status(404).json({ success: false, msg: 'couldnt create blogpost database entry'})
							return console.log(err)
						}
						// assign user object then save
						User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
						.then(async (user) => {
							if (user){

								newBlogPost.user = user
								user.save()
								newBlogPost.save()

								let image_object = await Image.findOne({_id:newBlogPost.image_main_filepath})
								// in response sending new image too with base64 encoding
								let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

								let new_blogpost = {
									endpoint: newBlogPost.endpoint,
									category: newBlogPost.category,
									title: newBlogPost.title,
									initial_tags: newBlogPost.initial_tags,
									first_para: newBlogPost.first_para,
									second_para: newBlogPost.second_para,
									qouted_para: newBlogPost.qouted_para,
									third_para: newBlogPost.third_para,
									fourth_para: newBlogPost.fourth_para,
									all_tags: newBlogPost.all_tags,
									image_main_filepath: base64_encoded_image,
								}

								res.status(200).json({ success: true, msg: 'new user saved', new_blogpost: new_blogpost});	

							} else {

								res.status(200).json({ success: false, msg: "user doesnt exists, try logging in again" });

							}
						})
						.catch((err) => {

							next(err);

						});

					})

					// not needed, this is used only in multer
					// res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})
				}
			}

		})()}

	})
})


// get n childs of blogpost
// USED 
router.get('/get-all-comments-of-blogpost', async function(req, res, next){

	var blogpost_with_comments = await BlogPost.findOne({endpoint:req.query.endpoint}).populate('comments')

	var users_list_who_commented = await Promise.all(blogpost_with_comments.comments.map(async (comment_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:comment_object.user})
		return {
			// ...user_object, // NEVER SPREAD IN MONGOOSE, IT INCLUDES _doc and lots of other info
			user_name:user_object.user_name,
			user_image:user_object.user_image,
			text:comment_object.text
		}
	}))

	let final_result = []


	var final_comments_payload = await Promise.all(users_list_who_commented.map(async (user_object) => {

		let image_object = await Image.findOne({_id:user_object.user_image})
		let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
	
		final_result.push({
			user_name:user_object.user_name,
			user_image:base64_encoded_image,
			comment_text:user_object.text,
		})
	}))

	// final_result.map((result) => {
	// 	console.log(Object.keys(result))
	// })
	res.status(200).json( final_result );
})

// USED
router.get('/get-all-likes-of-blogpost',async function(req, res, next){

	// console.log({query:req.query.endpoint})

	var blogpost_with_likes = await BlogPost.findOne({endpoint:req.query.endpoint}).populate('likes')

	let users_list_who_liked = await Promise.all(blogpost_with_likes.likes.map(async (like_object) => {
	// find user from each like
		let user_object = await User.findOne({_id:like_object.user})
		return user_object
	}))

	let final_result = []

	let final_liked_payload = await Promise.all(users_list_who_liked.map(async (user_object) => {

		let image_object = await Image.findOne({_id:user_object.user_image})
		let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

		final_result.push({
			user_name:user_object.user_name,
			user_image:base64_encoded_image,
		})

	}))
	// final_result.map((result) => {
	// 	console.log(Object.keys(result))
	// })

	res.status(200).json( final_result );
})




// USED FOR CREATING COMMENT
router.post('/create-comment-for-blogpost', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){

	var comment_text = req.body.comment_text	
	var blogpost_endpoint = req.body.blogpost_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {
					
		newComment.user = user
		user.blogpost_comments.push(newComment)


	// finding BlogPost object
		BlogPost.findOne({endpoint: blogpost_endpoint})
		.then(async (blogpost) => {

			blogpost.comments.push( newComment )

			newComment.blogpost = blogpost
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			let image_object = await Image.findOne({_id:blogpost.image_main_filepath})
			let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)

			blogpost.save((err, blogpost) => {
				res.status(200).json({
					category: blogpost.category,
					image_main_filepath: base64_encoded_image,
					title: blogpost.title,
					timestamp_of_uploading: blogpost.timestamp_of_uploading,
					initial_tags: blogpost.initial_tags,
					first_para: blogpost.first_para,
					second_para: blogpost.second_para,
					qouted_para: blogpost.qouted_para,
					third_para: blogpost.third_para,
					fourth_para: blogpost.fourth_para,
					all_tags: blogpost.all_tags,
					endpoint: blogpost.endpoint,
					total_comments: blogpost.total_comments,
					total_likes: blogpost.total_likes,
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
router.post('/create-like-for-blogpost', passport.authenticate('jwt', { session: false }), isAllowedSurfing, async function(req, res, next){

	var blogpost_endpoint = req.body.blogpost_endpoint

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then(async (user) => {
					
		newLike.user = user
		user.blogpost_likes.push(newLike)

	// finding BlogPost object
		BlogPost.findOne({endpoint: blogpost_endpoint})
		.then(async (blogpost) => {

			blogpost.likes.push( newLike )

			newLike.blogpost = blogpost

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})

			let image_object = await Image.findOne({_id:blogpost.image_main_filepath})

			let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
				
			blogpost.save((err, blogpost) => {
				res.status(200).json({
					category: blogpost.category,
					image_main_filepath: base64_encoded_image,
					title: blogpost.title,
					timestamp_of_uploading: blogpost.timestamp_of_uploading,
					initial_tags: blogpost.initial_tags,
					first_para: blogpost.first_para,
					second_para: blogpost.second_para,
					qouted_para: blogpost.qouted_para,
					third_para: blogpost.third_para,
					fourth_para: blogpost.fourth_para,
					all_tags: blogpost.all_tags,
					endpoint: blogpost.endpoint,
					total_comments: blogpost.total_comments,
					total_likes: blogpost.total_likes,
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




// get blogposts_list_with_children
// USED
router.get('/blogposts-list-with-children', async function(req, res, next){
	console.log('called')

	BlogPost.
	find().
	limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then(async (blogposts)=>{
		// console.log('blogposts')
		// console.log(blogposts)

		var newBlogPosts_list = []
		let all_blogposts = await Promise.all(blogposts.map(async (blogpost, index)=>{
			
			console.log('blogpost')
			console.log(blogpost)

			var newBlogPost = {}

			let image_object = await Image.findOne({_id:blogpost.image_main_filepath})

			console.log('IMAGE OBJECT FOUND')
			console.log(image_object)

			let base64_encoded_image = await get_image_to_display(image_object.image_filepath, image_object.object_files_hosted_at)
			console.log('base64_encoded_image')
			console.log(base64_encoded_image)

			newBlogPost.category = blogpost[ 'category' ]
			newBlogPost.image_main_filepath = base64_encoded_image
			newBlogPost.title = blogpost[ 'title' ]
			newBlogPost.timestamp_of_uploading = blogpost[ 'timestamp_of_uploading' ]
			newBlogPost.initial_tags = blogpost[ 'initial_tags' ]
			newBlogPost.endpoint = blogpost[ 'endpoint' ]

			newBlogPost.total_comments = blogpost['total_comments']
			newBlogPost.total_likes = blogpost['total_likes']


			newBlogPosts_list.push({...newBlogPost})
			newBlogPost = {}
		}))

		return newBlogPosts_list
	})
	.then((newBlogPosts_list) => {
			console.log('newBlogPosts_list')
			console.log(newBlogPosts_list)

		if (newBlogPosts_list.length > 0) {

			res.status(200).json({success:true, blogposts:newBlogPosts_list});

		} else {

			res.status(200).json({ success: false, msg: "could not find BlogPosts_list" });

		}

	})
	.catch((err) => {

		console.log(err)
		next(err);

	});
});

















// create a new blogpost with children

router.post('/create-blogpost-with-children', function(req, res, next){
	const newBlogPost = new BlogPost({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_main: req.body.parent.image_main,
		title: req.body.parent.title,
		date_of_publishing: req.body.parent.date_of_publishing,
		initial_tags: req.body.parent.initial_tags,
		endpoint: req.body.parent.endpoint,
		first_para: req.body.parent.first_para,
		second_para: req.body.parent.second_para,
		qouted_para: req.body.parent.qouted_para,
		third_para: req.body.parent.third_para,
		fourth_para: req.body.parent.fourth_para,
		all_tags: req.body.parent.all_tags,

	});

	newBlogPost.save(function (err, newBlogPost) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			text: req.body.children.text,
			commenting_timestamp: req.body.children.commenting_timestamp,

		//assigning parent
			blogpost:newBlogPost,
			user:newBlogPost,

		});

		newBlogPost.comments.push(newComment)
		const newLike = new Like({

			_id: new mongoose.Types.ObjectId(),
			timestamp_of_liking: req.body.children.timestamp_of_liking,

		//assigning parent
			blogpost:newBlogPost,
			user:newBlogPost,

		});

		newBlogPost.likes.push(newLike)
		const newUser = new User({

			_id: new mongoose.Types.ObjectId(),
			user_name: req.body.children.user_name,
			phone_number: req.body.children.phone_number,
			user_image: req.body.children.user_image,
			hash: req.body.children.hash,
			salt: req.body.children.salt,

		//assigning parent
			blogposts:newBlogPost,
			comments:newBlogPost,
			likes:newBlogPost,

		});

		newBlogPost.users.push(newUser)

	newBlogPost.save();

	});

});

// find blogpost
	
router.get('/find-blogpost', function(req, res, next){

	BlogPost.findOne({ endpoint: req.body.endpoint })
		.then((blogpost) => {

			blogpost[ image_main ] = base64_encode( blogpost[ 'image_main' ] )

			if (!blogpost) {

				res.status(401).json({ success: false, msg: "could not find blogpost" });

			} else {

				res.status(200).json(blogpost);

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

// get n childs of blogpost

router.get('/top-n-like-of-blogpost', function(req, res, next){
		BlogPost.
			findOne({endpoint:req.body.endpoint}).
	
		populate('likes').

		exec(function (err, blogpost_with_likes) {
	
			if (err) return console.log(err);
	

			var likes = blogpost_with_likes.likes
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






// create Like for blogpost



// get blogposts_list

router.get('/blogposts-list', function(req, res, next){

BlogPost.
	find().
	limit(10).
	then((blogposts)=>{
		var newBlogPosts_list = []
		blogposts.map((blogpost, index)=>{
			var newBlogPost = {}

			newBlogPost.category = blogpost[ 'category' ]
			newBlogPost.image_main = base64_encode( blogpost[ 'image_main' ] )
			newBlogPost.title = blogpost[ 'title' ]
			newBlogPost.date_of_publishing = blogpost[ 'date_of_publishing' ]
			newBlogPost.initial_tags = blogpost[ 'initial_tags' ]
			newBlogPost.endpoint = blogpost[ 'endpoint' ]

			newBlogPosts_list.push({...newBlogPost})
			newBlogPost = {}
		});

		return newBlogPosts_list
	})

	.then((newBlogPosts_list) => {

		if (!newBlogPosts_list) {

			res.status(401).json({ success: false, msg: "could not find BlogPosts_list" });

		} else {

			res.status(200).json(newBlogPosts_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});


// get blogposts_list_next_10_with_children

router.get('/blogposts-list-next-10-with-children', function(req, res, next){

	BlogPost.
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
		then((blogposts)=>{
			var newBlogPosts_list = []
			blogposts.map((blogpost, index)=>{
				var newBlogPost = {}

				newBlogPost.category = blogpost[ 'category' ]
				newBlogPost.image_main = base64_encode( blogpost[ 'image_main' ] )
				newBlogPost.title = blogpost[ 'title' ]
				newBlogPost.date_of_publishing = blogpost[ 'date_of_publishing' ]
				newBlogPost.initial_tags = blogpost[ 'initial_tags' ]
				newBlogPost.endpoint = blogpost[ 'endpoint' ]

				newBlogPosts_list.push({...newBlogPost})
				newBlogPost = {}
			});

			return newBlogPosts_list
		})

		.then((newBlogPosts_list) => {

			if (!newBlogPosts_list) {

				res.status(401).json({ success: false, msg: "could not find BlogPosts_list" });

			} else {

				res.status(200).json(newBlogPosts_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get blogpost with children

router.get('/blogpost-with-children', function(req, res, next){
	BlogPost.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, blogpost_with_children) {
			if (err) return console.log(err);

			res.status(200).json(blogpost_with_children);
		});
})


// get blogpost with summarized children

router.get('/blogpost-with-summarized-children', function(req, res, next){
	BlogPost.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = blogpost_with_children.comments
			new_comments = []

			var current_likes = blogpost_with_children.likes
			new_likes = []

			var current_user = blogpost_with_children.user
			new_user = []

			current_comments.map((comment, index)=>{
				var newComment = {}

	
				newComment.text = comment[ 'text' ]
				newComment.commenting_timestamp = comment[ 'commenting_timestamp' ]

				new_comments.push({...newComment})
				newComment = {}
			});

			blogpost_with_children.comments = new_comments

			current_likes.map((like, index)=>{
				var newLike = {}

	
				newLike.timestamp_of_liking = like[ 'timestamp_of_liking' ]

				new_likes.push({...newLike})
				newLike = {}
			});

			blogpost_with_children.likes = new_likes

			current_users.map((user, index)=>{
				var newUser = {}

	
				newUser.user_name = user[ 'user_name' ]
				newUser.phone_number = user[ 'phone_number' ]
				newUser.user_image = user[ 'user_image' ]

				new_users.push({...newUser})
				newUser = {}
			});

			blogpost_with_children.users = new_users

		res.status(200).json(blogpost_with_children);

	});
})

// get next 10 blogposts_list

router.get('/blogposts-next-10-list', function(req, res, next){

	BlogPost.
		find().
		limit(10).
		skip(10).
		then( 
			(blogposts) => {
				var newBlogPosts_list = []
				blogposts.map((blogpost, index) => {
					var newBlogPost = {}
	
					newBlogPost.category = blogpost[ 'category' ]
					newBlogPost.image_main = base64_encode( blogpost[ 'image_main' ] )
					newBlogPost.title = blogpost[ 'title' ]
					newBlogPost.date_of_publishing = blogpost[ 'date_of_publishing' ]
					newBlogPost.initial_tags = blogpost[ 'initial_tags' ]
					newBlogPost.endpoint = blogpost[ 'endpoint' ]

					newBlogPosts_list.push({...newBlogPost})
					newBlogPost = {}
					})
			})

			return newBlogPosts_list

		.then((newBlogPosts_list) => {

			if (!newBlogPosts_list) {

				res.status(401).json({ success: false, msg: "could not find BlogPosts_list" });

			} else {

				res.status(200).json(newBlogPosts_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});
// create a comment for some blogpost
router.post('/remove-comment-from-blogpost', function(req, res, next){

	BlogPost.findOne({ endpoint: req.body.endpoint })
	.then((blogpost) => {

		blogpost.save(function (err, blogpost) {
			if (err) return console.log(err);

				Comment.findOne({ comment_order: req.body.child_index })


				.then((comment)=>{

				let index_of_comment = blogpost.comments.indexOf(comment);

				if (index_of_comment !== -1){

					blogpost.comments.splice(index, 1);

				}
			})

			Comment.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		blogpost.save();

	});

});

// create a like for some blogpost
router.post('/remove-like-from-blogpost', function(req, res, next){

	BlogPost.findOne({ endpoint: req.body.endpoint })
	.then((blogpost) => {

		blogpost.save(function (err, blogpost) {
			if (err) return console.log(err);

				Like.findOne({ time_of_liking: req.body.child_index })


				.then((like)=>{

				let index_of_like = blogpost.likes.indexOf(like);

				if (index_of_like !== -1){

					blogpost.likes.splice(index, 1);

				}
			})

			Like.findOneAndRemove( { time_of_liking: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		blogpost.save();

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