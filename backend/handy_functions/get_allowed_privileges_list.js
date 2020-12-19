function get_allowed_privileges_list(user_object){

	let privileges_list = [] 
	user_object.privileges.map((privilege_object) => {

		if ( privilege_object.privilege_name === 'allow_surfing' ){
	
			privileges_list.push( 'Basic' )

		} else if ( privilege_object.privilege_name === 'is_allowed_image_upload' ){

			privileges_list.push( 'Images control' )

		} else if ( privilege_object.privilege_name === 'is_allowed_video_upload' ){

			privileges_list.push( 'Videos control' )

		} else if ( privilege_object.privilege_name === 'is_allowed_writing_blopost' ){

			privileges_list.push( 'Blogposts control' )

		} else {
		}

	})

// add revoked or privileges that are not given
	if ( !privileges_list.includes('Basic') ){

	// not needed to revoke basic
		// privileges_list.push('Revoke Basic')
	
	} 

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