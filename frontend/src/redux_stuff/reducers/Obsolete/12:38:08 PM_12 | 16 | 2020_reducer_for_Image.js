const initialState = {

	currentImage:{
		},

	totalImage: [
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
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
