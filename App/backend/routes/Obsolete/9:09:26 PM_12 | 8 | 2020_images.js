require('../models/image');
require('../models/comment');


const base64_encode = require('../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');

// create a new image with children

router.post('/create-image-with-children', function(req, res, next){
	const newImage = new Image({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_source: req.body.parent.image_source,
		title: req.body.parent.title,
		description: req.body.parent.description,
		date_of_publishing: req.body.parent.date_of_publishing,
		author_name: req.body.parent.author_name,
		total_likes: req.body.parent.total_likes,
		total_shares: req.body.parent.total_shares,
		endpoint: req.body.parent.endpoint,
		all_tags: req.body.parent.all_tags,
		uploader_details: req.body.parent.uploader_details,

	});

	newImage.save(function (err, newImage) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			image_thumbnail: req.body.children.image_thumbnail,
			text: req.body.children.text,
			date_of_publishing: req.body.children.date_of_publishing,
			author_name: req.body.children.author_name,
			comment_order: req.body.children.comment_order,

		//assigning parent
			image:newImage._id,
			user:newImage._id,

		});

		newImage.comments.push(newComment._id)

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

// get n childs of image

router.get('/top-n-comment-of-image', function(req, res, next){
		Image.
			findOne({endpoint:req.body.endpoint}).
	
		populate('comments').

		exec(function (err, image_with_comments) {
	
			if (err) return console.log(err);
	

			var comments = image_with_comments.comments
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

// get n childs of image

router.get('/get-all-comments-of-image', function(req, res, next){
	Image.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	exec(function (err, image_with_comments) {

		if (err) return console.log(err);

		if ( image_with_comments ){

			var comments = image_with_comments.comments
			res.status(200).json( comments );

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



// create Comment for image

router.post('/create-comment-for-image', function(req, res, next){

	var comment_object = req.body.comment_object	
	var image_object = req.body.image_object
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

			// finding Image object
					Image.findOne({endpoint: image_object.endpoint})
				.then((image) => {

					if ( !image ){

						console.log('no Image found')

					} else {

						image.comments.push( newComment )
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
			newImage.description = image[ 'description' ]
			newImage.date_of_publishing = image[ 'date_of_publishing' ]
			newImage.author_name = image[ 'author_name' ]
			newImage.total_likes = image[ 'total_likes' ]
			newImage.total_shares = image[ 'total_shares' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((images)=>{
			var newImages_list = []
			images.map((image, index)=>{
				var newImage = {}

				newImage.category = image[ 'category' ]
				newImage.image_source = base64_encode( image[ 'image_source' ] )
				newImage.title = image[ 'title' ]
				newImage.description = image[ 'description' ]
				newImage.date_of_publishing = image[ 'date_of_publishing' ]
				newImage.author_name = image[ 'author_name' ]
				newImage.total_likes = image[ 'total_likes' ]
				newImage.total_shares = image[ 'total_shares' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((images)=>{
			var newImages_list = []
			images.map((image, index)=>{
				var newImage = {}

				newImage.category = image[ 'category' ]
				newImage.image_source = base64_encode( image[ 'image_source' ] )
				newImage.title = image[ 'title' ]
				newImage.description = image[ 'description' ]
				newImage.date_of_publishing = image[ 'date_of_publishing' ]
				newImage.author_name = image[ 'author_name' ]
				newImage.total_likes = image[ 'total_likes' ]
				newImage.total_shares = image[ 'total_shares' ]

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

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = image_with_children.comments
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

			image_with_children.comments = new_comments

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
					newImage.description = image[ 'description' ]
					newImage.date_of_publishing = image[ 'date_of_publishing' ]
					newImage.author_name = image[ 'author_name' ]
					newImage.total_likes = image[ 'total_likes' ]
					newImage.total_shares = image[ 'total_shares' ]

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