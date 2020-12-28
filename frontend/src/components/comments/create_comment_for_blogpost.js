
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

class CreateCommentForBlogpost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			redirectToRoute: false,
			text: '',
			// commenting_timestamp: '',
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
			return <Redirect to = {{ pathname: "/Individual-BlogPost" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={styles.outerContainer}>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your comment" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, text: event.target.value})) }
							/>
						</form>
				  	</div>


					<button style={styles.buttonWithoutBG}
						onClick={ () => {
							let setResponseInCurrentBlogpost = (arg) => this.props.set_current_blogpost(arg)
							let redirectToNewBlogpost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							// first create child object
							axios.post(utils.baseUrl + '/blogpostings/create-comment-for-blogpost', 
								{
									comment_text: this.state.text,
									blogpost_endpoint: this.props.parentDetailsPayload.endpoint,
								})
							.then(function (response) {
								console.log(response.data) // current image screen data
								
								// set to current parent object
								setResponseInCurrentBlogpost(response.data)

								// change route to current_image	
								redirectToNewBlogpost()							

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<p style={styles.innerText}>
							Press To Create Comment
						</p>
					</button>
				</div>
			);
		}
	}
}
	
CreateCommentForBlogpost.defaultProps = {

};

// export default CreateCommentForBlogpost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(withStyles(styles)(CreateCommentForBlogpost)))
