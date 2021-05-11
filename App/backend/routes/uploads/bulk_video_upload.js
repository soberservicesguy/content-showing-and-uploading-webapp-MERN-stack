require('../../models/video');
require('../../models/image');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedUploadingVideos } = require('../authMiddleware/isAllowedUploadingVideos')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Video = mongoose.model('Video');
const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const multer = require('multer');
const path = require('path')

const fs = require('fs')

var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot


// bulk importing script
const sheet_to_class = require('../../excel_to_databases/import_bulkvideos')
const bulk_delete_all_videos = require('../../excel_to_databases/delete_all_videos')

const {
	get_multer_disk_storage_for_bulk_files_path_only,
	get_snapshots_fullname_and_path,
	get_file_path_to_use_alternate,
	store_video_at_tmp_and_get_its_path,
	get_filepath_to_save_with_bulk_uploading,
	store_excel_file_at_tmp_and_get_its_path,
	get_multer_storage_to_use,
	get_multer_storage_to_use_for_bulk_files,
	get_file_storage_venue,
	get_file_path_to_use,
	get_file_path_to_use_for_bulk_files,

	use_gcp_storage,
	use_aws_s3_storage,

	save_file_to_gcp,
	save_file_to_gcp_for_bulk_files,
	gcp_bucket,

	get_snapshots_storage_path,

	save_file_to_aws_s3,
	save_file_to_aws_s3_for_bulk_files,

	get_multer_disk_storage_for_bulk_files,

	checkFileTypeForImages,
	checkFileTypeForImageAndVideo,
	checkFileTypeForImagesAndExcelSheet,
	checkFileTypeForVideosAndExcelSheet,
} = require('../../config/storage/')

const {
	select_random_screenshot,
	create_snapshots_from_uploaded_video,
	// save_socialpost_and_activity,
	save_generated_snapshots,
	// get_post_details,
} = require('../video_routes/functions')

let timestamp
let currentDate
let currentTime

let total_snapshots_count = 4


// Init Upload
function bulk_upload_videos(timestamp, folder_name){

	return multer({
		storage: get_multer_storage_to_use_for_bulk_files(timestamp, folder_name),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForVideosAndExcelSheet(file, cb);
		},
		filename: function ( req, file, cb ) {
            cb( null, file.originalname.split(" ").join(""));
        }
	}).fields([
		{ name: 'videos_to_upload', maxCount: 1000 },
		{ name: 'excel_sheet', maxCount: 1 }, 
	])  // these are the fields that will be dealt
	// .single('image_thumbnails'); 
	// .array('photos', 12)

}


// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/bulk-upload-videos', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, async function(req, res, next){
	
	timestamp = new Date()
	currentDate = timestamp.toLocaleDateString("en-US").split("/").join("-");
	currentTime = timestamp.toLocaleTimeString("en-US").split("/").join("-");
	currentTime = currentTime.replace(" ","")

	bulk_upload_videos( `${currentDate}_${currentTime}`, 'bulk_videos' )(req, res, async (err) => {
		if(err){

			console.log(err)

		} else {

			let videos = req.files['videos_to_upload']
			let excel_file = req.files['excel_sheet'][0]

			{(async () => {

				if (use_gcp_storage){

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0] )
					
					videos = req.files['videos_to_upload']
					Promise.all(videos.map(async (video_file) => {
						// console.log('video_file')
						// console.log(video_file)

						let video_filename_to_use = video_file.originalname.split(" ").join("-") 
						video_filename_to_use = video_filename_to_use
						video_filename_to_use = video_filename_to_use.charAt(0).toUpperCase() + video_filename_to_use.slice(1)
						video_file.originalname = video_filename_to_use


						await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', video_file )
					}))

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', excel_file )

					console.log('SAVED TO GCP')

				} else if (use_aws_s3_storage) {

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0])

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', excel_file )					
					
					videos = req.files['videos_to_upload']
					Promise.all(videos.map(async (video_file) => {

						let video_filename_to_use = video_file.originalname.split(" ").join("-") 
						video_filename_to_use = video_filename_to_use
						video_filename_to_use = video_filename_to_use.charAt(0).toUpperCase() + video_filename_to_use.slice(1)
						video_file.originalname = video_filename_to_use

						await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', video_file )
					}))
					
					console.log('SAVED TO AWS')

				} else {

					console.log('SAVED TO DISK STORAGE')

				}

			// videos are saved, now dealing with snapshots for each video


				let store_video_at_tmp_promise
				let create_snapshots_promise
				let save_snapshots_promises
				let all_images_db_objects = []

				// let video_path = get_file_path_to_use(req.file, 'bulk_videos', timestamp)

				await Promise.all(videos.map(async (video_file) => {

					let promises = []
					let video_path = get_file_path_to_use_alternate(video_file, 'bulk_videos', `${currentDate}_${currentTime}`)

					if (use_gcp_storage){

						video_for_post = `${ gcp_bucket }/${ video_path }`

					} else if (use_aws_s3_storage){

						// since we will be using cloud front
						video_for_post = `${ video_path }`

					} else {

						video_for_post = get_file_path_to_use_alternate(video_file, 'bulk_videos', `${currentDate}_${currentTime}`)

					}
	
					let video_thumbnail_image_to_use
					let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname ) )
					// file_without_format = file_without_format.split(" ").join("-") // removing spaces so that it doesnt effect video url

					if (use_gcp_storage || use_aws_s3_storage){

						store_video_at_tmp_promise = store_video_at_tmp_and_get_its_path( video_file, video_path )
						promises.push(store_video_at_tmp_promise)

						promise_fulfilled = await Promise.all(promises)

						create_snapshots_promise = await create_snapshots_from_uploaded_video(`${currentDate}_${currentTime}`, video_file, promise_fulfilled[0], total_snapshots_count)

						save_snapshots_promises = await save_generated_snapshots(video_file, `${currentDate}_${currentTime}`, total_snapshots_count)

						await Promise.all(save_snapshots_promises)

						// getting image from cloud
						// video_thumbnail_image_to_use = get_snapshots_fullname_and_path(get_snapshots_storage_path(), file_without_format, timestamp)
						// video_thumbnail_image_to_use = await get_image_to_display(`upload_thumbnails/${get_random_screenshot}`, (use_gcp_storage) ? 'gcp_storage' : 'aws_s3')
						video_thumbnail_image_to_use = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)


						console.log('video_thumbnail_image_to_use')
						console.log(video_thumbnail_image_to_use)


					} else {

						create_snapshots_promise = await create_snapshots_from_uploaded_video(`${currentDate}_${currentTime}`, video_file, video_for_post, total_snapshots_count)
						video_thumbnail_image_to_use = `${get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)}/${file_without_format}-${timestamp}_.png`

					}

					// let video_thumbnail_image_to_use
					// let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname ) )
					// if (use_gcp_storage || use_aws_s3_storage){

					// // getting image from cloud
					// 	// video_thumbnail_image_to_use = get_snapshots_fullname_and_path(get_snapshots_storage_path(), file_without_format, timestamp)
					// 	// video_thumbnail_image_to_use = await get_image_to_display(`upload_thumbnails/${get_random_screenshot}`, (use_gcp_storage) ? 'gcp_storage' : 'aws_s3')
					// 	video_thumbnail_image_to_use = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)


					// 	console.log('video_thumbnail_image_to_use')
					// 	console.log(video_thumbnail_image_to_use)

					// } else {

						// video_thumbnail_image_to_use = `${get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)}/${file_without_format}-${timestamp}_.png`
					// }

					let thumbnails_for_video = {}
					// await Promise.all(videos.map(async (video_file) => {
						const newThumbnailImage = new Image({

							_id: new mongoose.Types.ObjectId(),
							category: 'video_thumbnail',
							image_filepath: video_thumbnail_image_to_use,
							// image_filepath: `${get_filepath_to_save_with_bulk_uploading('bulk_videos', `${currentDate}_${currentTime}`)}${image_file.originalname}`,
							// title: video_file.originalname.replace(" ", ""),
							title: video_file.originalname,
							object_files_hosted_at: get_file_storage_venue(),
							// description: req.body.description,
							// all_tags: req.body.all_tags,
							// timestamp_of_uploading: String( Date.now() ),
							// endpoint: req.body.endpoint, // this will be taken care in db model

						});
						let key_name = video_file.originalname.split(" ").join("-")
						// key_name[0] = key_name[0].toUpperCase()
						key_name = key_name.charAt(0).toUpperCase() + key_name.slice(1)
						// thumbnails_for_video[video_file.originalname.split(" ").join("-")] = newThumbnailImage
						thumbnails_for_video[key_name] = newThumbnailImage
						
						all_images_db_objects.push(thumbnails_for_video)
						thumbnails_for_video = {}
						await newThumbnailImage.save()

					// }))


				}))


				let filepath_in_case_of_disk_storage = get_multer_disk_storage_for_bulk_files_path_only(`${currentDate}_${currentTime}`, 'bulk_videos', excel_file)
				// saving file to /tmp as well since readXlsxFile in sheet_to_class needs filepath
				let excel_filepath = await store_excel_file_at_tmp_and_get_its_path(excel_file, filepath_in_case_of_disk_storage)

				let user_id = ''
			// finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
				User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				.then((user) => {
					if (user){

						user_id = user._id

						let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}/${req.files['excel_sheet'][0].filename}`) 
						sheet_to_class( excel_filepath, user_id, 'bulk_videos',  `${currentDate}_${currentTime}`, {snaphot_key:'image_thumbnail', video_key:'video_filepath'}, all_images_db_objects)
						res.status(200).json({ success: true, msg: 'new videos created'});	


					} else {
						console.log({ success: false, msg: "new videos NOT created, try again" })
						res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
					}
				})
				.catch((error) => {
					console.log(error)
					res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
				})

			})()}

		}
	})
})


router.get('/bulk-delete-videos', passport.authenticate('jwt', { session: false }), isAllowedUploadingVideos, function(req, res, next){
	try{

		bulk_delete_all_videos()
		res.status(200).json({ success: true, msg: "all videos deleted" });

	} catch (err){

		res.status(200).json({ success: false, msg: err });

	}

})

module.exports = router;