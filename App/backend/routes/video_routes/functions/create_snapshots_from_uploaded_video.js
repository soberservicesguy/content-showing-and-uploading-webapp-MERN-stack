const path = require('path')
var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot
const {	get_snapshots_storage_path } = require('../../../config/storage/')

async function create_snapshots_from_uploaded_video(timestamp, video_file, video_file_path, total_snapshots_count){

	let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname	 ) )

	return new Promise(function(resolve, reject){

		ffmpeg(video_file_path)
		.on('end', async function() {

			console.log('Screenshots taken');

			resolve()

		})
		.on('error', function(err) {
			console.error(err);
			reject()
		})
		.on('filenames', function(filenames) {
			console.log('screenshots are ' + filenames.join(', '));
		})
		.screenshots({
			filename: `${file_without_format}-${timestamp}.png`, // if single snapshot is needed
			size: '150x100', 
			count: total_snapshots_count,

			// folder unless is local machine, should be tmp of google compute / aws amplify since aws s3 / gcp storage they don't allow to save at their tmp
			// folder: './assets/videos/uploads/upload_thumbnails/',
			folder: get_snapshots_storage_path(), 
		})

	})

}

module.exports = create_snapshots_from_uploaded_video