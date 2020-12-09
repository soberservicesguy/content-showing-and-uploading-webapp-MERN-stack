const initialState = {

	currentImage:{
			category:'dummy',
			image_source:'dummy',
			title:'dummy',
			description:'dummy',
			date_of_publishing:'dummy',
			author_name:'dummy',
			total_likes:'dummy',
			total_shares:'dummy',
			endpoint:'dummy',
			all_tags:'dummy',
			uploader_details:'dummy',
		},

	totalImage: [
			{ category:'dummy1', image_source:'dummy1', title:'dummy1', description:'dummy1', date_of_publishing:'dummy1', author_name:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', all_tags:'dummy1', uploader_details:'dummy1',},
			{ category:'dummy2', image_source:'dummy2', title:'dummy2', description:'dummy2', date_of_publishing:'dummy2', author_name:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', all_tags:'dummy2', uploader_details:'dummy2',},
			{ category:'dummy3', image_source:'dummy3', title:'dummy3', description:'dummy3', date_of_publishing:'dummy3', author_name:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', all_tags:'dummy3', uploader_details:'dummy3',},
			{ category:'dummy4', image_source:'dummy4', title:'dummy4', description:'dummy4', date_of_publishing:'dummy4', author_name:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', all_tags:'dummy4', uploader_details:'dummy4',},
			{ category:'dummy5', image_source:'dummy5', title:'dummy5', description:'dummy5', date_of_publishing:'dummy5', author_name:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', all_tags:'dummy5', uploader_details:'dummy5',},
			{ category:'dummy6', image_source:'dummy6', title:'dummy6', description:'dummy6', date_of_publishing:'dummy6', author_name:'dummy6', total_likes:'dummy6', total_shares:'dummy6', endpoint:'dummy6', all_tags:'dummy6', uploader_details:'dummy6',},
			{ category:'dummy7', image_source:'dummy7', title:'dummy7', description:'dummy7', date_of_publishing:'dummy7', author_name:'dummy7', total_likes:'dummy7', total_shares:'dummy7', endpoint:'dummy7', all_tags:'dummy7', uploader_details:'dummy7',},
			{ category:'dummy8', image_source:'dummy8', title:'dummy8', description:'dummy8', date_of_publishing:'dummy8', author_name:'dummy8', total_likes:'dummy8', total_shares:'dummy8', endpoint:'dummy8', all_tags:'dummy8', uploader_details:'dummy8',},
			{ category:'dummy9', image_source:'dummy9', title:'dummy9', description:'dummy9', date_of_publishing:'dummy9', author_name:'dummy9', total_likes:'dummy9', total_shares:'dummy9', endpoint:'dummy9', all_tags:'dummy9', uploader_details:'dummy9',},
			{ category:'dummy10', image_source:'dummy10', title:'dummy10', description:'dummy10', date_of_publishing:'dummy10', author_name:'dummy10', total_likes:'dummy10', total_shares:'dummy10', endpoint:'dummy10', all_tags:'dummy10', uploader_details:'dummy10',},
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

		default:

			return state

	}

};

export default reducerForImage;
