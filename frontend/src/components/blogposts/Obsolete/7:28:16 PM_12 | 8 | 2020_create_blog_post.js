
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

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

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

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


class CreateBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			category: '',
			image_main: '',
			title: '',
			date_of_publishing: '',
			author_name: '',
			first_para: '',
			total_likes: '',
			total_shares: '',
			endpoint: '',
			initial_tags: '',
			second_para: '',
			qouted_para: '',
			third_para: '',
			fourth_para: '',
			all_tags: '',
			author_details: '',		}

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
								label="Type your category" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, category: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your image_main" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, image_main: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your title" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, title: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your date_of_publishing" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, date_of_publishing: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your author_name" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, author_name: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your first_para" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, first_para: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your total_likes" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, total_likes: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your total_shares" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, total_shares: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your endpoint" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, endpoint: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your initial_tags" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, initial_tags: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your second_para" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, second_para: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your qouted_para" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, qouted_para: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your third_para" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, third_para: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your fourth_para" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, fourth_para: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your all_tags" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, all_tags: event.target.value})) }
							/>
						</form>
				  	</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your author_details" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, author_details: event.target.value})) }
							/>
						</form>
				  	</div>

					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentBlogPost = (arg) => this.props.set_current_blogpost(arg)
							let redirectToNewBlogPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							// first create parent object
							let blogpost_object = {
								category: this.state.category,
								image_main: this.state.image_main,
								title: this.state.title,
								date_of_publishing: this.state.date_of_publishing,
								author_name: this.state.author_name,
								first_para: this.state.first_para,
								total_likes: this.state.total_likes,
								total_shares: this.state.total_shares,
								endpoint: this.state.endpoint,
								initial_tags: this.state.initial_tags,
								second_para: this.state.second_para,
								qouted_para: this.state.qouted_para,
								third_para: this.state.third_para,
								fourth_para: this.state.fourth_para,
								all_tags: this.state.all_tags,
								author_details: this.state.author_details,
							}

							// 2nd create child object from redux (linked_object_and_live_object_in_redux in schema)
							let user_object = {

								user_name: this.props.user_name,
								phone_number: this.props.phone_number,
							}

							// 3rd send post request
							axios.post(utils.baseUrl + '/blogposts/create-blogpost-with-user', 
								{
									blogpost_object: blogpost_object,
									user_object: user_object,
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
						<p style={styles.innerText}>
							Press To Create BlogPost
						</p>
					</button>
				</div>
			);
		}			
	}
}
	
CreateBlogPost.defaultProps = {

};

// export default CreateBlogPost // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(withStyles(styles)(CreateBlogPost)))
