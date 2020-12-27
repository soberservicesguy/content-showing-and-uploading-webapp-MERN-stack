require('../../models/video');
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
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const multer = require('multer');
const path = require('path')

const fs = require('fs')

// bulk importing script
const sheet_to_class = require('../../excel_to_databases/import_bulkvideos')
const bulk_delete_all_videos = require('../../excel_to_databases/delete_all_videos')

var currentDate = ''
var currentTime = ''

// Set The Storage Engine
const bulk_videos_storage = multer.diskStorage({
	// destination: path.join(__dirname , '../../assets/bulk_videos/'),
	destination:function(req, file, cb){
		// let file_path = `./uploads/${type}`;
		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

		if (file.fieldname === "image_thumbnails") {

			let file_path = path.join(__dirname , '../../assets/bulk_videos/thumbnails_images')
			cb(null, file_path)	

		} else if (file.fieldname === "videos_to_upload") {

			let file_path = path.join(__dirname , '../../assets/bulk_videos/videos')
			cb(null, file_path)	

		} else {

			fs.mkdir( path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}`), { recursive: true }, (err) => {
				if (err) throw err;
			})
			
			let file_path = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}`)
			cb(null, file_path)	

		}

	},
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		// filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		// filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		filename_used_to_store_image_in_assets = file.originalname
		cb(null, file.originalname);

	}
});

// Check File Type
function checkFileTypeForImageAndExcelSheet(file, cb){

	// Allowed ext
	let filetypes_for_image = /jpeg|jpg|png|gif/
	let filetypes_for_video = /mp4|mov|avi|flv/;
	// let filetypes_for_excelsheet = /xlsx|xls/
	let filetypes_for_excelsheet = /[A-Za-z]+/

	// Check ext
	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );
	let extname_for_video = filetypes_for_video.test( path.extname(file.originalname).toLowerCase() );
	let extname_for_excelsheet = filetypes_for_excelsheet.test( path.extname(file.originalname).toLowerCase() );

	// Check mime
	let mimetype_for_image = filetypes_for_image.test( file.mimetype );
	let mimetype_for_video = filetypes_for_video.test( file.mimetype );
	let mimetype_for_excelsheet = filetypes_for_excelsheet.test( file.mimetype );

	if (file.fieldname === "image_thumbnails") { // if uploading resume
		
		if (mimetype_for_image && extname_for_image) {
			cb(null, true);
		} else {
			cb('Error: jpeg, jpg, png, gif Images Only!');
		}

	} else if (file.fieldname === "videos_to_upload") {

		if (mimetype_for_video && extname_for_video) {
			cb(null, true);
		} else {
			cb('Error: mp4, mov, avi, flv videos Only!');
		}

	} else { // else uploading images

		if (mimetype_for_excelsheet && extname_for_excelsheet) {
			cb(null, true);
		} else {
			cb('Error: only .xlsx, .xls for excel files');
		}

	}

}

// Init Upload
const bulk_upload_videos = multer({
	storage: bulk_videos_storage,
	limits:{fileSize: 200000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForImageAndExcelSheet(file, cb);
	}
}).fields([
	{ name: 'excel_sheet_for_blogpost', maxCount: 1 }, 
	{ name: 'image_thumbnails', maxCount: 1000 }, 
	{ name: 'videos_to_upload', maxCount: 1000 }
])  // these are the fields that will be dealt
// .single('image_thumbnails'); 
// .array('photos', 12)


// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/bulk-upload-videos', function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)

	bulk_upload_videos(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			// give excel file name and run bulk import function
			// req.files['excel_sheet_for_blogpost'][0] // pull data from it and create blogposts
			try {
				// console.log( req.files['excel_sheet_for_blogpost'][0] )
				// give path
				let uploaded_excel_sheet = path.join(__dirname , `../../assets/bulk_videos/${currentDate}_${currentTime}/${req.files['excel_sheet_for_blogpost'][0].filename}`) 
				sheet_to_class( uploaded_excel_sheet )
				res.status(200).json({ success: true, msg: 'new videos created'});	

			} catch (error){

				res.status(200).json({ success: false, msg: "new videos NOT created, try again" });

			}

		}
	})
})


router.get('/bulk-delete-videos', function(req, res, next){
	try{

		bulk_delete_all_videos()
		res.status(200).json({ success: true, msg: "all videos deleted" });

	} catch (err){

		res.status(200).json({ success: false, msg: err });

	}

})

module.exports = router;