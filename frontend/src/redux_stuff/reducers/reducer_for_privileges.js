const initialState = {

	isAllowedBasic:false,
	isAllowedImagesControl:false,
	isAllowedVideosControl:false,
	isAllowedBlogpostsControl:false,

}

const reducerForPrivileges = (state = initialState, action) => {

	switch (action.type) {

		case "ALLOW_BASIC":

			return {...state, isAllowedBasic: true}
			break;

		case "ALLOW_IMAGES_CONTROL":

			return {...state, isAllowedImagesControl: true}
			break;

		case "ALLOW_VIDEOS_CONTROL":

			return {...state, isAllowedVideosControl: true}
			break;

		case "ALLOW_BLOGPOSTS_CONTROL":

			return {...state, isAllowedBlogpostsControl: true}
			break;

		case "REVOKE_BASIC":

			return {...state, isAllowedBasic: false}
			break;

		case "REVOKE_IMAGES_CONTROL":

			return {...state, isAllowedImagesControl: false}
			break;

		case "REVOKE_VIDEOS_CONTROL":

			return {...state, isAllowedVideosControl: false}
			break;

		case "REVOKE_BLOGPOSTS_CONTROL":

			return {...state, isAllowedBlogpostsControl: false}
			break;

		default:

			return state

	}

};

export default reducerForPrivileges;
