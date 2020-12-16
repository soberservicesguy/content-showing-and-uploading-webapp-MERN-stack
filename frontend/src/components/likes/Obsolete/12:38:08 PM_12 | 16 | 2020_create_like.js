
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	TextField,
	Grid, 
	// Modal, 
	// Button 
} from "@material-ui/core";

import {
	withRouter,
	Redirect,
} from "react-router-dom";

const styles = theme => ({
	root: {
		height: 48,
		color: props => (props.cool) ? 'red' : 'black',
		[theme.breakpoints.up('sm')]:{
			paddingLeft:100
		},
	},
	buttonWithoutBG:{
		marginTop:50,
		marginBottom:50,
	},
	innerText:{

	},
	textinputContainer:{
		// marginTop: windowHeight * 0.05, // or 30  gap
		// height: windowHeight * 0.1, // or 100
		width: '80%',
		justifyContent: 'center', // vertically centered
		alignSelf: 'center', // horizontally centered
		// backgroundColor: utils.lightGreen,
	},
	textinput:{
		marginTop:20,
		textAlign:'left',
		borderWidth:1,
		borderColor:(utils.lightGrey),
		borderStyle:'solid',
		paddingLeft:20,
		paddingTop:15,
		paddingBottom:15,
		fontSize:18,
	},
	outerContainer: {
	},
	bigBlue: {
	},
});

class CreateLike extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			redirectToRoute: false,
			timestamp_of_liking: '',
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Image" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={styles.outerContainer}>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your timestamp_of_liking" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (value) => this.setState( prev => ({...prev, timestamp_of_liking: value})) }
							/>
						</form>
				  	</div>
					<button style={styles.buttonWithoutBG}
						onClick={ () => {
							let setResponseInCurrentImage = (arg) => this.props.set_current_image(arg)
							let redirectToNewImage = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							// first create child object
							let like_object = {
								timestamp_of_liking: this.state.timestamp_of_liking,
							}

							// 2nd create linked object from redux (linked_object_and_live_object_in_redux in schema)
							let user_object = {

								user_name: this.props.user_name,
								phone_number: this.props.phone_number,
								user_image: this.props.user_image,
								hash: this.props.hash,
								salt: this.props.salt,
								user_name: this.props.user_name,
								phone_number: this.props.phone_number,
								user_image: this.props.user_image,
								hash: this.props.hash,
								salt: this.props.salt,
								user_name: this.props.user_name,
								phone_number: this.props.phone_number,
								user_image: this.props.user_image,
								hash: this.props.hash,
								salt: this.props.salt,
							}

							// 3rd create parent object								
							let image_object = this.props.parentDetailsPayload

							// 4th making post request
							axios.post(utils.baseUrl + '/images/create-like-for-image', 
								{
									like_object: like_object,
									image_object: image_object,
									user_object: user_object,
								})
							.then(function (response) {
								console.log(response.data) // current image screen data
								
								// set to current parent object
								setResponseInCurrentImage(response.data)

								// change route to current_image	
								redirectToNewImage()							

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<p style={styles.innerText}>
							Press To Create Like
						</p>
					</button>
				</div>
			);
		}
	}
}
	
CreateLike.defaultProps = {

};

// export default CreateLike;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(withStyles(styles)(CreateLike)))
