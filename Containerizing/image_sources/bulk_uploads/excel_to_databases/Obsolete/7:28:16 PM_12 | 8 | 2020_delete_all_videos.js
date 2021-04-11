require('./db_settings')
var fs = require('fs');
const mongoose = require('mongoose');

require('../models/video');
require('../models/comment');

const Video = mongoose.model('Video');
const Comment = mongoose.model('Comment');

const {resolve} = require('path')
require('dotenv').config({path: resolve(__dirname,"../.env")})

Video.deleteMany({}, ()=>null)
Comment.deleteMany({}, ()=>null)
