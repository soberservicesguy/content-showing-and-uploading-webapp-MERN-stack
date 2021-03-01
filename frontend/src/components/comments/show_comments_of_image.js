
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
	ComponentForShowingComment
} from "."

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import Comment from '@material-ui/icons/Comment';


class ShowCommentsOfImage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			show_comment_modal: false,
			comments:[]
		}

	}

	toggle_comment_modal(){
		this.setState(
			prev => (
				{
					...prev,
					show_comment_modal: (prev.show_comment_modal === false) ? true : false 
				}
			)
		)
	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	fetchAllComment(endpoint) {

		axios.get(utils.baseUrl + '/image/get-all-comments-of-image', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {

			console.log('Called')
			this.setState( prev => ({...prev, comments: ( prev.comments.length === 0 ) ? response.data : [] }) )
			this.toggle_comment_modal()
			
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
			<div style={styles.outerContainer}>


	{/* showing Comment as expanded list is below */}
				<div>
			  		<button 
						style={styles.showSocialsButton}
						onClick={ () => {
							this.fetchAllComment( this.props.dataPayloadFromParent.endpoint )
						}}
					>
						<Comment style={{color:'orange', fontSize:30, marginRight:10,}}/> {this.props.comments_quantity} comments
					</button>
				</div>



{/* showing Comment as modal is below */}
				
				<Modal				  	
					open={this.state.show_comment_modal} // link some variable to it so that it could be turned off
					aria-labelledby="server-modal-title"
					aria-describedby="server-modal-description"
					className={styles.modal}
					// onClose={() => {Alert.alert("Modal has been closed.");}}
				>
					<div style={{
						// height:windowHeight, 
					}}>
		
						<button onClick={() => {
							this.toggle_comment_modal()
							this.setState( prev => ({...prev, comments: [] }) )
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
							Close Comments
						</button>
						
						<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20,}}>
	
							{ this.state.comments.map((item, index) => (

								<Grid item xs={12}>
									<ComponentForShowingComment
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
	
ShowCommentsOfImage.defaultProps = {

};


// export default ShowCommentsOfImage // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ShowCommentsOfImage)