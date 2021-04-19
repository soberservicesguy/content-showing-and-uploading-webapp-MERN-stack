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

Image.deleteMany({}, ()=>null)
Comment.deleteMany({}, ()=>null)
Like.deleteMany({}, ()=>null)
User.deleteMany({}, ()=>null)
