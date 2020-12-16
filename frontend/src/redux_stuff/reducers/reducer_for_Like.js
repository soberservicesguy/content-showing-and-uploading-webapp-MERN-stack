const initialState = {

	currentLike:{
			user_name:'dummy',
			phone_number:'dummy',
			user_image:'dummy',
			hash:'dummy',
			salt:'dummy',
		},

	totalLike: [
			{ user_name:'dummy1', phone_number:'dummy1', user_image:'dummy1', hash:'dummy1', salt:'dummy1',},
			{ user_name:'dummy2', phone_number:'dummy2', user_image:'dummy2', hash:'dummy2', salt:'dummy2',},
			{ user_name:'dummy3', phone_number:'dummy3', user_image:'dummy3', hash:'dummy3', salt:'dummy3',},
			{ user_name:'dummy4', phone_number:'dummy4', user_image:'dummy4', hash:'dummy4', salt:'dummy4',},
			{ user_name:'dummy5', phone_number:'dummy5', user_image:'dummy5', hash:'dummy5', salt:'dummy5',},
			{ user_name:'dummy6', phone_number:'dummy6', user_image:'dummy6', hash:'dummy6', salt:'dummy6',},
			{ user_name:'dummy7', phone_number:'dummy7', user_image:'dummy7', hash:'dummy7', salt:'dummy7',},
			{ user_name:'dummy8', phone_number:'dummy8', user_image:'dummy8', hash:'dummy8', salt:'dummy8',},
			{ user_name:'dummy9', phone_number:'dummy9', user_image:'dummy9', hash:'dummy9', salt:'dummy9',},
			{ user_name:'dummy10', phone_number:'dummy10', user_image:'dummy10', hash:'dummy10', salt:'dummy10',},
		],
	}

const reducerForLike = (state = initialState, action) => {

	switch (action.type) {

		case "SET_CURRENT_LIKE":

			return {...state, currentLike: action.current_like}
			break;


		case "SET_FETCHED_LIKE":

			return {...state, totalLike: action.like_list}
			break;

		case "SET_FETCHED_10_MORE_LIKE":

			return {...state, totalLike: [...state.Like, action.like_list] }
			break;


		case "ADD_COMMENT_TO_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				let new_comment = {}
				if( required_like[ 'comments' ].length > 0 ){

					let last_id = required_like[ 'comments' ][ required_like[ 'comments' ].length - 1 ].id
					new_comment = {id: last_id + 1, ...action.comment_object}

				} else {

					new_comment = {id: 0, ...action.comment_object}
				}

				var newTotalLike = []
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentComments = item[ 'comments' ]
						item[ 'comments' ] = [ ...currentComments, new_comment ]
					}
					newTotalLike.push(item)
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		case "REMOVE_COMMENT_FROM_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				var newTotalLike = []
				var required_comment = {}
				var comment_index = 0
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentComments = item[ 'comments' ]
						
						item[ 'comments' ] = currentComments.splice(action.comment_id, 1)
					}
					newTotalLike.push( item )
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		case "ADD_LIKE_TO_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				let new_like = {}
				if( required_like[ 'likes' ].length > 0 ){

					let last_id = required_like[ 'likes' ][ required_like[ 'likes' ].length - 1 ].id
					new_like = {id: last_id + 1, ...action.like_object}

				} else {

					new_like = {id: 0, ...action.like_object}
				}

				var newTotalLike = []
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentLikes = item[ 'likes' ]
						item[ 'likes' ] = [ ...currentLikes, new_like ]
					}
					newTotalLike.push(item)
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		case "REMOVE_LIKE_FROM_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				var newTotalLike = []
				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentLikes = item[ 'likes' ]
						
						item[ 'likes' ] = currentLikes.splice(action.like_id, 1)
					}
					newTotalLike.push( item )
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		case "ADD_USER_TO_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				let new_user = {}
				if( required_like[ 'users' ].length > 0 ){

					let last_id = required_like[ 'users' ][ required_like[ 'users' ].length - 1 ].id
					new_user = {id: last_id + 1, ...action.user_object}

				} else {

					new_user = {id: 0, ...action.user_object}
				}

				var newTotalLike = []
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentUsers = item[ 'users' ]
						item[ 'users' ] = [ ...currentUsers, new_user ]
					}
					newTotalLike.push(item)
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		case "REMOVE_USER_FROM_LIKE":

			var currentTotalLike = state.totalLike

				var required_like = {}
				var like_index = 0
				currentTotalLike.map((item, index)=>{
					if (item.id === action.like_id){
						required_like = item
						like_index = index
					}
				})
				
				var newTotalLike = []
				var required_user = {}
				var user_index = 0
				currentTotalLike.map((item, index)=>{
					if (index === like_index){
						let currentUsers = item[ 'users' ]
						
						item[ 'users' ] = currentUsers.splice(action.user_id, 1)
					}
					newTotalLike.push( item )
				})

				return {...state, currentTotalLike: newTotalLike}
				break;

		default:

			return state

	}

};

export default reducerForLike;
