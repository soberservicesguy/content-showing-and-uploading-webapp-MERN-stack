const path = require('path')

function select_random_screenshot(filename, total_snapshots_count){

	let index = Math.floor( Math.random() * Number(total_snapshots_count) )
	let filename_to_use_without_format = path.basename( filename, path.extname( filename ) ) // + path.extname( filename )
	
	// filename is like snapshot_.png , just entering random number 
	return `${filename_to_use_without_format}${index+1}${path.extname( filename )}`

}

module.exports = select_random_screenshot
