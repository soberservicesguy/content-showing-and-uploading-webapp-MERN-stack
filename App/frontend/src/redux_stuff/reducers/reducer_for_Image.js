const initialState = {

	currentImage:{
			category:'dummy',
			image_source:'dummy',
			title:'dummy',
			endpoint:'dummy',
			timestamp_of_uploading:'dummy',
			description:'dummy',
			all_tags:'dummy',
		},

	totalImage: [
			{ category:'dummy1', image_source:'dummy1', title:'dummy1', endpoint:'dummy1', timestamp_of_uploading:'dummy1', description:'dummy1', all_tags:'dummy1',},
			{ category:'dummy2', image_source:'dummy2', title:'dummy2', endpoint:'dummy2', timestamp_of_uploading:'dummy2', description:'dummy2', all_tags:'dummy2',},
			{ category:'dummy3', image_source:'dummy3', title:'dummy3', endpoint:'dummy3', timestamp_of_uploading:'dummy3', description:'dummy3', all_tags:'dummy3',},
			{ category:'dummy4', image_source:'dummy4', title:'dummy4', endpoint:'dummy4', timestamp_of_uploading:'dummy4', description:'dummy4', all_tags:'dummy4',},
			{ category:'dummy5', image_source:'dummy5', title:'dummy5', endpoint:'dummy5', timestamp_of_uploading:'dummy5', description:'dummy5', all_tags:'dummy5',},
			{ category:'dummy6', image_source:'dummy6', title:'dummy6', endpoint:'dummy6', timestamp_of_uploading:'dummy6', description:'dummy6', all_tags:'dummy6',},
			{ category:'dummy7', image_source:'dummy7', title:'dummy7', endpoint:'dummy7', timestamp_of_uploading:'dummy7', description:'dummy7', all_tags:'dummy7',},
			{ category:'dummy8', image_source:'dummy8', title:'dummy8', endpoint:'dummy8', timestamp_of_uploading:'dummy8', description:'dummy8', all_tags:'dummy8',},
			{ category:'dummy9', image_source:'dummy9', title:'dummy9', endpoint:'dummy9', timestamp_of_uploading:'dummy9', description:'dummy9', all_tags:'dummy9',},
			{ category:'dummy10', image_source:'dummy10', title:'dummy10', endpoint:'dummy10', timestamp_of_uploading:'dummy10', description:'dummy10', all_tags:'dummy10',},
		],
	}

const reducerForImage = (state = initialState, action) => {

	switch (action.type) {

		case "SET_CURRENT_IMAGE":

			return {...state, currentImage: action.current_image}
			break;


		case "SET_FETCHED_IMAGE":

			return {...state, totalImage: action.image_list}
			break;

		case "SET_FETCHED_10_MORE_IMAGE":

			return {...state, totalImage: [...state.Image, action.image_list] }
			break;


		case "ADD_COMMENT_TO_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				let new_comment = {}
				if( required_image[ 'comments' ].length > 0 ){

					let last_id = required_image[ 'comments' ][ required_image[ 'comments' ].length - 1 ].id
					new_comment = {id: last_id + 1, ...action.comment_object}

				} else {

					new_comment = {id: 0, ...action.comment_object}
				}

				var newTotalImage = []
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentComments = item[ 'comments' ]
						item[ 'comments' ] = [ ...currentComments, new_comment ]
					}
					newTotalImage.push(item)
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		case "REMOVE_COMMENT_FROM_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				var newTotalImage = []
				var required_comment = {}
				var comment_index = 0
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentComments = item[ 'comments' ]
						
						item[ 'comments' ] = currentComments.splice(action.comment_id, 1)
					}
					newTotalImage.push( item )
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		case "ADD_LIKE_TO_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				let new_like = {}
				if( required_image[ 'likes' ].length > 0 ){

					let last_id = required_image[ 'likes' ][ required_image[ 'likes' ].length - 1 ].id
					new_like = {id: last_id + 1, ...action.like_object}

				} else {

					new_like = {id: 0, ...action.like_object}
				}

				var newTotalImage = []
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentLikes = item[ 'likes' ]
						item[ 'likes' ] = [ ...currentLikes, new_like ]
					}
					newTotalImage.push(item)
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		case "REMOVE_LIKE_FROM_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				var newTotalImage = []
				var required_like = {}
				var like_index = 0
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentLikes = item[ 'likes' ]
						
						item[ 'likes' ] = currentLikes.splice(action.like_id, 1)
					}
					newTotalImage.push( item )
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		case "ADD_USER_TO_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				let new_user = {}
				if( required_image[ 'users' ].length > 0 ){

					let last_id = required_image[ 'users' ][ required_image[ 'users' ].length - 1 ].id
					new_user = {id: last_id + 1, ...action.user_object}

				} else {

					new_user = {id: 0, ...action.user_object}
				}

				var newTotalImage = []
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentUsers = item[ 'users' ]
						item[ 'users' ] = [ ...currentUsers, new_user ]
					}
					newTotalImage.push(item)
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		case "REMOVE_USER_FROM_IMAGE":

			var currentTotalImage = state.totalImage

				var required_image = {}
				var image_index = 0
				currentTotalImage.map((item, index)=>{
					if (item.id === action.image_id){
						required_image = item
						image_index = index
					}
				})
				
				var newTotalImage = []
				var required_user = {}
				var user_index = 0
				currentTotalImage.map((item, index)=>{
					if (index === image_index){
						let currentUsers = item[ 'users' ]
						
						item[ 'users' ] = currentUsers.splice(action.user_id, 1)
					}
					newTotalImage.push( item )
				})

				return {...state, currentTotalImage: newTotalImage}
				break;

		default:

			return state

	}

};

export default reducerForImage;
