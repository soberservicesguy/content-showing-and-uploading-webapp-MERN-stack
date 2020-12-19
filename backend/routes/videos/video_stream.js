const router = require('express').Router();   
const fs = require('fs')
// const User = mongoose.model('User');
// const mongoose = require('mongoose');

// const passport = require('passport');
// const utils = require('../lib/utils');


router.get('/video', function(req, res) {

	console.log('incoming')
	console.log( req.query.endpoint )

	const path = '/home/arsalan/Work_stuff/Full_stack_apps/REACT_APPS/Final_portfolio/content_app/backend/assets/videos/sample.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range

	if (range) {

		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize-1

		if(start >= fileSize) {

			res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
			return

		}
		
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, head)
		file.pipe(res)

	} else {

		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)

	}
})

module.exports = router;