require('../../models/image');
require('../../models/user');

const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const Image = mongoose.model('Image');

const passport = require('passport');
const utils = require('../../lib/utils');

const multer = require('multer');
const path = require('path');

var filename_used_to_store_image_in_assets = ''
var filename_used_to_store_image_in_assets_without_format = ''

// Set The Storage Engine
const image_storage = multer.diskStorage({
	destination: path.join(__dirname , '../../assets/images/uploads/avatar_image'),
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		filename_used_to_store_image_in_assets_without_format = file.fieldname + '-' + Date.now()
		filename_used_to_store_image_in_assets = filename_used_to_store_image_in_assets_without_format + path.extname(file.originalname)

		cb(null, filename_used_to_store_image_in_assets);

	}
});

// Init Upload
const user_avatar_image_upload = multer({
	storage: image_storage,
	limits:{fileSize: 2000000}, // 1 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForUserAvatar(file, cb);
	}
}).single('avatar_image'); // this is the field that will be dealt

// Check File Type
function checkFileTypeForUserAvatar(file, cb){
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

// router.post('/protected-avatar-image-upload', passport.authenticate('jwt', { session: false }), (req, res, next) => {
router.post('/avatar-image-upload', (req, res, next) => {

//	here there will be no req.body due to multer 
	console.log('OUTER LOG')
	console.log(req.body)

	user_avatar_image_upload(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {
				console.log('INNER LOG')
				console.log( req.body.user_name )

			// image is uploaded , now saving image in db
				const newImage = new Image({

					_id: new mongoose.Types.ObjectId(),
					image_source: `../../assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
					category: req.body.category,
					title: req.body.title,
					description: req.body.description,
					all_tags: req.body.all_tags,
					timestamp_of_uploading: String( Date.now() ),
					// endpoint: req.body.endpoint, // this will be taken care in db model

				});

				newImage.save(function (err, newImage) {

					if (err){
						res.status(404).json({ success: false, msg: 'couldnt create image database entry'})
						return console.log(err)
					}
					// assign user object then save


				})


				res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})
			}
		}
	})

})

module.exports = router