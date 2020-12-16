require('../../models/video');
require('../../models/user');

const mongoose = require('mongoose');
const router = require('express').Router();   

const User = mongoose.model('User');
const Video = mongoose.model('Video');

const passport = require('passport');
const utils = require('../../lib/utils');

const multer = require('multer');
const path = require('path');

var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot

var filename_used_to_store_video_in_assets = ''
var filename_used_to_store_video_in_assets_without_format = ''

// Set The Storage Engine
const video_storage = multer.diskStorage({
	destination: '../assets/videos/uploads/videos/',
	filename: function(req, file, cb){
		// file name pattern fieldname-currentDate-fileformat
		filename_used_to_store_video_in_assets_without_format = file.fieldname + '-' + Date.now()
		filename_used_to_store_video_in_assets = filename_used_to_store_video_in_assets_without_format + path.extname(file.originalname)
		cb(null, filename_used_to_store_video_in_assets)
	}
});

// Init Upload
const video_upload = multer({
	storage: video_storage,
	limits:{fileSize: 10000000}, // 100 mb
	fileFilter: function(req, file, cb){
		checkFileTypeForVideo(file, cb);
	}
}).single('myVideo');

// Check File Type
function checkFileTypeForVideo(file, cb){
	// Allowed ext
	let filetypes = /mp4|mov|avi|flv/;
	// Check ext
	let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	let mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null,true);
	} else {
		cb('Error: mp4, mov, avi, flv Videos Only!');
	}
}

router.post('/protected-video-upload', passport.authenticate('jwt', { session: false }), (req, res, next) => {

	video_upload(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {

			// video is uploaded , NOW creating thumbnail from video using snapshot
 				ffmpeg(`../assets/videos/uploads/videos/${filename_used_to_store_video_in_assets}`)
				.on('end', function() {
					console.log('Screenshots taken');
				})
				.on('error', function(err) {
					console.error(err);
				})
				.on('filenames', function(filenames) {
					console.log('screenshots are ' + filenames.join(', '));
				})
				// screenshots at mentioned times
				// .takeScreenshots({ 
				// 	count: 2, 
				// 	timemarks: [ '00:00:02.000', '6' ], 
				// 	filenames: [
				// 		`${filename_used_to_store_video_in_assets_without_format}1.png`, 
				// 		`${filename_used_to_store_video_in_assets_without_format}2.png`, 
				// 	],
				// 	size: '150x100', 
				// }, '../assets/videos/uploads/upload_thumbnails/')
				// screenshots at % completion ie 20%, 40%, 60%, 80%
				.screenshots({
					// filename: 'name-of-file.png', // if single snapshot is needed
					// timemarks: [ '00:00:02.000', '6' ], 
					// Will take screenshots at 20%, 40%, 60% and 80% of the video
					count: 4,
					filenames: [
						`${filename_used_to_store_video_in_assets_without_format}1.png`, 
						`${filename_used_to_store_video_in_assets_without_format}2.png`, 
						`${filename_used_to_store_video_in_assets_without_format}3.png`, 
						`${filename_used_to_store_video_in_assets_without_format}4.png`,
					],
					size: '150x100', 
					folder: '../assets/videos/uploads/upload_thumbnails/',
				})
			// saving video in DB
				.then(() => {

					const newVideo = new Video({
						_id: new mongoose.Types.ObjectId(),
						category: req.body.category,
						video_filename: filename_used_to_store_video_in_assets,
						title: req.body.title,
						all_tags: req.body.all_tags,
						image_thumbnail: `${filename_used_to_store_video_in_assets_without_format}1.png`,
						description: req.body.description,
						timestamp_of_uploading: String( Date.now() ),
						// endpoint:String, // will be taken care at db model
					})

					newVideo.save(function (err, newVideo) {

						if (err) return console.log(err)
						// assign user object then save

						res.status(404).json({ success: false, msg: 'couldnt create video database entry',file: `uploads/${req.file.filename}`})
					})

					res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})

				})
			}
		}
	})

})


module.exports = router