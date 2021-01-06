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

// Set The Storage Engine
const image_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/images/uploads/blogpost_image_main'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForBlogpostImage(file, cb){
	// Allowed ext
	let filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	let mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null,true);
	} else {
		cb('Error: jpeg, jpg, png, gif Images Only!');
	}
}

// Init Upload
const upload_main_image_by_user_of_blog = multer({
	storage: image_storage,
	limits:{fileSize: 20000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForBlogpostImage(file, cb);
	}
}).single('blogpost_image_main'); // this is the field that will be dealt
// .array('blogpost_image_main', 12)




// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-blogpost-with-user', passport.authenticate('jwt', { session: false }), isAllowedWritingBlogposts, function(req, res, next){
	

	console.log('OUTER LOG')
	console.log(req.body)

	upload_main_image_by_user_of_blog(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {
				// console.log('INNER LOG')
				// console.log(req.body)

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
					image_main_filepath: `./assets/images/uploads/blogpost_image_main/${filename_used_to_store_image_in_assets}`,
					// timestamp_of_uploading: String( Date.now() ),
					// endpoint: req.body.endpoint, // this will be taken care in db model

				});

				newBlogPost.save(function (err, newBlogPost) {

					if (err){
						res.status(404).json({ success: false, msg: 'couldnt create blogpost database entry'})
						return console.log(err)
					}
					// assign user object then save
					User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
					.then((user) => {
						if (user){

							newBlogPost.user = user
							newBlogPost.save()


							// in response sending new image too with base64 encoding
							let base64_encoded_image = base64_encode(newBlogPost.image_main_filepath)

							let new_blogpost = {
								category: newBlogPost.category,
								title: newBlogPost.title,
								initial_tags: newBlogPost.initial_tags,
								first_para: newBlogPost.first_para,
								second_para: newBlogPost.second_para,
								qouted_para: newBlogPost.qouted_para,
								third_para: newBlogPost.third_para,
								fourth_para: newBlogPost.fourth_para,
								all_tags: newBlogPost.all_tags,
								image_main: base64_encoded_image,
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
	})
})


// get n childs of blogpost
// USED 
router.get('/get-all-comments-of-blogpost', async function(req, res, next){

	let list_of_promises = []

	var blogpost_with_comments = await BlogPost.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	then((blogpost) => {

		if ( blogpost ){

			return blogpost.comments

		} else {

			null
		}
	})
	.catch((err) => console.log(err))

	console.log(blogpost_with_comments)

	list_of_promises.push( blogpost_with_comments )

	var users_list_who_commented = await Promise.all(blogpost_with_comments.map(async (comment_object) => {
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
	
		return await Image.findOne({_id:user_object.user_image})
		.then(async (image_object) => {

			if (image_object){

				return {
					user_name:user_object.user_name,
					user_image:base64_encode(image_object.image_filepath),
					comment_text:user_object.text,
				}

			} else {
				null
			}

		})

	}))

	// console.log('PROMISE RESULT 2')
	// console.log(final_comments_payload)

	Promise.all(list_of_promises)
	.then(() => {
		// console.log('COMMENTS SENT BELOW')
		// console.log(final_comments_payload)
		res.status(200).json( final_comments_payload );

	})

})

// USED
router.get('/get-all-likes-of-blogpost',async function(req, res, next){

	let list_of_promises = []

// find blogpost
	var blogpost_with_likes = await BlogPost.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	then((blogpost_with_likes) => {

		if ( blogpost_with_likes ){

			return blogpost_with_likes.likes
	
		} else {

			null

		}

	})

	list_of_promises.push( blogpost_with_likes )

// find likes from blogpost
	let users_list_who_liked = await Promise.all(blogpost_with_likes.map(async (like_object) => {

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
router.post('/create-comment-for-blogpost', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	var comment_text = req.body.comment_text	
	var blogpost_endpoint = req.body.blogpost_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newComment.user = user

	// finding BlogPost object
		BlogPost.findOne({endpoint: blogpost_endpoint})
		.then((blogpost) => {

			blogpost.comments.push( newComment )

			newComment.blogpost = blogpost
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			blogpost.save((err, blogpost) => res.status(200).json(blogpost) )
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
router.post('/create-like-for-blogpost', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	var blogpost_endpoint = req.body.blogpost_endpoint

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newLike.user = user

	// finding BlogPost object
		BlogPost.findOne({endpoint: blogpost_endpoint})
		.then((blogpost) => {

			blogpost.likes.push( newLike )

			newLike.blogpost = blogpost

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})
				
			blogpost.save((err, blogpost) => res.status(200).json(blogpost) )
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
router.get('/blogposts-list-with-children', function(req, res, next){
	console.log('called')

	BlogPost.
	find().
	limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then((blogposts)=>{
		var newBlogPosts_list = []
		blogposts.map((blogpost, index)=>{
			var newBlogPost = {}

			newBlogPost.category = blogpost[ 'category' ]
			newBlogPost.image_main_filepath = base64_encode( blogpost[ 'image_main_filepath' ] )
			newBlogPost.title = blogpost[ 'title' ]
			newBlogPost.timestamp_of_uploading = blogpost[ 'timestamp_of_uploading' ]
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