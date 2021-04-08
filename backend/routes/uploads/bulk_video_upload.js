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

// Set The Storage Engine
// const bulk_videos_storage = multer.diskStorage({
// 	// destination: path.join(__dirname , '../../assets/bulk_videos/'),
// 	destination:function(req, file, cb){
// 		// let file_path = `./uploads/${type}`;
// 		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
// 		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");


// 		if (file.fieldname === "videos_to_upload") {

// 			let file_path = path.join(__dirname , '../../assets/bulk_videos/videos')
// 			cb(null, file_path)	

// 		} else {

// 			fs.mkdir( path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}`), { recursive: true }, (err) => {
// 				if (err) throw err;
// 			})
			
// 			let file_path = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}`)
// 			cb(null, file_path)	

// 		}

// 	},
// 	filename: function(req, file, cb){
// 		// file name pattern fieldname-currentDate-fileformat
// 		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
// 		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

// 		filename_used_to_store_image_in_assets = file.originalname
// 		cb(null, file.originalname);

// 	}
// });

// Check File Type
// function checkFileTypeForImageAndExcelSheet(file, cb){

// 	// Allowed ext
// 	let filetypes_for_image = /jpeg|jpg|png|gif/
// 	let filetypes_for_video = /mp4|mov|avi|flv/;
// 	// let filetypes_for_excelsheet = /xlsx|xls/
// 	let filetypes_for_excelsheet = /[A-Za-z]+/

// 	// Check ext
// 	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );
// 	let extname_for_video = filetypes_for_video.test( path.extname(file.originalname).toLowerCase() );
// 	let extname_for_excelsheet = filetypes_for_excelsheet.test( path.extname(file.originalname).toLowerCase() );

// 	// Check mime
// 	let mimetype_for_image = filetypes_for_image.test( file.mimetype );
// 	let mimetype_for_video = filetypes_for_video.test( file.mimetype );
// 	let mimetype_for_excelsheet = filetypes_for_excelsheet.test( file.mimetype );

// 	if (file.fieldname === "videos_to_upload") {

// 		if (mimetype_for_video && extname_for_video) {
// 			cb(null, true);
// 		} else {
// 			cb('Error: mp4, mov, avi, flv videos Only!');
// 		}

// 	} else { // else uploading images

// 		if (mimetype_for_excelsheet && extname_for_excelsheet) {
// 			cb(null, true);
// 		} else {
// 			cb('Error: only .xlsx, .xls for excel files');
// 		}

// 	}

// }

// Init Upload
function bulk_upload_videos(timestamp, folder_name){

	return multer({
		storage: get_multer_storage_to_use_for_bulk_files(timestamp, folder_name),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForVideosAndExcelSheet(file, cb);
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
	
	// console.log('OUTER LOG')
	// console.log(req.body)

	// timestamp = Date.now()
	timestamp = new Date()
	currentDate = timestamp.toLocaleDateString("en-US").split("/").join(" | ");
	currentTime = timestamp.toLocaleTimeString("en-US").split("/").join(" | ");

	bulk_upload_videos( `${currentDate}_${currentTime}`, 'bulk_videos' )(req, res, async (err) => {
		if(err){

			console.log(err)

		} else {

			let videos
			let excel_file = req.files['excel_sheet'][0]

			{(async () => {

				if (use_gcp_storage){

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0] )
					
					videos = req.files['videos_to_upload']
					Promise.all(videos.map(async (video_file) => {
						await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', video_file )
					}))

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', excel_file )

					console.log('SAVED TO GCP')

				} else if (use_aws_s3_storage) {

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', req.files['excel_sheet'][0])

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_videos', excel_file )					
					
					videos = req.files['videos_to_upload']
					Promise.all(videos.map(async (video_file) => {
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
	

					if (use_gcp_storage || use_aws_s3_storage){

						store_video_at_tmp_promise = store_video_at_tmp_and_get_its_path( video_file, video_path )
						promises.push(store_video_at_tmp_promise)

						promise_fulfilled = await Promise.all(promises)

						create_snapshots_promise = await create_snapshots_from_uploaded_video(`${currentDate}_${currentTime}`, video_file, promise_fulfilled[0], total_snapshots_count)

						save_snapshots_promises = await save_generated_snapshots(video_file, `${currentDate}_${currentTime}`, total_snapshots_count)

						await Promise.all(save_snapshots_promises)

					} else {

						create_snapshots_promise = await create_snapshots_from_uploaded_video(`${currentDate}_${currentTime}`, video_file, video_for_post, total_snapshots_count)

					}

					let video_thumbnail_image_to_use
					let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname ) )
					if (use_gcp_storage || use_aws_s3_storage){

					// getting image from cloud
						// video_thumbnail_image_to_use = get_snapshots_fullname_and_path(get_snapshots_storage_path(), file_without_format, timestamp)
						// video_thumbnail_image_to_use = await get_image_to_display(`upload_thumbnails/${get_random_screenshot}`, (use_gcp_storage) ? 'gcp_storage' : 'aws_s3')
						video_thumbnail_image_to_use = get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)

						// console.log('video_thumbnail_image_to_use')
						// console.log(video_thumbnail_image_to_use)
					} else {

						video_thumbnail_image_to_use = `${get_snapshots_fullname_and_path('upload_thumbnails', file_without_format, `${currentDate}_${currentTime}`)}/${file_without_format}-${timestamp}_.png`

						console.log('CHECK THIS')
						console.log(video_thumbnail_image_to_use)
					}

					let all_images_db_objects = []
					await Promise.all(videos.map(async (video_file) => {

						const newThumbnailImage = new Image({

							_id: new mongoose.Types.ObjectId(),
							category: 'video_thumbnail',
							image_filepath: video_thumbnail_image_to_use,
							// image_filepath: `${get_filepath_to_save_with_bulk_uploading('bulk_videos', `${currentDate}_${currentTime}`)}${image_file.originalname}`,
							title: video_file.originalname,
							object_files_hosted_at: get_file_storage_venue(),
							// description: req.body.description,
							// all_tags: req.body.all_tags,
							// timestamp_of_uploading: String( Date.now() ),
							// endpoint: req.body.endpoint, // this will be taken care in db model

						});

						all_images_db_objects.push(newThumbnailImage)
						await newThumbnailImage.save()

					}))

					console.log('CAME OUT OF HELL')

				}))


				let filepath_in_case_of_disk_storage = get_multer_disk_storage_for_bulk_files(`${currentDate}_${currentTime}`, 'bulk_videos')
				// saving file to /tmp as well since readXlsxFile in sheet_to_class needs filepath
				let excel_filepath = await store_excel_file_at_tmp_and_get_its_path(excel_file, filepath_in_case_of_disk_storage)

				let user_id = ''
			// finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
				User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				.then((user) => {
					if (user){

						user_id = user._id

						let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}/${req.files['excel_sheet'][0].filename}`) 
						console.log('ABOUT TO IMPORT DATA')
						sheet_to_class( excel_filepath, user_id, 'bulk_videos',  `${currentDate}_${currentTime}`, ['image_thumbnail'], all_images_db_objects)
						// res.status(200).json({ success: true, msg: 'new videos created'});	

						// sheet_to_class( uploaded_excel_sheet, user_id )
						// res.status(200).json({ success: true, msg: 'new videos created'});	

					} else {
						console.log({ success: false, msg: "new videos NOT created, try again" })
						res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
					}
				})
				.catch((error) => {
					console.log('SOME ERROR CAUGHT')
					console.log(error)
					res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
				})














//  COMMENTED OUT // //  COMMENTED OUT // //  COMMENTED OUT // 
//  COMMENTED OUT // //  COMMENTED OUT // //  COMMENTED OUT // 
//  COMMENTED OUT // //  COMMENTED OUT // //  COMMENTED OUT // 
				// var uploaded_videos = req.files['videos_to_upload']

				// let create_all_snapshot = await Promise.all(uploaded_videos.map((uploaded_video) => {
				// 	if(uploaded_video == undefined){

				// 		res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${uploaded_video.filename}`})

				// 	} else {
				// 		console.log('FILE NAME IS BELOW')
				// 		console.log( path.extname(uploaded_video.filename) )
				// 		var video_id = ''
				// 	// video is uploaded , NOW creating thumbnail from video using snapshot
		 	// 			ffmpeg(`./assets/bulk_videos/videos/${uploaded_video.filename}`)
				// 		// screenshots at mentioned times
				// 		// .takeScreenshots({ 
				// 		// 	count: 2, 
				// 		// 	timemarks: [ '00:00:02.000', '6' ], 
				// 		// 	filenames: [
				// 		// 		`${filename_used_to_store_video_in_assets_without_format}1.png`, 
				// 		// 		`${filename_used_to_store_video_in_assets_without_format}2.png`, 
				// 		// 	],
				// 		// 	size: '150x100', 
				// 		// }, '../assets/videos/uploads/upload_thumbnails/')
				// 		// screenshots at % completion ie 20%, 40%, 60%, 80%
				// 		.screenshots({
				// 			// filename: 'name-of-file.png', // if single snapshot is needed
				// 			// timemarks: [ '00:00:02.000', '6' ], 
				// 			// Will take screenshots at 20%, 40%, 60% and 80% of the video
				// 			filename:`${uploaded_video.filename.replace( path.extname(uploaded_video.filename), "")}.png`,
				// 			// filenames: [
				// 			// 	`${uploaded_video.filename}1.png`, 
				// 			// 	`${uploaded_video.filename}2.png`, 
				// 			// 	`${uploaded_video.filename}3.png`, 
				// 			// 	`${uploaded_video.filename}4.png`,
				// 			// ],
				// 			count: 4,
				// 			size: '150x100', 
				// 			folder: './assets/bulk_videos/thumbnails_images/',
				// 		})
				// 		.on('end', function() {
				// 			console.log('Screenshots taken');
				// 		})
				// 		.on('error', function(err) {
				// 			console.error(err);
				// 		})
				// 		.on('filenames', function(filenames) {
				// 			console.log('screenshots are ' + filenames.join(', '));
				// 		})

					// // saving video in DB
					// 	video_id = new mongoose.Types.ObjectId()
					// 	const newVideo = new Video({
					// 		_id: video_id,
					// 		image_thumbnail: `${filename_used_to_store_video_in_assets_without_format}1.png`,
					// 		timestamp_of_uploading: String( Date.now() ),
					// 		video_filepath: `./assets/videos/uploads/bulk_videos/${filename_used_to_store_video_in_assets}`,
					// 		category: req.body.category,
					// 		title: req.body.title,
					// 		all_tags: req.body.all_tags,
					// 		description: req.body.description,
					// 		// endpoint:String, // will be taken care at db model
					// 	})

					// 	newVideo.save(function (err, newVideo) {

					// 		if (err){
					// 			res.status(404).json({ success: false, msg: 'couldnt create video database entry'})
					// 			return console.log(err)
					// 		}

					// 		// assign user object then save
					// 		User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
					// 		.then((user) => {
					// 			if (user){

					// 				newVideo.user = user
					// 				newVideo.save()
					// 			// finding video saved to access its endpoint since its created at model level
									
					// 			} else {

					// 				res.status(200).json({ success: false, msg: "user doesnt exists, try logging in again" });

					// 			}
					// 		})
					// 		.then(() => {

					// 			Video.findOne({ _id: video_id })
					// 			.then((saved_video) => {
					// 				res.status(200).json({ success: true, msg: 'new user saved', video_endpoint: saved_video.endpoint});	

					// 			})

					// 		})
					// 		.catch((err) => {

					// 			next(err);

					// 		})

					// 		// not needed, used for multer
					// 		// res.status(200).json({ success: false, msg: 'couldnt create video database entry',file: `uploads/${req.file.filename}`})
					// 	})

					// }

				// }))
				// .then(() => {

				// 	let user_id = ''
				// // finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
				// 	User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				// 	.then((user) => {
				// 		if (user){

				// 			user_id = user._id

				// 			let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}/${req.files['excel_sheet'][0].filename}`) 
				// 			sheet_to_class( uploaded_excel_sheet, user_id )
				// 			res.status(200).json({ success: true, msg: 'new videos created'});	

				// 		} else {
				// 			res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
				// 		}
				// 	})
				// 	.catch((error) => {
				// 		res.status(200).json({ success: false, msg: "new videos NOT created, try again" });
				// 	})

				// })

				// give excel file name and run bulk import function
				// req.files['excel_sheet'][0] // pull data from it and create blogposts
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