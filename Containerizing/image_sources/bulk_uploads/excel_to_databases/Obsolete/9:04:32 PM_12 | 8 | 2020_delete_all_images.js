require('./db_settings')
var fs = require('fs');
const mongoose = require('mongoose');

require('../models/image');
require('../models/comment');

const Image = mongoose.model('Image');
const Comment = mongoose.model('Comment');

const {resolve} = require('path')
require('dotenv').config({path: resolve(__dirname,"../.env")})

Image.deleteMany({}, ()=>null)
Comment.deleteMany({}, ()=>null)
