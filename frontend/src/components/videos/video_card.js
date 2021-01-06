
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



const styles = theme => ({
	root: {
		maxWidth: 380,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},

});

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

		return (
		  	<div>

		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingVideo
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

				<div style={{marginTop:50}}>
					{/* 2nd show individual summary of childs */}
					<SummarizeCommentsOfVideo
						showOnlyQuantity= { false }
						child_quantity = { this.props.comments_quantity }
						dataPayloadFromParent = { this.props.comments }
					/>
					<SummarizeLikesOfVideo
						showOnlyQuantity= { false }
						child_quantity = { this.props.likes_quantity }
						dataPayloadFromParent = { this.props.likes }
					/>
				</div>

				<div>
					{/* 3rd show individual button for showing childs */}

					<button
						onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
					>
						<p>
							Show All Comment
						</p>
					</button>
					
					<ShowCommentsOfVideo
						dataPayloadFromParent = { this.state.comments }
					/>

					<button style={{marginTop:50}}
						onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
					>
						<p>
							Show All Like
						</p>
					</button>
					
					<ShowLikesOfVideo
						dataPayloadFromParent = { this.state.likes }
					/>
				</div>

				<div style={{marginTop:50}}>
					{/* 4th create individual child options like comment / like */}					
					<ConnectedCreateCommentForVideo
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>					
					<ConnectedCreateLikeForVideo
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>
				</div>

		  	</div>
		);
	}
}
	
VideoCard.defaultProps = {

};

// export default VideoCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(VideoCard));
