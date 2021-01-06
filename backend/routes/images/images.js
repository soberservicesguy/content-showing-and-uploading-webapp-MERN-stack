require('../../models/image');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();

const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedUploadingImages } = require('../authMiddleware/isAllowedUploadingImages')

const multer = require('multer');
const path = require('path')

// Set The Storage Engine
const image_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/images/uploads/images_uploaded_by_user/'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForImage(file, cb){
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
const upload_main_image_by_user = multer({
	storage: image_storage,
	limits:{fileSize: 20000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForImage(file, cb);
	}
}).single('upload_images_by_user'); // this is the field that will be dealt
// .array('blogpost_image_main', 12)




// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-image-with-user', passport.authenticate('jwt', { session: false }), isAllowedUploadingImages, function(req, res, next){
	

	console.log('OUTER LOG')
	console.log(req.body)

	upload_main_image_by_user(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {
				// console.log('INNER LOG')
				// console.log(req.body)

			// image is uploaded , now saving image in db
				const newImage = new Image({

					_id: new mongoose.Types.ObjectId(),
					category: req.body.category,
					image_filepath: `./assets/images/uploads/images_uploaded_by_user/`,
					title: req.body.title,
					description: req.body.description,
					all_tags: req.body.all_tags,
					// timestamp_of_uploading: String( Date.now() ),
					// endpoint: req.body.endpoint, // this will be taken care in db model

				});

				newImage.save(function (err, newImage) {

					if (err){
						res.status(404).json({ success: false, msg: 'couldnt create Image database entry'})
						return console.log(err)
					}
					// assign user object then save
					User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
					.then((user) => {
						if (user){

							newImage.user = user
							newImage.save()


							// in response sending new image too with base64 encoding
							let base64_encoded_image = base64_encode(newImage.image_filepath)

							let new_image = {
								category: newImage.category,
								image_filepath: base64_encoded_image,
								title: newImage.title,
								description: newImage.description,
								all_tags: newImage.all_tags,
							}

							res.status(200).json({ success: true, msg: 'new user saved', new_image: new_image});	

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


// get n childs of image
// USED 
router.get('/get-all-comments-of-image', async function(req, res, next){

	let list_of_promises = []

	var image_with_comments = await Image.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	then((image) => {

		if ( image ){

			return image.comments

		} else {

			null
		}
	})
	.catch((err) => console.log(err))

	console.log(image_with_comments)

	list_of_promises.push( image_with_comments )

	var users_list_who_commented = await Promise.all(image_with_comments.map(async (comment_object) => {
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

		// console.log(final_comments_payload)
		res.status(200).json( final_comments_payload );

	})

})

// USED
router.get('/get-all-likes-of-image',async function(req, res, next){

	let list_of_promises = []

// find image
	var image_with_likes = await Image.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	then((image_with_likes) => {

		if ( image_with_likes ){

			return image_with_likes.likes
	
		} else {

			null

		}

	})

	list_of_promises.push( image_with_likes )

// find likes from blogpost
	let users_list_who_liked = await Promise.all(image_with_likes.map(async (like_object) => {

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
router.post('/create-comment-for-image', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	console.log('CALLED')
	var comment_text = req.body.comment_text	
	var image_endpoint = req.body.image_endpoint

	var newComment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		text:comment_text,
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newComment.user = user

	// finding BlogPost object
		Image.findOne({endpoint: image_endpoint})
		.then((image) => {

			image.comments.push( newComment )
			
			newComment.save(function (err, newComment) {
				if (err) return console.log(err);
			})

			image.save((err, image) => res.status(200).json(image) )
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
router.post('/create-like-for-image', passport.authenticate('jwt', { session: false }), isAllowedSurfing, function(req, res, next){

	var image_endpoint = req.body.image_endpoint

	var newLike = new Like({
		_id: new mongoose.Types.ObjectId(),
	})

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		newLike.user = user

	// finding image object
		Image.findOne({endpoint: image_endpoint})
		.then((image) => {

			image.likes.push( newLike )

			newLike.save(function (err, newLike) {
				if (err) return console.log(err);
			})
			console.log('LIKE CREATED FOR IMAGE')	
			image.save((err, image) => res.status(200).json(image) )
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
router.get('/images-list-with-children', function(req, res, next){
	console.log('called')

	Image.
	find().
	limit(10).
	populate('comments').
	populate('likes').
	// populate('user').
	then((images)=>{
		var newImages_list = []
		images.map((image, index)=>{
			var newImage = {}

			newImage.category = image['category']
			newImage.image_filepath = base64_encode( image['image_filepath'] )
			newImage.title = image['title']
			newImage.endpoint = image['endpoint']

			newImages_list.push({...newImage})
			newImage = {}
		});

		return newImages_list
	})
	.then((newImages_list) => {

		if (!newImages_list) {

			res.status(401).json({ success: false, msg: "could not find Images_list" });

		} else {

			res.status(200).json(newImages_list);

		}

	})
	.catch((err) => {

		console.log(err)
		next(err);

	});
});

















// create a new image with children

router.post('/create-image-with-children', function(req, res, next){
	const newImage = new Image({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_source: req.body.parent.image_source,
		title: req.body.parent.title,
		endpoint: req.body.parent.endpoint,
		timestamp_of_uploading: req.body.parent.timestamp_of_uploading,
		description: req.body.parent.description,
		all_tags: req.body.parent.all_tags,

	});

	newImage.save(function (err, newImage) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			text: req.body.children.text,
			commenting_timestamp: req.body.children.commenting_timestamp,

		//assigning parent
			image:newImage._id,
			user:newImage._id,

		});

		newImage.comments.push(newComment._id)
		const newLike = new Like({

			_id: new mongoose.Types.ObjectId(),
			timestamp_of_liking: req.body.children.timestamp_of_liking,

		//assigning parent
			image:newImage._id,
			user:newImage._id,

		});

		newImage.likes.push(newLike._id)
		const newUser = new User({

			_id: new mongoose.Types.ObjectId(),
			user_name: req.body.children.user_name,
			phone_number: req.body.children.phone_number,
			user_image: req.body.children.user_image,
			hash: req.body.children.hash,
			salt: req.body.children.salt,

		//assigning parent
			blogposts:newImage._id,
			comments:newImage._id,
			likes:newImage._id,
			videos:newImage._id,
			comments:newImage._id,
			likes:newImage._id,
			images:newImage._id,
			comments:newImage._id,
			likes:newImage._id,

		});

		newImage.users.push(newUser._id)

	newImage.save();

	});

});

// find image
	
router.get('/find-image', function(req, res, next){

	Image.findOne({ endpoint: req.body.endpoint })
		.then((image) => {

			image[ image_source ] = base64_encode( image[ 'image_source' ] )

			if (!image) {

				res.status(401).json({ success: false, msg: "could not find image" });

			} else {

				res.status(200).json(image);

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

// get n childs of image

router.get('/top-n-like-of-image', function(req, res, next){
		Image.
			findOne({endpoint:req.body.endpoint}).
	
		populate('likes').

		exec(function (err, image_with_likes) {
	
			if (err) return console.log(err);
	

			var likes = image_with_likes.likes
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

// get n childs of image

router.get('/get-all-likes-of-image', function(req, res, next){
	Image.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	exec(function (err, image_with_likes) {

		if (err) return console.log(err);

		if ( image_with_likes ){

			var likes = image_with_likes.likes
			res.status(200).json( likes );

		} else {

			res.status(500).json({msg: 'sorry no image found'});				

		}
	})
})


// create image with undefined

router.post('/create-image-with-user', function(req, res, next){
	
	var image_object = req.body.image_object
	var user_object = req.body.user_object

	var newImage = new Image({
		_id: new mongoose.Types.ObjectId(),
		...image_object
	})

	newImage.save(function (err, newImage) {
		if (err) return console.log(err);

			User.
			findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newImage.user = user
				res.status(200).json( newImage )
			
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// create Like for image

router.post('/create-like-for-image', function(req, res, next){

	var like_object = req.body.like_object	
	var image_object = req.body.image_object
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

			// finding Image object
					Image.findOne({endpoint: image_object.endpoint})
				.then((image) => {

					if ( !image ){

						console.log('no Image found')

					} else {

						image.likes.push( newLike )
						image.save((err, blogpost) => res.status(200).json(image) )
						
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



// get images_list

router.get('/images-list', function(req, res, next){

Image.
	find().
	limit(10).
	then((images)=>{
		var newImages_list = []
		images.map((image, index)=>{
			var newImage = {}

			newImage.category = image[ 'category' ]
			newImage.image_source = base64_encode( image[ 'image_source' ] )
			newImage.title = image[ 'title' ]
			newImage.endpoint = image[ 'endpoint' ]

			newImages_list.push({...newImage})
			newImage = {}
		});

		return newImages_list
	})

	.then((newImages_list) => {

		if (!newImages_list) {

			res.status(401).json({ success: false, msg: "could not find Images_list" });

		} else {

			res.status(200).json(newImages_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});

// get images_list_with_children

router.get('/images-list-with-children', function(req, res, next){

	Image.
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
		then((images)=>{
			var newImages_list = []
			images.map((image, index)=>{
				var newImage = {}

				newImage.category = image[ 'category' ]
				newImage.image_source = base64_encode( image[ 'image_source' ] )
				newImage.title = image[ 'title' ]
				newImage.endpoint = image[ 'endpoint' ]

				newImages_list.push({...newImage})
				newImage = {}
			});

			return newImages_list
		})

		.then((newImages_list) => {

			if (!newImages_list) {

				res.status(401).json({ success: false, msg: "could not find Images_list" });

			} else {

				res.status(200).json(newImages_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get images_list_next_10_with_children

router.get('/images-list-next-10-with-children', function(req, res, next){

	Image.
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
		then((images)=>{
			var newImages_list = []
			images.map((image, index)=>{
				var newImage = {}

				newImage.category = image[ 'category' ]
				newImage.image_source = base64_encode( image[ 'image_source' ] )
				newImage.title = image[ 'title' ]
				newImage.endpoint = image[ 'endpoint' ]

				newImages_list.push({...newImage})
				newImage = {}
			});

			return newImages_list
		})

		.then((newImages_list) => {

			if (!newImages_list) {

				res.status(401).json({ success: false, msg: "could not find Images_list" });

			} else {

				res.status(200).json(newImages_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get image with children

router.get('/image-with-children', function(req, res, next){
	Image.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, image_with_children) {
			if (err) return console.log(err);

			res.status(200).json(image_with_children);
		});
})


// get image with summarized children

router.get('/image-with-summarized-children', function(req, res, next){
	Image.
		findOne({endpoint:req.body.endpoint}).

		populate('comments').
		populate('likes').
		populate('user').

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = image_with_children.comments
			new_comments = []

			var current_likes = image_with_children.likes
			new_likes = []

			var current_user = image_with_children.user
			new_user = []

			current_comments.map((comment, index)=>{
				var newComment = {}

	
				newComment.text = comment[ 'text' ]
				newComment.commenting_timestamp = comment[ 'commenting_timestamp' ]

				new_comments.push({...newComment})
				newComment = {}
			});

			image_with_children.comments = new_comments

			current_likes.map((like, index)=>{
				var newLike = {}

	
				newLike.timestamp_of_liking = like[ 'timestamp_of_liking' ]

				new_likes.push({...newLike})
				newLike = {}
			});

			image_with_children.likes = new_likes

			current_users.map((user, index)=>{
				var newUser = {}

	
				newUser.user_name = user[ 'user_name' ]
				newUser.phone_number = user[ 'phone_number' ]
				newUser.user_image = user[ 'user_image' ]

				new_users.push({...newUser})
				newUser = {}
			});

			image_with_children.users = new_users

		res.status(200).json(image_with_children);

	});
})

// get next 10 images_list

router.get('/images-next-10-list', function(req, res, next){

	Image.
		find().
		limit(10).
		skip(10).
		then( 
			(images) => {
				var newImages_list = []
				images.map((image, index) => {
					var newImage = {}
	
					newImage.category = image[ 'category' ]
					newImage.image_source = base64_encode( image[ 'image_source' ] )
					newImage.title = image[ 'title' ]
					newImage.endpoint = image[ 'endpoint' ]

					newImages_list.push({...newImage})
					newImage = {}
					})
			})

			return newImages_list

		.then((newImages_list) => {

			if (!newImages_list) {

				res.status(401).json({ success: false, msg: "could not find Images_list" });

			} else {

				res.status(200).json(newImages_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});
// create a comment for some image
router.post('/remove-comment-from-image', function(req, res, next){

	Image.findOne({ endpoint: req.body.endpoint })
	.then((image) => {

		image.save(function (err, image) {
			if (err) return console.log(err);

				Comment.findOne({ comment_order: req.body.child_index })


				.then((comment)=>{

				let index_of_comment = image.comments.indexOf(comment);

				if (index_of_comment !== -1){

					image.comments.splice(index, 1);

				}
			})

			Comment.findOneAndRemove( { comment_order: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		image.save();

	});

});

// create a like for some image
router.post('/remove-like-from-image', function(req, res, next){

	Image.findOne({ endpoint: req.body.endpoint })
	.then((image) => {

		image.save(function (err, image) {
			if (err) return console.log(err);

				Like.findOne({ time_of_liking: req.body.child_index })


				.then((like)=>{

				let index_of_like = image.likes.indexOf(like);

				if (index_of_like !== -1){

					image.likes.splice(index, 1);

				}
			})

			Like.findOneAndRemove( { time_of_liking: req.body.child_index }, (err) => {
				if (err) { console.log(err) }
			})

		});

		image.save();

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