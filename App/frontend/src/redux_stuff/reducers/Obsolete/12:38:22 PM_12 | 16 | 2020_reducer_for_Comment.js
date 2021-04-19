const initialState = {

	currentComment:{
			user_name:'dummy',
			phone_number:'dummy',
			user_image:'dummy',
			hash:'dummy',
			salt:'dummy',
		},

	totalComment: [
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

const reducerForComment = (state = initialState, action) => {

	switch (action.type) {

		case "SET_CURRENT_COMMENT":

			return {...state, currentComment: action.current_comment}
			break;


		case "SET_FETCHED_COMMENT":

			return {...state, totalComment: action.comment_list}
			break;

		case "SET_FETCHED_10_MORE_COMMENT":

			return {...state, totalComment: [...state.Comment, action.comment_list] }
			break;


		case "ADD_COMMENT_TO_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				let new_comment = {}
				if( required_comment[ 'comments' ].length > 0 ){

					let last_id = required_comment[ 'comments' ][ required_comment[ 'comments' ].length - 1 ].id
					new_comment = {id: last_id + 1, ...action.comment_object}

				} else {

					new_comment = {id: 0, ...action.comment_object}
				}

				var newTotalComment = []
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentComments = item[ 'comments' ]
						item[ 'comments' ] = [ ...currentComments, new_comment ]
					}
					newTotalComment.push(item)
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		case "REMOVE_COMMENT_FROM_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				var newTotalComment = []
				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentComments = item[ 'comments' ]
						
						item[ 'comments' ] = currentComments.splice(action.comment_id, 1)
					}
					newTotalComment.push( item )
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		case "ADD_LIKE_TO_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				let new_like = {}
				if( required_comment[ 'likes' ].length > 0 ){

					let last_id = required_comment[ 'likes' ][ required_comment[ 'likes' ].length - 1 ].id
					new_like = {id: last_id + 1, ...action.like_object}

				} else {

					new_like = {id: 0, ...action.like_object}
				}

				var newTotalComment = []
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentLikes = item[ 'likes' ]
						item[ 'likes' ] = [ ...currentLikes, new_like ]
					}
					newTotalComment.push(item)
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		case "REMOVE_LIKE_FROM_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				var newTotalComment = []
				var required_like = {}
				var like_index = 0
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentLikes = item[ 'likes' ]
						
						item[ 'likes' ] = currentLikes.splice(action.like_id, 1)
					}
					newTotalComment.push( item )
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		case "ADD_USER_TO_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				let new_user = {}
				if( required_comment[ 'users' ].length > 0 ){

					let last_id = required_comment[ 'users' ][ required_comment[ 'users' ].length - 1 ].id
					new_user = {id: last_id + 1, ...action.user_object}

				} else {

					new_user = {id: 0, ...action.user_object}
				}

				var newTotalComment = []
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentUsers = item[ 'users' ]
						item[ 'users' ] = [ ...currentUsers, new_user ]
					}
					newTotalComment.push(item)
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		case "REMOVE_USER_FROM_COMMENT":

			var currentTotalComment = state.totalComment

				var required_comment = {}
				var comment_index = 0
				currentTotalComment.map((item, index)=>{
					if (item.id === action.comment_id){
						required_comment = item
						comment_index = index
					}
				})
				
				var newTotalComment = []
				var required_user = {}
				var user_index = 0
				currentTotalComment.map((item, index)=>{
					if (index === comment_index){
						let currentUsers = item[ 'users' ]
						
						item[ 'users' ] = currentUsers.splice(action.user_id, 1)
					}
					newTotalComment.push( item )
				})

				return {...state, currentTotalComment: newTotalComment}
				break;

		default:

			return state

	}

};

export default reducerForComment;
