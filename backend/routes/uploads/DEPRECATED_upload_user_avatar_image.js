require('../../models/image');
require('../../models/user');
require('../../models/privilige');


const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const Image = mongoose.model('Image');
const Privilege = mongoose.model('Privilege');

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
	// console.log('OUTER LOG')
	// console.log(req.body)

	user_avatar_image_upload(req, res, (err) => {
		if(err){

			console.log(err)

		} else {

			if(req.file == undefined){

				res.status(404).json({ success: false, msg: 'File is undefined!',file: `uploads/${req.file.filename}`})

			} else {

			// here req.body will work
				// console.log('INNER LOG')
				// console.log( req.body.user_name )

			// image is uploaded , now saving image in db
				const newImage = new Image({

					_id: new mongoose.Types.ObjectId(),
					image_source: `../../assets/images/uploads/avatar_image/${filename_used_to_store_image_in_assets}`,
					category: req.body.category,
					// title: req.body.title,
					// description: req.body.description,
					// all_tags: req.body.all_tags,
					timestamp_of_uploading: String( Date.now() ),
					// endpoint: req.body.endpoint, // this will be taken care in db model

				});

				newImage.save(function (err, newImage) {

					if (err){

						res.status(404).json({ success: false, msg: 'couldnt create image database entry'})
						return console.log(err)

					}

				// assign user object then save
					User.findOne({ phone_number: req.body.phone_number })
					.then((user) => {

						if (!user) {

							const saltHash = utils.genPassword(req.body.password);							
							const salt = saltHash.salt;
							const hash = saltHash.hash;

							const newUser = new User({

								_id: new mongoose.Types.ObjectId(),
								user_name: req.body.user_name,
								phone_number: req.body.phone_number,
								user_image: newImage,
								hash: hash,
								salt: salt,

							});

							newUser.save(function (err, newUser) {

								Privilege.findOne({ privilege_name: 'allow_surfing' })
								.then((privilege) => {
									if (!privilege){

										const newPrivilege = new Privilege({

											_id: new mongoose.Types.ObjectId(),
											privilege_name: 'allow_surfing',

										})
										
									// was done for testing
										// const newPrivilege1 = new Privilege({

										// 	_id: new mongoose.Types.ObjectId(),
										// 	privilege_name: 'is_allowed_video_upload',

										// })
										// newPrivilege1.users.push(newUser)
										// newPrivilege1.save()
										// newUser.privileges.push(newPrivilege1)
									
										newPrivilege.users.push(newUser)
										newPrivilege.save()


										newUser.privileges.push(newPrivilege)

										newUser.save()
										console.log(newUser)

									} else if (privilege) {

										const newPrivilege1 = new Privilege({

											_id: new mongoose.Types.ObjectId(),
											privilege_name: 'is_allowed_video_upload',

										})
									// was done for testing
										// newPrivilege1.users.push(newUser)
										// newPrivilege1.save()
										// newUser.privileges.push(newPrivilege1)

										privilege.users.push(newUser)
										privilege.save()
										newUser.privileges.push(privilege)
										newUser.save()

										console.log(newUser)

								
									}
								})
			
								newImage.user = newUser
								newImage.save()
								res.status(200).json({ success: true, msg: 'new user saved' });

							})


						} else {

							res.status(200).json({ success: false, msg: "user already exists, try another" });

						}

					})
					.catch((err) => {

						next(err);

					});

				})

				// used only when testing multer, now not needed since res is used while saving db with uploaded image
				// res.status(200).json({ success: true, msg: 'File Uploaded!',file: `uploads/${req.file.filename}`})

			}
		}
	})

})

module.exports = router