require('../../models/image');
require('../../models/comment');
require('../../models/like');
require('../../models/user');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedUploadingImages } = require('../authMiddleware/isAllowedUploadingImages')

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const multer = require('multer');
const path = require('path')

const fs = require('fs')

// bulk importing script
const sheet_to_class = require('../../excel_to_databases/import_bulkimages')
const bulk_delete_all_images = require('../../excel_to_databases/delete_all_images')

const {
	get_multer_disk_storage_for_bulk_files_path_only,
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
} = require('../../config/storage/')

let timestamp
let currentDate
let currentTime

// var currentDate = ''
// var currentTime = ''

// Set The Storage Engine // NOT NEEDED NOW
// const bulk_images_storage = multer.diskStorage({
// 	// destination: path.join(__dirname , '../../assets/bulk_blogposts/'),
// 	destination:function(req, file, cb){
// 		// let file_path = `./uploads/${type}`;
// 		currentDate = new Date().toLocaleDateString("en-US").split("/").join(" | ");
// 		currentTime = new Date().toLocaleTimeString("en-US").split("/").join(" | ");

// 		if (file.fieldname === "just_images_upload") {


// 			fs.mkdir( path.join(__dirname , `../../assets/bulk_images/${currentDate}_${currentTime}`), { recursive: true }, (err) => {
// 				if (err) throw err;
// 			})

// 			let file_path = path.join(__dirname , `../../assets/bulk_images/${currentDate}_${currentTime}`)
// 			// let file_path = path.join(__dirname , '../../assets/bulk_images/images')
// 			cb(null, file_path)	

// 		} else {

// 			fs.mkdir( path.join(__dirname , `../../assets/bulk_images/${currentDate}_${currentTime}`), { recursive: true }, (err) => {
// 				if (err) throw err;
// 			})
			
// 			let file_path = path.join(__dirname , `../../assets/bulk_images/${currentDate}_${currentTime}`)
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
// 	// let filetypes_for_excelsheet = /xlsx|xls/
// 	let filetypes_for_excelsheet = /[A-Za-z]+/

// 	// Check ext
// 	let extname_for_image = filetypes_for_image.test( path.extname(file.originalname).toLowerCase() );
// 	let extname_for_excelsheet = filetypes_for_excelsheet.test( path.extname(file.originalname).toLowerCase() );

// 	// Check mime
// 	let mimetype_for_image = filetypes_for_image.test( file.mimetype );
// 	let mimetype_for_excelsheet = filetypes_for_excelsheet.test( file.mimetype );

// 	if (file.fieldname === "just_images_upload") { // if uploading resume
		
// 		if (mimetype_for_image && extname_for_image) {
// 			cb(null, true);
// 		} else {
// 			cb('Error: jpeg, jpg, png, gif Images Only!');
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
function bulk_upload_images(timestamp, folder_name){

	return multer({
		storage: get_multer_storage_to_use_for_bulk_files(timestamp, folder_name),
		limits:{fileSize: 200000000}, // 1 mb
		fileFilter: function(req, file, cb){
			checkFileTypeForImagesAndExcelSheet(file, cb);
		}
	}).fields([
		{ name: 'excel_sheet', maxCount: 1 }, 
		{ name: 'just_images_upload', maxCount: 1000 }
	])  // these are the fields that will be dealt
	// .single('just_images_upload'); 
	// .array('photos', 12)

}


// create blogpost with undefined
// USED IN CREATING BLOGPOST
router.post('/bulk-upload-images', passport.authenticate('jwt', { session: false }), isAllowedUploadingImages, function(req, res, next){
	
	// console.log('OUTER LOG')
	// console.log(req.body)

	// timestamp = Date.now()
	timestamp = new Date()
	currentDate = timestamp.toLocaleDateString("en-US").split("/").join(" | ");
	currentTime = timestamp.toLocaleTimeString("en-US").split("/").join(" | ");

	bulk_upload_images( `${currentDate}_${currentTime}`, 'bulk_images' )(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			let images = req.files['just_images_upload']
			let excel_file = req.files['excel_sheet'][0]

			{(async () => {

				if (use_gcp_storage){

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', req.files['excel_sheet'][0] )
					

					images = req.files['just_images_upload']
					Promise.all(images.map(async (image_file) => {
						await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', image_file )
					}))

					await save_file_to_gcp_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', excel_file )

					console.log('SAVED TO GCP')

				} else if (use_aws_s3_storage) {

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', req.files['excel_sheet'][0])

					await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', excel_file )					
					
					images = req.files['just_images_upload']
					Promise.all(images.map(async (image_file) => {
						await save_file_to_aws_s3_for_bulk_files( `${currentDate}_${currentTime}`, 'bulk_images', image_file )
					}))
					
					console.log('SAVED TO AWS')

				} else {

					console.log('SAVED TO DISK STORAGE')

				}


				let filepath_in_case_of_disk_storage = get_multer_disk_storage_for_bulk_files_path_only(`${currentDate}_${currentTime}`, 'bulk_images', excel_file)
				// saving file to /tmp as well since readXlsxFile in sheet_to_class needs filepath
				let excel_filepath = await store_excel_file_at_tmp_and_get_its_path(excel_file, filepath_in_case_of_disk_storage)


				let user_id = ''
			// finding the user who is uploading so that it can be passed to sheet_to_class for assignment on posts
				User.findOne({ phone_number: req.user.user_object.phone_number }) // using req.user from passport js middleware
				.then((user) => {
					if (user){

						user_id = user._id
						sheet_to_class( excel_filepath, user_id, 'bulk_images',  `${currentDate}_${currentTime}`, ['image_filepath'])
						res.status(200).json({ success: true, msg: 'new images created'});	

					} else {
						res.status(200).json({ success: false, msg: "new images NOT created, try again" });
					}
				})
				.catch((error) => {
					res.status(200).json({ success: false, msg: "new images NOT created, try again" });
				})


			})()}

		}
	})
})


router.get('/bulk-delete-images', passport.authenticate('jwt', { session: false }), isAllowedUploadingImages, function(req, res, next){
	try{

		bulk_delete_all_images()
		res.status(200).json({ success: true, msg: "all images deleted" });

	} catch (err){

		res.status(200).json({ success: false, msg: err });

	}

})

module.exports = router;