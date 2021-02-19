import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	withRouter,
	Redirect,
} from "react-router-dom";

import ThumbUp from '@material-ui/icons/ThumbUp';


class CreateLikeForBlogpost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			redirectToRoute: false,
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const styles = {
			buttonWithoutBG:{
				outline:'none',
				background:'none',
				borderWidth:0,
				// borderStyle:'solid',
				// borderColor:'white',
				// backgroundColor:'white'
			}
		}

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

					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentBlogPost = (arg) => this.props.set_current_blogpost(arg)
							let redirectToNewBlogPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							axios.post(utils.baseUrl + '/blogpostings/create-like-for-blogpost', 
								{
									blogpost_endpoint: this.props.parentDetailsPayload.endpoint,
								})
							.then(function (response) {
								console.log(response.data) // current blogpost screen data
								
								// set to current parent object
								setResponseInCurrentBlogPost(response.data)

								// change route to current_blogpost	
								redirectToNewBlogPost()							

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<ThumbUp style={{color:'grey', fontSize:30,}}/>
					</button>
				</div>
			);
		}
	}
}
	
CreateLikeForBlogpost.defaultProps = {

};

// export default CreateLikeForBlogpost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateLikeForBlogpost))