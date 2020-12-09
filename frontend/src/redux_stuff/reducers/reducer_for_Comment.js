const initialState = {

	currentComment:{
			image_thumbnail:'dummy',
			text:'dummy',
			date_of_publishing:'dummy',
			author_name:'dummy',
			comment_order:'dummy',
		},

	totalComment: [
			{ image_thumbnail:'dummy1', text:'dummy1', date_of_publishing:'dummy1', author_name:'dummy1', comment_order:'dummy1',},
			{ image_thumbnail:'dummy2', text:'dummy2', date_of_publishing:'dummy2', author_name:'dummy2', comment_order:'dummy2',},
			{ image_thumbnail:'dummy3', text:'dummy3', date_of_publishing:'dummy3', author_name:'dummy3', comment_order:'dummy3',},
			{ image_thumbnail:'dummy4', text:'dummy4', date_of_publishing:'dummy4', author_name:'dummy4', comment_order:'dummy4',},
			{ image_thumbnail:'dummy5', text:'dummy5', date_of_publishing:'dummy5', author_name:'dummy5', comment_order:'dummy5',},
			{ image_thumbnail:'dummy6', text:'dummy6', date_of_publishing:'dummy6', author_name:'dummy6', comment_order:'dummy6',},
			{ image_thumbnail:'dummy7', text:'dummy7', date_of_publishing:'dummy7', author_name:'dummy7', comment_order:'dummy7',},
			{ image_thumbnail:'dummy8', text:'dummy8', date_of_publishing:'dummy8', author_name:'dummy8', comment_order:'dummy8',},
			{ image_thumbnail:'dummy9', text:'dummy9', date_of_publishing:'dummy9', author_name:'dummy9', comment_order:'dummy9',},
			{ image_thumbnail:'dummy10', text:'dummy10', date_of_publishing:'dummy10', author_name:'dummy10', comment_order:'dummy10',},
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

		default:

			return state

	}

};

export default reducerForComment;
