require('../../../models/user');
require('../../../models/socialpost');
require('../../../models/activity');
const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
const SocialPost = mongoose.model('SocialPost');
const User = mongoose.model('User');
const select_random_screenshot = require('./select_random_screenshot')

const {
	get_image_to_display,
	use_gcp_storage,
	use_aws_s3_storage,
} = require('../../../config/storage/')

async function save_socialpost_and_activity(req, res, err, newSocialPost, social_post_type, social_post_id, total_snapshots_count){

	newSocialPost.save(async function (err, newSocialPost) {

		if (err){
			res.status(404).json({ success: false, msg: 'couldnt create socialpost database entry'})
			return console.log(err)
		}

		// assign user object then save
		User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
		.then(async (user) => {
			if (user){

				newSocialPost.user = user
				await newSocialPost.save()

				let new_socialpost = {}
				let socialpost_endpoint = ''

				switch (social_post_type) {
					case "text_post":

						SocialPost.findOne({ _id: social_post_id })
						.then(async (saved_socialpost) => {

							socialpost_endpoint = saved_socialpost.endpoint

							new_socialpost = {
								type_of_post: newSocialPost.type_of_post,
								post_text: newSocialPost.post_text,
							}

							res.status(200).json({ success: true, msg: 'new social post saved', socialpost_endpoint: socialpost_endpoint, new_socialpost: new_socialpost});	

						})

						break

					case "image_post":

						SocialPost.findOne({ _id: social_post_id })
						.then(async (saved_socialpost) => {

							socialpost_endpoint = saved_socialpost.endpoint

							console.log('newSocialPost.image_for_post')
							console.log(newSocialPost.image_for_post)

							let image_for_post_to_use = await get_image_to_display(newSocialPost.image_for_post, newSocialPost.object_files_hosted_at)

							new_socialpost = {
								type_of_post: newSocialPost.type_of_post,
								image_for_post: image_for_post_to_use,
							}

							res.status(200).json({ success: true, msg: 'new social post saved', socialpost_endpoint: socialpost_endpoint, new_socialpost: new_socialpost});	

						})

						break

					case "text_with_image_post":

						SocialPost.findOne({ _id: social_post_id })
						.then(async (saved_socialpost) => {

							socialpost_endpoint = saved_socialpost.endpoint

							let image_for_post_to_use = await get_image_to_display(newSocialPost.image_for_post, newSocialPost.object_files_hosted_at)

							new_socialpost = {
								type_of_post: newSocialPost.type_of_post,
								image_for_post: image_for_post_to_use,
								post_text: newSocialPost.post_text,
							}

							res.status(200).json({ success: true, msg: 'new social post saved', socialpost_endpoint: socialpost_endpoint, new_socialpost: new_socialpost});	

						})

						break

					case "video_post":

						SocialPost.findOne({ _id: social_post_id })
						.then(async (saved_socialpost) => {

							socialpost_endpoint = saved_socialpost.endpoint

							let get_random_screenshot = select_random_screenshot(newSocialPost.video_thumbnail_image, total_snapshots_count)
							console.log('get_random_screenshot')
							console.log(get_random_screenshot)
							let video_thumbnail_image_to_use
							if (use_gcp_storage || use_aws_s3_storage){

								video_thumbnail_image_to_use = await get_image_to_display(`thumbnails_for_social_videos/${get_random_screenshot}`, newSocialPost.object_files_hosted_at)

							} else {

								video_thumbnail_image_to_use = `assets/uploads/thumbnails_for_social_videos/${get_random_screenshot}`

							}

							new_socialpost = {
								type_of_post: newSocialPost.type_of_post,
								video_thumbnail_image: video_thumbnail_image_to_use,
								video_for_post: newSocialPost.video_for_post,
								object_files_hosted_at: newSocialPost.object_files_hosted_at,
								socialpost_endpoint: newSocialPost.endpoint,
							}

							res.status(200).json({ success: true, msg: 'new social post saved', socialpost_endpoint: socialpost_endpoint, new_socialpost: new_socialpost});	

						})

						break


					case "text_with_video_post":

						SocialPost.findOne({ _id: social_post_id })
						.then(async (saved_socialpost) => {

							socialpost_endpoint = saved_socialpost.endpoint

							let get_random_screenshot = select_random_screenshot(newSocialPost.video_thumbnail_image, total_snapshots_count)
							let video_thumbnail_image_to_use
							if (use_gcp_storage || use_aws_s3_storage){

								video_thumbnail_image_to_use = await get_image_to_display(`thumbnails_for_social_videos/${get_random_screenshot}`, newSocialPost.object_files_hosted_at)

							} else {

								video_thumbnail_image_to_use = `assets/uploads/thumbnails_for_social_videos/${get_random_screenshot}`

							}
							
							new_socialpost = {
								post_text: newSocialPost.post_text,
								type_of_post: newSocialPost.type_of_post,
								video_thumbnail_image: video_thumbnail_image_to_use,
								video_for_post: newSocialPost.video_for_post,
								object_files_hosted_at: newSocialPost.object_files_hosted_at,
								socialpost_endpoint: newSocialPost.endpoint,
							}

							res.status(200).json({ success: true, msg: 'new social post saved', socialpost_endpoint: socialpost_endpoint, new_socialpost: new_socialpost});	

						})
						break


					default:
						null

				}

				console.log('TILL HERE1')

				let newActivity = new Activity({
					_id: new mongoose.Types.ObjectId(),
					user: user,
					activity_type: 'created_post',
					post_created: newSocialPost,
				})
				newActivity.save()
				user.activities.push(newActivity)
				user.save()
				
				console.log('TILL HERE2')

			} else {

				console.log('TILL HERE3')

				res.status(200).json({ success: false, msg: "couldnt save social post" });

			}
		})
		.catch((err) => {

			next(err);

		});

	})

}

module.exports = save_socialpost_and_activity