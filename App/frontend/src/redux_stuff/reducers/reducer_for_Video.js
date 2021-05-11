const initialState = {

	currentVideo:{
			// category:'dummy',
			// image_thumbnail:'dummy',
			// video_filename:'dummy',
			// title:'dummy',
			// endpoint:'dummy',
			// description:'dummy',
			// timestamp_of_uploading:'dummy',
			// all_tags:'dummy',
		},

	totalVideo: [
			// { category:'dummy1', image_thumbnail:'dummy1', video_filename:'dummy1', title:'dummy1', endpoint:'dummy1', description:'dummy1', timestamp_of_uploading:'dummy1', all_tags:'dummy1',},
			// { category:'dummy2', image_thumbnail:'dummy2', video_filename:'dummy2', title:'dummy2', endpoint:'dummy2', description:'dummy2', timestamp_of_uploading:'dummy2', all_tags:'dummy2',},
			// { category:'dummy3', image_thumbnail:'dummy3', video_filename:'dummy3', title:'dummy3', endpoint:'dummy3', description:'dummy3', timestamp_of_uploading:'dummy3', all_tags:'dummy3',},
			// { category:'dummy4', image_thumbnail:'dummy4', video_filename:'dummy4', title:'dummy4', endpoint:'dummy4', description:'dummy4', timestamp_of_uploading:'dummy4', all_tags:'dummy4',},
			// { category:'dummy5', image_thumbnail:'dummy5', video_filename:'dummy5', title:'dummy5', endpoint:'dummy5', description:'dummy5', timestamp_of_uploading:'dummy5', all_tags:'dummy5',},
			// { category:'dummy6', image_thumbnail:'dummy6', video_filename:'dummy6', title:'dummy6', endpoint:'dummy6', description:'dummy6', timestamp_of_uploading:'dummy6', all_tags:'dummy6',},
			// { category:'dummy7', image_thumbnail:'dummy7', video_filename:'dummy7', title:'dummy7', endpoint:'dummy7', description:'dummy7', timestamp_of_uploading:'dummy7', all_tags:'dummy7',},
			// { category:'dummy8', image_thumbnail:'dummy8', video_filename:'dummy8', title:'dummy8', endpoint:'dummy8', description:'dummy8', timestamp_of_uploading:'dummy8', all_tags:'dummy8',},
			// { category:'dummy9', image_thumbnail:'dummy9', video_filename:'dummy9', title:'dummy9', endpoint:'dummy9', description:'dummy9', timestamp_of_uploading:'dummy9', all_tags:'dummy9',},
			// { category:'dummy10', image_thumbnail:'dummy10', video_filename:'dummy10', title:'dummy10', endpoint:'dummy10', description:'dummy10', timestamp_of_uploading:'dummy10', all_tags:'dummy10',},
		],
	}

const reducerForVideo = (state = initialState, action) => {

	switch (action.type) {

		case "SET_CURRENT_VIDEO":

			return {...state, currentVideo: action.current_video}
			break;


		case "SET_FETCHED_VIDEO":

			return {...state, totalVideo: action.video_list}
			break;

		case "SET_FETCHED_10_MORE_VIDEO":

			return {...state, totalVideo: [...state.Video, action.video_list] }
			break;


		case "ADD_COMMENT_TO_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				let new_comment = {}
				if( required_video[ 'comments' ].length > 0 ){

					let last_id = required_video[ 'comments' ][ required_video[ 'comments' ].length - 1 ].id
					new_comment = {id: last_id + 1, ...action.comment_object}

				} else {

					new_comment = {id: 0, ...action.comment_object}
				}

				var newTotalVideo = []
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentComments = item[ 'comments' ]
						item[ 'comments' ] = [ ...currentComments, new_comment ]
					}
					newTotalVideo.push(item)
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		case "REMOVE_COMMENT_FROM_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				var newTotalVideo = []
				var required_comment = {}
				var comment_index = 0
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentComments = item[ 'comments' ]
						
						item[ 'comments' ] = currentComments.splice(action.comment_id, 1)
					}
					newTotalVideo.push( item )
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		case "ADD_LIKE_TO_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				let new_like = {}
				if( required_video[ 'likes' ].length > 0 ){

					let last_id = required_video[ 'likes' ][ required_video[ 'likes' ].length - 1 ].id
					new_like = {id: last_id + 1, ...action.like_object}

				} else {

					new_like = {id: 0, ...action.like_object}
				}

				var newTotalVideo = []
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentLikes = item[ 'likes' ]
						item[ 'likes' ] = [ ...currentLikes, new_like ]
					}
					newTotalVideo.push(item)
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		case "REMOVE_LIKE_FROM_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				var newTotalVideo = []
				var required_like = {}
				var like_index = 0
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentLikes = item[ 'likes' ]
						
						item[ 'likes' ] = currentLikes.splice(action.like_id, 1)
					}
					newTotalVideo.push( item )
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		case "ADD_USER_TO_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				let new_user = {}
				if( required_video[ 'users' ].length > 0 ){

					let last_id = required_video[ 'users' ][ required_video[ 'users' ].length - 1 ].id
					new_user = {id: last_id + 1, ...action.user_object}

				} else {

					new_user = {id: 0, ...action.user_object}
				}

				var newTotalVideo = []
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentUsers = item[ 'users' ]
						item[ 'users' ] = [ ...currentUsers, new_user ]
					}
					newTotalVideo.push(item)
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		case "REMOVE_USER_FROM_VIDEO":

			var currentTotalVideo = state.totalVideo

				var required_video = {}
				var video_index = 0
				currentTotalVideo.map((item, index)=>{
					if (item.id === action.video_id){
						required_video = item
						video_index = index
					}
				})
				
				var newTotalVideo = []
				var required_user = {}
				var user_index = 0
				currentTotalVideo.map((item, index)=>{
					if (index === video_index){
						let currentUsers = item[ 'users' ]
						
						item[ 'users' ] = currentUsers.splice(action.user_id, 1)
					}
					newTotalVideo.push( item )
				})

				return {...state, currentTotalVideo: newTotalVideo}
				break;

		default:

			return state

	}

};

export default reducerForVideo;
