require('./db_settings')
var fs = require('fs');
const mongoose = require('mongoose');

require('../models/image');
require('../models/comment');
require('../models/like');
require('../models/user');

const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');
const User = mongoose.model('User');

const {resolve} = require('path')
require('dotenv').config({path: resolve(__dirname,"../.env")})

// Comment.deleteMany({}, ()=>null)
// Like.deleteMany({}, ()=>null)
// User.deleteMany({}, ()=>null)


function bulk_delete_all_images(){
// 
	Image.deleteMany({category:{$ne: 'video_thumbnail'}, category:{$ne: 'blogpost_image'}, category:{$ne: 'user_avatar'}}, ()=>null)
}


module.exports = bulk_delete_all_images