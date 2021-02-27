import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingVideo
} from "."

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	SummarizeCommentsOfVideo,
	ShowCommentsOfVideo,
} from "../comments/"

import {
	ConnectedCreateCommentForVideo,
} from "../../redux_stuff/connected_components"


import {
	SummarizeLikesOfVideo,
	ShowLikesOfVideo,
} from "../likes/"

import {
	ConnectedCreateLikeForVideo,
} from "../../redux_stuff/connected_components"

import Comment from '@material-ui/icons/Comment';
import ThumbUp from '@material-ui/icons/ThumbUp';

class VideoCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			comments: [],
			likes: [],
			users: [],
		}	

	}

	fetchAllComment(endpoint) {

		axios.get(utils.baseUrl + '/videos/get-all-comments-of-video', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, comments: ( prev.comments.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})
		
	}


	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/videos/get-all-likes-of-video', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})
		
	}



// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const styles = {
			showSocialsContainer:{
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				width:'100%',
				margin:'auto',
				marginTop:10,
			},
			showSocialsButton:{
				outline:'none',
				background:'none',
				borderWidth:0,
				// borderStyle:'solid',
				// borderColor:'white',
				// backgroundColor:'white'
			},
			createSocialObjectsContainer:{
				width:'90%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginTop:20,
				paddingBottom:20,

				borderWidth:0,
				borderTopWidth:1,
				borderStyle:'solid',
				borderColor:'#eee',
				paddingTop:10,
			},
		}



		return (
		  	<div>

				{/* first the parent / card component */}
  		  		<Link 
  		  			to = {{ pathname: `/videos/:id=${this.props.dataPayloadFromParent.endpoint}` }}
  		  			style = {{color: 'inherit', textDecoration: 'inherit'}}
  		  			onClick = { () => this.props.set_current_video(this.props.dataPayloadFromParent) }
  				>
			  		<ComponentForShowingVideo
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
						local_height = { this.props.local_height } // being passed so that heights can be assigned to each image backgorund
			  		/>
  		  		</Link> 

	  			<div 
	  				style={{
		  				position:'relative',
		  				top:(this.props.local_height === 400) ? 190 : -10,
		  				width:'90%',
		  				margin:'auto',
		  			}}
	  			>
					<div style={styles.showSocialsContainer}>
						{/* 2nd show individual summary of childs */}

						<div>
							<button 
								style={styles.showSocialsButton}
								onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
							>
								<ThumbUp style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.likes_quantity} likes							
							</button>
						</div>

						<div>
							<button 
								style={styles.showSocialsButton}
								onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
							>
								<Comment style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.comments_quantity} likes
							</button>
						</div>

		  			</div>

					<div style={{
						marginBottom: 25,
					}}>
						<ShowLikesOfVideo
							dataPayloadFromParent = { this.state.likes }
						/>

						<ShowCommentsOfVideo
							dataPayloadFromParent = { this.state.comments }
						/>

					</div>

					<div style={styles.createSocialObjectsContainer}>
						{/* 4th create individual child options like comment / like */}					

						<ConnectedCreateCommentForVideo
							parentDetailsPayload = { this.props.dataPayloadFromParent }
						/>					
						<ConnectedCreateLikeForVideo
							parentDetailsPayload = { this.props.dataPayloadFromParent }
						/>

		  			</div>

		  		</div>

		  	</div>
		);
	}
}
	
VideoCard.defaultProps = {

};

// export default VideoCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(VideoCard);






				// <div style={{marginTop:50}}>
				// 	{/* 2nd show individual summary of childs */}
				// 	<SummarizeCommentsOfVideo
				// 		showOnlyQuantity= { false }
				// 		child_quantity = { this.props.comments_quantity }
				// 		dataPayloadFromParent = { this.props.comments }
				// 	/>
				// 	<SummarizeLikesOfVideo
				// 		showOnlyQuantity= { false }
				// 		child_quantity = { this.props.likes_quantity }
				// 		dataPayloadFromParent = { this.props.likes }
				// 	/>
				// </div>

				// <div>
				// 	{/* 3rd show individual button for showing childs */}

				// 	<button
				// 		onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
				// 	>
				// 		<p>
				// 			Show All Comment
				// 		</p>
				// 	</button>
					

				// 	<button style={{marginTop:50}}
				// 		onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
				// 	>
				// 		<p>
				// 			Show All Like
				// 		</p>
				// 	</button>
					
				// </div>

				// <div style={{marginTop:50}}>
				// 	{/* 4th create individual child options like comment / like */}					
				// </div>

