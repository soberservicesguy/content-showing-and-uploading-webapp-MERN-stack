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

import withResponsiveness from "../../responsiveness_hook";

import ThumbUp from '@material-ui/icons/ThumbUp';


class ShowLikesOfImage extends Component {
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

	}

	fetchAllLike(endpoint) {

		console.log('FETCED')
		axios.get(utils.baseUrl + '/image/get-all-likes-of-image', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {

			// console.log(response.data)
			this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			this.toggle_like_modal()

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

		return (
		// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
			<div>
				
				<div>
			  		<button 
						style={styles.showSocialsButton}
						onClick={ () => {
							this.fetchAllLike( this.props.dataPayloadFromParent.endpoint )
						}}
					>
						<ThumbUp style={{color:'orange', fontSize:30, marginRight:10,}}/> {this.props.likes_quantity} likes							
					</button>
				</div>


				<Modal				  	
					open={this.state.show_like_modal} // link some variable to it so that it could be turned off
					// open={true} // link some variable to it so that it could be turned off
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
							this.setState( prev => ({...prev, likes: [] }) )
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
						
						<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20,}}>

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
	
ShowLikesOfImage.defaultProps = {

};


// export default ShowLikesOfImage // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ShowLikesOfImage)