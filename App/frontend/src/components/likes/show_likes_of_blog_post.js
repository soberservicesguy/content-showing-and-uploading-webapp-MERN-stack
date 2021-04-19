
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	Modal, 
	Grid, 
	// TextField,
	// Button 
} from "@material-ui/core";

import {
	ComponentForShowingLike
} from "."

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import ThumbUp from '@material-ui/icons/ThumbUp';

class ShowLikesOfBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			show_like_modal: false,

			likes: [],
		}

	}

	toggle_like_modal(){
		this.setState(
			prev => (
				{
					...prev,
					show_like_modal: (prev.show_like_modal === false) ? true : false 
				}
			)
		)
	}

// COMPONENT DID MOUNT
	componentDidMount() {

		if (this.props.dataPayloadFromParent.total_likes){

		} else {

			this.fetchAllLike(this.props.dataPayloadFromParent.endpoint)

		}

	}

	fetchAllLike(endpoint) {

		// console.log('FETCED')
		axios.get(utils.baseUrl + '/blogpostings/get-all-likes-of-blogpost', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {

			// console.log(response.data)
			this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			// this.toggle_like_modal()

		})
		.catch((error) => {
			console.log(error);
		})
		
	}


	render() {

		const styles = {
			showSocialsButton:{
				// color: 'inherit', 
				// textDecoration: 'inherit',

				outline:'none',
				background:'none',
				borderWidth:0,
				color:'orange',
				// borderStyle:'solid',
				// borderColor:'white',
				// backgroundColor:'white',
			},

		}

		console.log('this.props.likes_quantity')
		console.log(this.props.likes_quantity)

		return (
		// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
			<div style={styles.outerContainer}>

				<div>
			  		<button 
						style={styles.showSocialsButton}
						onClick={ () => {
							this.fetchAllLike( this.props.dataPayloadFromParent.endpoint )
							this.toggle_like_modal()
						}}
					>
						<ThumbUp style={{color:'orange', fontSize:30, marginRight:10,}}/> {(this.props.dataPayloadFromParent.total_likes) ? this.props.dataPayloadFromParent.total_likes: this.state.likes.length} likes							
					</button>
				</div>

				
				<Modal				  	
					open={this.state.show_like_modal} // link some variable to it so that it could be turned off
					aria-labelledby="server-modal-title"
					aria-describedby="server-modal-description"
					className={styles.modal}
					// onClose={() => {Alert.alert("Modal has been closed.");}}
				>
					<div style={{
						// height:windowHeight, 
					}}>
		
						<button onClick={() => {
							this.toggle_like_modal()
							// this.setState( prev => ({...prev, likes: [] }) )
						}}
							style={{
								outline:'none',
								background:'none',
								borderWidth:0,
								backgroundColor: 'grey',
								width:'100%',
								fontWeight:'bold',
								height:50,
							}}>
							Close Likes
						</button>
						
						<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20}}>
	
							{ this.state.likes.map((item, index) => (

								<Grid item xs={12}>
									<ComponentForShowingLike
										componentData = { item }
									/>
								</Grid>
							))}

						</Grid>

					</div>
				</Modal>


			</div>
		);
	}
}
	
ShowLikesOfBlogPost.defaultProps = {

};


// export default ShowLikesOfBlogPost // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ShowLikesOfBlogPost)