require('../models/blogpost');
require('../models/comment');
require('../models/user');


const base64_encode = require('../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const BlogPost = mongoose.model('BlogPost');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

// create a new blogpost with children

router.post('/create-blogpost-with-children', function(req, res, next){
	const newBlogPost = new BlogPost({

		_id: new mongoose.Types.ObjectId(),
		category: req.body.parent.category,
		image_main: req.body.parent.image_main,
		title: req.body.parent.title,
		date_of_publishing: req.body.parent.date_of_publishing,
		author_name: req.body.parent.author_name,
		first_para: req.body.parent.first_para,
		total_likes: req.body.parent.total_likes,
		total_shares: req.body.parent.total_shares,
		endpoint: req.body.parent.endpoint,
		initial_tags: req.body.parent.initial_tags,
		second_para: req.body.parent.second_para,
		qouted_para: req.body.parent.qouted_para,
		third_para: req.body.parent.third_para,
		fourth_para: req.body.parent.fourth_para,
		all_tags: req.body.parent.all_tags,
		author_details: req.body.parent.author_details,

	});

	newBlogPost.save(function (err, newBlogPost) {
		if (err) return console.log(err);



		const newComment = new Comment({

			_id: new mongoose.Types.ObjectId(),
			image_thumbnail: req.body.children.image_thumbnail,
			text: req.body.children.text,
			date_of_publishing: req.body.children.date_of_publishing,
			author_name: req.body.children.author_name,
			comment_order: req.body.children.comment_order,

		//assigning parent
			blogpost:newBlogPost._id,
			user:newBlogPost._id,

		});

		newBlogPost.comments.push(newComment._id)
		const newUser = new User({

			_id: new mongoose.Types.ObjectId(),
			user_name: req.body.children.user_name,
			phone_number: req.body.children.phone_number,

		//assigning parent
			blogposts:newBlogPost._id,
			comments:newBlogPost._id,

		});

		newBlogPost.users.push(newUser._id)

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

// find user
	
router.get('/find-user', function(req, res, next){

	User.findOne({ phone_number: req.body.phone_number })
		.then((user) => {
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

router.get('/top-n-comment-of-blogpost', function(req, res, next){
		BlogPost.
			findOne({endpoint:req.body.endpoint}).
	
		populate('comments').

		exec(function (err, blogpost_with_comments) {
	
			if (err) return console.log(err);
	

			var comments = blogpost_with_comments.comments
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

// get n childs of blogpost

router.get('/get-all-comments-of-blogpost', function(req, res, next){
	BlogPost.findOne({endpoint:req.query.endpoint}).
	populate('comments').
	exec(function (err, blogpost_with_comments) {

		if (err) return console.log(err);

		if ( blogpost_with_comments ){

			var comments = blogpost_with_comments.comments
			res.status(200).json( comments );

		} else {

			res.status(500).json({msg: 'sorry no blogpost found'});				

		}
	})
})


// create blogpost with undefined

router.post('/create-blogpost-with-user', function(req, res, next){
	
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



// create Comment for blogpost

router.post('/create-comment-for-blogpost', function(req, res, next){

	var comment_object = req.body.comment_object	
	var blogpost_object = req.body.blogpost_object
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

			// finding BlogPost object
					BlogPost.findOne({endpoint: blogpost_object.endpoint})
				.then((blogpost) => {

					if ( !blogpost ){

						console.log('no BlogPost found')

					} else {

						blogpost.comments.push( newComment )
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
			newBlogPost.author_name = blogpost[ 'author_name' ]
			newBlogPost.first_para = blogpost[ 'first_para' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((blogposts)=>{
			var newBlogPosts_list = []
			blogposts.map((blogpost, index)=>{
				var newBlogPost = {}

				newBlogPost.category = blogpost[ 'category' ]
				newBlogPost.image_main = base64_encode( blogpost[ 'image_main' ] )
				newBlogPost.title = blogpost[ 'title' ]
				newBlogPost.date_of_publishing = blogpost[ 'date_of_publishing' ]
				newBlogPost.author_name = blogpost[ 'author_name' ]
				newBlogPost.first_para = blogpost[ 'first_para' ]

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
		populate('user').
		populate('comments').
		populate('comments').
		then((blogposts)=>{
			var newBlogPosts_list = []
			blogposts.map((blogpost, index)=>{
				var newBlogPost = {}

				newBlogPost.category = blogpost[ 'category' ]
				newBlogPost.image_main = base64_encode( blogpost[ 'image_main' ] )
				newBlogPost.title = blogpost[ 'title' ]
				newBlogPost.date_of_publishing = blogpost[ 'date_of_publishing' ]
				newBlogPost.author_name = blogpost[ 'author_name' ]
				newBlogPost.first_para = blogpost[ 'first_para' ]

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
		populate('user').

		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


			var current_comments = blogpost_with_children.comments
			new_comments = []

			var current_user = blogpost_with_children.user
			new_user = []

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

			blogpost_with_children.comments = new_comments

			current_users.map((user, index)=>{
				var newUser = {}

	
				newUser.user_name = user[ 'user_name' ]
				newUser.phone_number = user[ 'phone_number' ]

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
					newBlogPost.author_name = blogpost[ 'author_name' ]
					newBlogPost.first_para = blogpost[ 'first_para' ]

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