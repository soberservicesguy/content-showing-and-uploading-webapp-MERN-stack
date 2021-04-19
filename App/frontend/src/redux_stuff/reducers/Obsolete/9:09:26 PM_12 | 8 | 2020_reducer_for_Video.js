const initialState = {

	currentVideo:{
			category:'dummy',
			image_main:'dummy',
			title:'dummy',
			description:'dummy',
			date_of_publishing:'dummy',
			author_name:'dummy',
			first_para:'dummy',
			total_likes:'dummy',
			total_shares:'dummy',
			endpoint:'dummy',
			initial_tags:'dummy',
			video_path:'dummy',
			video_format:'dummy',
			all_tags:'dummy',
			uploader_details:'dummy',
		},

	totalVideo: [
			{ category:'dummy1', image_main:'dummy1', title:'dummy1', description:'dummy1', date_of_publishing:'dummy1', author_name:'dummy1', first_para:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', initial_tags:'dummy1', video_path:'dummy1', video_format:'dummy1', all_tags:'dummy1', uploader_details:'dummy1',},
			{ category:'dummy2', image_main:'dummy2', title:'dummy2', description:'dummy2', date_of_publishing:'dummy2', author_name:'dummy2', first_para:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', initial_tags:'dummy2', video_path:'dummy2', video_format:'dummy2', all_tags:'dummy2', uploader_details:'dummy2',},
			{ category:'dummy3', image_main:'dummy3', title:'dummy3', description:'dummy3', date_of_publishing:'dummy3', author_name:'dummy3', first_para:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', initial_tags:'dummy3', video_path:'dummy3', video_format:'dummy3', all_tags:'dummy3', uploader_details:'dummy3',},
			{ category:'dummy4', image_main:'dummy4', title:'dummy4', description:'dummy4', date_of_publishing:'dummy4', author_name:'dummy4', first_para:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', initial_tags:'dummy4', video_path:'dummy4', video_format:'dummy4', all_tags:'dummy4', uploader_details:'dummy4',},
			{ category:'dummy5', image_main:'dummy5', title:'dummy5', description:'dummy5', date_of_publishing:'dummy5', author_name:'dummy5', first_para:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', initial_tags:'dummy5', video_path:'dummy5', video_format:'dummy5', all_tags:'dummy5', uploader_details:'dummy5',},
			{ category:'dummy6', image_main:'dummy6', title:'dummy6', description:'dummy6', date_of_publishing:'dummy6', author_name:'dummy6', first_para:'dummy6', total_likes:'dummy6', total_shares:'dummy6', endpoint:'dummy6', initial_tags:'dummy6', video_path:'dummy6', video_format:'dummy6', all_tags:'dummy6', uploader_details:'dummy6',},
			{ category:'dummy7', image_main:'dummy7', title:'dummy7', description:'dummy7', date_of_publishing:'dummy7', author_name:'dummy7', first_para:'dummy7', total_likes:'dummy7', total_shares:'dummy7', endpoint:'dummy7', initial_tags:'dummy7', video_path:'dummy7', video_format:'dummy7', all_tags:'dummy7', uploader_details:'dummy7',},
			{ category:'dummy8', image_main:'dummy8', title:'dummy8', description:'dummy8', date_of_publishing:'dummy8', author_name:'dummy8', first_para:'dummy8', total_likes:'dummy8', total_shares:'dummy8', endpoint:'dummy8', initial_tags:'dummy8', video_path:'dummy8', video_format:'dummy8', all_tags:'dummy8', uploader_details:'dummy8',},
			{ category:'dummy9', image_main:'dummy9', title:'dummy9', description:'dummy9', date_of_publishing:'dummy9', author_name:'dummy9', first_para:'dummy9', total_likes:'dummy9', total_shares:'dummy9', endpoint:'dummy9', initial_tags:'dummy9', video_path:'dummy9', video_format:'dummy9', all_tags:'dummy9', uploader_details:'dummy9',},
			{ category:'dummy10', image_main:'dummy10', title:'dummy10', description:'dummy10', date_of_publishing:'dummy10', author_name:'dummy10', first_para:'dummy10', total_likes:'dummy10', total_shares:'dummy10', endpoint:'dummy10', initial_tags:'dummy10', video_path:'dummy10', video_format:'dummy10', all_tags:'dummy10', uploader_details:'dummy10',},
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

		default:

			return state

	}

};

export default reducerForVideo;
