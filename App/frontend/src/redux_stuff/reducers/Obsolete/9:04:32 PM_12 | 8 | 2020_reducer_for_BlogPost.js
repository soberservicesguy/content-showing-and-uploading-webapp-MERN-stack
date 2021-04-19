const initialState = {

	currentBlogPost:{
			category:'dummy',
			image_main:'dummy',
			title:'dummy',
			date_of_publishing:'dummy',
			author_name:'dummy',
			first_para:'dummy',
			total_likes:'dummy',
			total_shares:'dummy',
			endpoint:'dummy',
			initial_tags:'dummy',
			second_para:'dummy',
			qouted_para:'dummy',
			third_para:'dummy',
			fourth_para:'dummy',
			all_tags:'dummy',
			author_details:'dummy',
		},

	totalBlogPost: [
			{ category:'dummy1', image_main:'dummy1', title:'dummy1', date_of_publishing:'dummy1', author_name:'dummy1', first_para:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', initial_tags:'dummy1', second_para:'dummy1', qouted_para:'dummy1', third_para:'dummy1', fourth_para:'dummy1', all_tags:'dummy1', author_details:'dummy1',},
			{ category:'dummy2', image_main:'dummy2', title:'dummy2', date_of_publishing:'dummy2', author_name:'dummy2', first_para:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', initial_tags:'dummy2', second_para:'dummy2', qouted_para:'dummy2', third_para:'dummy2', fourth_para:'dummy2', all_tags:'dummy2', author_details:'dummy2',},
			{ category:'dummy3', image_main:'dummy3', title:'dummy3', date_of_publishing:'dummy3', author_name:'dummy3', first_para:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', initial_tags:'dummy3', second_para:'dummy3', qouted_para:'dummy3', third_para:'dummy3', fourth_para:'dummy3', all_tags:'dummy3', author_details:'dummy3',},
			{ category:'dummy4', image_main:'dummy4', title:'dummy4', date_of_publishing:'dummy4', author_name:'dummy4', first_para:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', initial_tags:'dummy4', second_para:'dummy4', qouted_para:'dummy4', third_para:'dummy4', fourth_para:'dummy4', all_tags:'dummy4', author_details:'dummy4',},
			{ category:'dummy5', image_main:'dummy5', title:'dummy5', date_of_publishing:'dummy5', author_name:'dummy5', first_para:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', initial_tags:'dummy5', second_para:'dummy5', qouted_para:'dummy5', third_para:'dummy5', fourth_para:'dummy5', all_tags:'dummy5', author_details:'dummy5',},
			{ category:'dummy6', image_main:'dummy6', title:'dummy6', date_of_publishing:'dummy6', author_name:'dummy6', first_para:'dummy6', total_likes:'dummy6', total_shares:'dummy6', endpoint:'dummy6', initial_tags:'dummy6', second_para:'dummy6', qouted_para:'dummy6', third_para:'dummy6', fourth_para:'dummy6', all_tags:'dummy6', author_details:'dummy6',},
			{ category:'dummy7', image_main:'dummy7', title:'dummy7', date_of_publishing:'dummy7', author_name:'dummy7', first_para:'dummy7', total_likes:'dummy7', total_shares:'dummy7', endpoint:'dummy7', initial_tags:'dummy7', second_para:'dummy7', qouted_para:'dummy7', third_para:'dummy7', fourth_para:'dummy7', all_tags:'dummy7', author_details:'dummy7',},
			{ category:'dummy8', image_main:'dummy8', title:'dummy8', date_of_publishing:'dummy8', author_name:'dummy8', first_para:'dummy8', total_likes:'dummy8', total_shares:'dummy8', endpoint:'dummy8', initial_tags:'dummy8', second_para:'dummy8', qouted_para:'dummy8', third_para:'dummy8', fourth_para:'dummy8', all_tags:'dummy8', author_details:'dummy8',},
			{ category:'dummy9', image_main:'dummy9', title:'dummy9', date_of_publishing:'dummy9', author_name:'dummy9', first_para:'dummy9', total_likes:'dummy9', total_shares:'dummy9', endpoint:'dummy9', initial_tags:'dummy9', second_para:'dummy9', qouted_para:'dummy9', third_para:'dummy9', fourth_para:'dummy9', all_tags:'dummy9', author_details:'dummy9',},
			{ category:'dummy10', image_main:'dummy10', title:'dummy10', date_of_publishing:'dummy10', author_name:'dummy10', first_para:'dummy10', total_likes:'dummy10', total_shares:'dummy10', endpoint:'dummy10', initial_tags:'dummy10', second_para:'dummy10', qouted_para:'dummy10', third_para:'dummy10', fourth_para:'dummy10', all_tags:'dummy10', author_details:'dummy10',},
		],
	}

const reducerForBlogPost = (state = initialState, action) => {

	switch (action.type) {

		case "SET_CURRENT_BLOGPOST":

			return {...state, currentBlogPost: action.current_blogpost}
			break;


		case "SET_FETCHED_BLOGPOST":

			return {...state, totalBlogPost: action.blogpost_list}
			break;

		case "SET_FETCHED_10_MORE_BLOGPOST":

			return {...state, totalBlogPost: [...state.BlogPost, action.blogpost_list] }
			break;


		case "ADD_COMMENT_TO_BLOGPOST":

			var currentTotalBlogPost = state.totalBlogPost

				var required_blogpost = {}
				var blogpost_index = 0
				currentTotalBlogPost.map((item, index)=>{
					if (item.id === action.blogpost_id){
						required_blogpost = item
						blogpost_index = index
					}
				})
				
				let new_comment = {}
				if( required_blogpost[ 'comments' ].length > 0 ){

					let last_id = required_blogpost[ 'comments' ][ required_blogpost[ 'comments' ].length - 1 ].id
					new_comment = {id: last_id + 1, ...action.comment_object}

				} else {

					new_comment = {id: 0, ...action.comment_object}
				}

				var newTotalBlogPost = []
				currentTotalBlogPost.map((item, index)=>{
					if (index === blogpost_index){
						let currentComments = item[ 'comments' ]
						item[ 'comments' ] = [ ...currentComments, new_comment ]
					}
					newTotalBlogPost.push(item)
				})

				return {...state, currentTotalBlogPost: newTotalBlogPost}
				break;

		case "REMOVE_COMMENT_FROM_BLOGPOST":

			var currentTotalBlogPost = state.totalBlogPost

				var required_blogpost = {}
				var blogpost_index = 0
				currentTotalBlogPost.map((item, index)=>{
					if (item.id === action.blogpost_id){
						required_blogpost = item
						blogpost_index = index
					}
				})
				
				var newTotalBlogPost = []
				var required_comment = {}
				var comment_index = 0
				currentTotalBlogPost.map((item, index)=>{
					if (index === blogpost_index){
						let currentComments = item[ 'comments' ]
						
						item[ 'comments' ] = currentComments.splice(action.comment_id, 1)
					}
					newTotalBlogPost.push( item )
				})

				return {...state, currentTotalBlogPost: newTotalBlogPost}
				break;

		default:

			return state

	}

};

export default reducerForBlogPost;
