
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingBlogPost
} from "."

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	SummarizeCommentsOfBlogPost,
	ShowCommentsOfBlogPost,
} from "../comments/"

import {
	ConnectedCreateCommentForBlogpost,
} from "../../redux_stuff/connected_components"


import {
	SummarizeLikesOfBlogPost,
	ShowLikesOfBlogPost,
} from "../likes/"

import {
	ConnectedCreateLikeForBlogpost,
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
	buttonWithoutBG:{
		marginTop: 50,
		marginBottom: 50,
	}

});

class BlogPostCard extends Component {
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

		axios.get(utils.baseUrl + '/blogpostings/get-all-comments-of-blogpost', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, comments: ( prev.comments.length === 0 ) ? response.data : [] }) )
			console.log(this.state.comments)
		})
		.catch((error) => {
			console.log(error);
		})
		
	}


	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/blogpostings/get-all-likes-of-blogpost', 
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
		// console.log('COMMENTS')
		// console.log(this.state.comments)

		return (
		  	<div>

		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingBlogPost
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

				<div style={{marginTop:10}}>
					{/* 2nd show individual summary of childs */}
					<SummarizeCommentsOfBlogPost
						showOnlyQuantity= { false }
						child_quantity = { this.props.comments_quantity }
						dataPayloadFromParent = { this.props.comments }
					/>
					<SummarizeLikesOfBlogPost
						showOnlyQuantity= { false }
						child_quantity = { this.props.likes_quantity }
						dataPayloadFromParent = { this.props.likes }
					/>
				</div>

				<div style={{marginTop:10}}>
					{/* 3rd show individual button for showing childs */}

					<button style={styles.buttonWithoutBG}
						onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
					>
						<p>
							Show All Comments
						</p>
					</button>
					
					<ShowCommentsOfBlogPost
						dataPayloadFromParent = { this.state.comments }
					/>

					<button style={{marginTop:50}}
						onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
					>
						<p>
							Show All Like
						</p>
					</button>
					
					<ShowLikesOfBlogPost
						dataPayloadFromParent = { this.state.likes }
					/>
				</div>

				<div style={{marginTop:50}}>
					{/* 4th create individual child options like comment / like */}					
					<ConnectedCreateCommentForBlogpost
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>					
					<ConnectedCreateLikeForBlogpost
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>
				</div>

		  	</div>
		);
	}
}
	
BlogPostCard.defaultProps = {

};

// export default BlogPostCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(BlogPostCard));
