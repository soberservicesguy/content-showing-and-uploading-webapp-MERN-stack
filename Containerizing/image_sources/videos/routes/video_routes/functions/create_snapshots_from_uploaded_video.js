const path = require('path')
var ffmpeg = require('fluent-ffmpeg') // for setting thumbnail of video upload using snapshot
const {	get_snapshots_storage_path } = require('../../../config/storage/')

async function create_snapshots_from_uploaded_video(timestamp, video_file, video_file_path, total_snapshots_count){

	// video is uploaded , NOW creating thumbnail from video using snapshot
	// console.log('video_file')
	// console.log(video_file)

	let file_without_format = path.basename( video_file.originalname, path.extname( video_file.originalname	 ) )

	// console.log('file_without_format')
	// console.log(file_without_format)

	// console.log('video_file_path')
	// console.log(video_file_path)

	return new Promise(function(resolve, reject){

		ffmpeg(video_file_path)
		.on('end', async function() {

			console.log('Screenshots taken');

			// let array_from_snapshot_count = new Array(total_snapshots_count)

			// // saving snapshots in gcp store or aws s3 if needed
			// let file_path
			// // if ( use_gcp_storage ){

			// // 	file_path = `${get_snapshots_storage_path()}/${file_without_format}.png`
			// // 	save_file_to_gcp( timestamp, file_path, true )
				
			// if ( use_gcp_storage || use_aws_s3_storage ){

			// 	console.log('ENTERED HERE')

			// 	let promises = []
			// 	let response

			// 	for (let i = 0; i < array_from_snapshot_count.length; i++) {

			// 		file_path = `${get_snapshots_storage_path()}/${file_without_format}-${timestamp}_${i+1}.png`

			// 		if (use_gcp_storage){

			// 			response = await save_file_to_gcp_storage( file_path, `${file_without_format}-${timestamp}_${i+1}.png` ,'thumbnails_for_social_videos' )
			// 			promises.push(response) // not working this way AND TAKING LONGER

			// 		// BETTER APPROACH BUT NOT WORKING AS PROMISES
			// 			// response = save_file_to_gcp_storage( file_path, `${file_without_format}-${timestamp}_${i+1}.png` ,'thumbnails_for_social_videos' )
			// 			// promises.push(response) // not working this way AND TAKING LONGER

			// 		} else if (use_aws_s3_storage){

			// 			response = save_file_to_s3( file_path, `${file_without_format}-${timestamp}_${i+1}.png` ,'thumbnails_for_social_videos' )
			// 			promises.push(response)

			// 		} else {
			// 		}

			// 	}

			// 	Promise.all(promises).then((vals) => {

			// 		console.log(vals)
			// 		console.log('REOVEDEDS')
			// 		resolve()

			// 	})

			// } else {

			// 	console.log('FILE ALREADY AT DISK STORAGE NO NEED TO SAVE ANYWHERE')

			// }

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