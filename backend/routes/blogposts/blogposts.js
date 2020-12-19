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

// get n childs of blogpost

router.get('/get-all-likes-of-blogpost', function(req, res, next){
	BlogPost.findOne({endpoint:req.query.endpoint}).
	populate('likes').
	exec(function (err, blogpost_with_likes) {

		if (err) return console.log(err);

		if ( blogpost_with_likes ){

			var likes = blogpost_with_likes.likes
			res.status(200).json( likes );

		} else {

			res.status(500).json({msg: 'sorry no blogpost found'});				

		}
	})
})


// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/create-blogpost-with-user', passport.authenticate('jwt', { session: false }), isAllowedWritingBlogposts, function(req, res, next){
	
	var blogpost_object = req.body.blogpost_object
	var user_object = req.body.user_object

	var newBlogPost = new BlogPost({
		_id: new mongoose.Types.ObjectId(),
		...blogpost_object
	})

	newBlogPost.save(function (err, newBlogPost) {
		if (err) return console.log(err);

		User.
		findOne({...user_object})
		.then((user) => {
			
			if( !user ){
			
				console.log('no User found')
			
			} else {
			
				newBlogPost.user = user
				res.status(200).json( newBlogPost )
			
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
})



// create Like for blogpost

router.post('/create-like-for-blogpost', function(req, res, next){

	var like_object = req.body.like_object	
	var blogpost_object = req.body.blogpost_object
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

			// finding BlogPost object
					BlogPost.findOne({endpoint: blogpost_object.endpoint})
				.then((blogpost) => {

					if ( !blogpost ){

						console.log('no BlogPost found')

					} else {

						blogpost.likes.push( newLike )
						blogpost.save((err, blogpost) => res.status(200).json(blogpost) )
						
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

// get blogposts_list_with_children

router.get('/blogposts-list-with-children', function(req, res, next){

	BlogPost.
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