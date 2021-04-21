const {
	get_image_to_display
} = require('../../../config/storage/')

async function get_post_details(type_of_post, post_created, post_details){

	let image_for_post_to_use
	let video_thumbnail_image_to_use

	switch (type_of_post) {
		case "text_post":

			var { post_text } = post_created
			post_details = { ...post_details, post_text }
			break

		case "image_post":

			var { image_for_post, object_files_hosted_at } = post_created
			image_for_post_to_use = await get_image_to_display(image_for_post, object_files_hosted_at)
			post_details = { ...post_details, image_for_post: image_for_post_to_use }

			break

		case "video_post":

			var { video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			post_details = { ...post_details, video_for_post, video_thumbnail_image: video_thumbnail_image_to_use }									

			break

		case "text_with_image_post":

			var { post_text, image_for_post, object_files_hosted_at } = post_created
			image_for_post_to_use = await get_image_to_display(image_for_post, object_files_hosted_at)
			post_details = { ...post_details, post_text, image_for_post_to_use }									
			break

		case "text_with_video_post":

			var { post_text, video_for_post, video_thumbnail_image, object_files_hosted_at } = post_created
			video_thumbnail_image_to_use = await get_image_to_display(video_thumbnail_image, object_files_hosted_at)
			post_details = { ...post_details, post_text, video_for_post, video_thumbnail_image: video_thumbnail_image_to_use }									
			break

		default:
			null
	}

	return post_details
}


module.exports = get_post_details