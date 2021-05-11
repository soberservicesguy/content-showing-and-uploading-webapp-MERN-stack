require("../models/privilige")
const Privilege = require('mongoose').model('Privilege');


async function get_allowed_privileges_list(user_object){

	let privileges_names = [] 

	// console.log('user_object.privileges')
	// console.log(user_object.privileges)

// getting privilege names
	await Promise.all(user_object.privileges.map(async (privilege_id) => {
		let privilege_object = await Privilege.findOne({_id: privilege_id})
		privileges_names.push( privilege_object.privilege_name )
	}))


	let privileges_list = [] 
	privileges_names.map((privilege_name) => {

		if ( privilege_name === 'allow_surfing' ){
	
			privileges_list.push( 'Basic' )

		} else if ( privilege_name === 'is_allowed_image_upload' ){

			privileges_list.push( 'Images control' )

		} else if ( privilege_name === 'is_allowed_video_upload' ){

			privileges_list.push( 'Videos control' )

		} else if ( privilege_name === 'is_allowed_writing_blopost' ){

			privileges_list.push( 'Blogposts control' )

		} else {
		}

	})

// add revoked or privileges that are not given
	// if ( !privileges_list.includes('Basic') ){

	// not needed to revoke basic
		// privileges_list.push('Revoke Basic')
	
	// } 

	if ( !privileges_list.includes('Images control') ){

		privileges_list.push('Revoke Images control')

	} 

	if ( !privileges_list.includes('Videos control') ){

		privileges_list.push('Revoke Videos control')

	} 

	if ( !privileges_list.includes('Blogposts control') ){

		privileges_list.push('Revoke Blogposts control')

	} 

	return privileges_list
}

module.exports = get_allowed_privileges_list