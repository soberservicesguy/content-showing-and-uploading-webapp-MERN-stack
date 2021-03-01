
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	// ComponentForShowingImage
} from "."

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	SummarizeCommentsOfImage,
	ShowCommentsOfImage,
} from "../comments/"

import {
	ConnectedComponentForShowingImage,
	ConnectedCreateCommentForImage,
	ConnectedCreateLikeForImage,
} from "../../redux_stuff/connected_components"


import {
	SummarizeLikesOfImage,
	ShowLikesOfImage,
} from "../likes/"

import Comment from '@material-ui/icons/Comment';
import ThumbUp from '@material-ui/icons/ThumbUp';


class ImageCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			comments: [],
			likes: [],
			// users: [],

			showOnlyQuantityForComment:true,
			showOnlyQuantityForLike:true,

		}
	}

	// fetchAllComment(endpoint) {

	// 	axios.get(utils.baseUrl + '/image/get-all-comments-of-image', 
	// 		{
	// 		    params: {
	// 				endpoint: endpoint,
	// 				child_count: 3,
	// 		    }
	// 		})
	// 	.then((response) => {

	// 		this.setState( prev => ({...prev, comments: ( prev.comments.length === 0 ) ? response.data : [] }) )
			
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	})
		
	// }


	// fetchAllLike(endpoint) {
	// 	axios.get(utils.baseUrl + '/image/get-all-likes-of-image', 
	// 		{
	// 		    params: {
	// 				endpoint: endpoint,
	// 				child_count: 3,
	// 		    }
	// 		})
	// 	.then((response) => {

	// 		this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	})
		
	// }

// COMPONENT DID MOUNT
	componentDidMount() {
		this.setState( prev => ({...prev, showOnlyQuantityForComment: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	componentWillUnmount(){
		this.setState( prev => ({...prev, showOnlyQuantityForComment: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
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
				color: 'inherit', 
				textDecoration: 'inherit',

				outline:'none',
				background:'none',
				borderWidth:0,
				color:'orange',
				// borderStyle:'solid',
				// borderColor:'white',
				// backgroundColor:'white',
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

		  		<div>
			
					{/* first the parent / card component */}
			
			  		<ConnectedComponentForShowingImage
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
						local_height = { this.props.local_height } // being passed so that heights can be assigned to each image backgorund
			  		>

			  			<div 
			  				style={{
				  				position:'relative',
				  				top:(this.props.local_height === 400) ? 190 : -10,
				  			}}
			  			>
							<div
								style={styles.showSocialsContainer}
							>
								{/* 2nd show individual summary of childs */}
								<div>
									<ShowLikesOfImage
										dataPayloadFromParent = { this.props.dataPayloadFromParent }
										likes_quantity = { this.props.likes_quantity }
									/>
								</div>
								<div>
									<ShowCommentsOfImage
										dataPayloadFromParent = { this.props.dataPayloadFromParent }
										comments_quantity = { this.props.comments_quantity }
									/>
								</div>
								{/*<div>
							  		<Link 
							  			to={{pathname:`/images/:id=${this.props.dataPayloadFromParent.endpoint}`, state:{likes:this.state.likes} }} 
										style={styles.showSocialsButton}
										onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
									>
										<ThumbUp style={{color:'orange', fontSize:30, marginRight:10,}}/> {this.props.likes_quantity} likes							
									</Link>
								</div>*/}

								{/*<div>
							  		<Link 
							  			to={{pathname:`/images/:id=${this.props.dataPayloadFromParent.endpoint}`, state:{comments:this.state.comments} }} 
										style={styles.showSocialsButton}
										onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
									>
										<Comment style={{color:'orange', fontSize:30, marginRight:10,}}/> {this.props.comments_quantity} comments
									</Link>
								</div>*/}

							{/*	<SummarizeCommentsOfImage
				  					showOnlyQuantity= { false }
				  					child_quantity = { this.props.comments_quantity }
				  					dataPayloadFromParent = { this.props.comments }
				  				/>
				  				<SummarizeLikesOfImage
				  					showOnlyQuantity= { false }
				  					child_quantity = { this.props.likes_quantity }
				  					dataPayloadFromParent = { this.props.likes }
				  				/>*/}
				  			</div>


{/*							<div style={{
								marginBottom: 25,
							}}>
								<ShowLikesOfImage
									dataPayloadFromParent = { this.state.likes }
									likes_quantity = { this.props.likes_quantity }
								/>
								<ShowCommentsOfImage
									dataPayloadFromParent = { this.state.comments }
								/>
							</div>*/}

							<div style={styles.createSocialObjectsContainer}>
								{/* 4th create individual child options like comment / like */}					

				  				<ConnectedCreateCommentForImage
				  					parentDetailsPayload = { this.props.dataPayloadFromParent }
				  				/>					
				  				<ConnectedCreateLikeForImage
				  					parentDetailsPayload = { this.props.dataPayloadFromParent }
				  				/>
				  			</div>

			  			</div>

			  		</ConnectedComponentForShowingImage>
		  		</div>
		  	</div>
		);
	}
}
	
ImageCard.defaultProps = {

};

// export default ImageCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ImageCard);