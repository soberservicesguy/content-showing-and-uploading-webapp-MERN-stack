
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

class CreateImage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,

			category: '',
			image_filepath: '',
			title: '',
			// endpoint: '',
			// timestamp_of_uploading: '',
			description: '',
			all_tags: '',

			tracked_width1: 0,
			tracked_height1: 0,
			tracked_width2: 0,
			tracked_height2: 0,


		}
		this.resizeHandler = this.resizeHandler.bind(this);
	}


	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			tracked_width1:this.divElement1.clientWidth, 
			tracked_height1:this.divElement1.clientHeight,
			tracked_width2:this.divElement2.clientWidth,
			tracked_height2:this.divElement2.clientHeight,
		}))
	}

	componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.resizeHandler);
	}

	render() {

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		const styles = {
			outerContainer:{
				backgroundColor: 'white',
			},

			avatarAndCreatePostContainer:{
				width:'95%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				height:100,
				// backgroundColor: '#000000'
				justifyContent: 'center',
				alignItems:'center',
			},
			createPostContainer:{
				flex: 5,
				// backgroundColor: '#000000',
				paddingTop:10,
			},

		// round text input
			roundTextInputContainer:{
				width:'95%', 
				height:50,
				margin:'auto',
				// marginBottom:0,
				// backgroundColor: '#000000',
			},
			roundTextInput:{
				outline:'none', 
				width:'100%', 
				height:50, 
				paddingLeft:20,
				paddingRight:100, 
				color:'black', 
				borderRadius:30,
				borderWidth:1, 
				borderStyle:'solid',
				borderColor:'#eee', 
				backgroundColor: '#eee',
			},

		// roundButtonInsideTextInput
			roundButtonInsideTextInputContainer:{
				width: '20%',
				// width: 100,
				height: 40,
				backgroundColor: 'none',
				borderRadius: this.state.tracked_height2 / 2,
				borderWidth: 1, 
				borderStyle: 'solid',
				borderColor: 'grey', 

				position: 'relative',
				bottom: (this.state.tracked_height2 + 2) + (this.state.tracked_height1 + 2 - this.state.tracked_height2 - 2)/2, // self_height_including_border_thickness + difference in heights of both / 2
				left: this.state.tracked_width1 + 2 - this.state.tracked_width2 - 10, // tracked_width - self_width - some_gap 
			},
			roundButtonInsideTextInput:{
				width:'100%',
				height:'100%',
				border:'none',
				background: 'none',
				outline:'none',
				color:'white',
				fontWeight:'bold',
			},

			uploadImageAndVideoContainer:{
				margin:'auto',
				marginTop:5,
				width:'75%',
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between' 
			},
			uploadImageAndVideoButton:{
				fontWeight:'bold',
				color:'grey'
			}

		}

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Image" }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>


					<div style={styles.avatarAndCreatePostContainer}>

						<div style={styles.createPostContainer}>
							{/* round text input */}
							<div style={styles.roundTextInputContainer}>
								<form>
									<input 
										ref={ (divElement) => { this.divElement1 = divElement } }
										placeholder="What's in your mind" 
										type="text" 
										name="post_text"
										multiline={true}
										onChange={ (event) => this.setState( prev => ({...prev, post_text: event.target.value})) }
										style={styles.roundTextInput} 
									/>
								</form>

								{/* round button inside round text input */}
								<div 
									ref={ (divElement) => { this.divElement2 = divElement } }
									style={styles.roundButtonInsideTextInputContainer}
								>
									<button 
										style={styles.roundButtonInsideTextInput}
										onClick={ () => {

											let setResponseInCurrentSocialPost = (arg) => this.props.set_current_socialpost(arg)
											let redirectToNewSocialPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

											const formData = new FormData()

											formData.append('post_text', this.state.post_text)
											if(this.state.image_upload !== ''){
												formData.append('image_upload', this.state.image_upload, this.state.image_upload.name)
											}
											if(this.state.video_upload !== ''){
												formData.append('video_upload', this.state.video_upload, this.state.video_upload.name)
											}

											axios.post(utils.baseUrl + '/socialposts/create-socialpost-with-user', formData)
											.then(function (response) {
												console.log(response.data) // current socialpost screen data
												
												// set to current parent object
												setResponseInCurrentSocialPost(response.data)

												// change route to current_socialpost
												redirectToNewSocialPost()

											})
											.catch(function (error) {
												console.log(error)
											});						

										}}
									>
										Create Post
									</button>
								</div>


							</div>

							<div style={styles.uploadImageAndVideoContainer}>
								
								{/*image upload*/}
								<div>
									<label htmlFor="myImageInput">
										{/* below div will act as myInput button*/}
										<div style={styles.uploadImageAndVideoButton}>
											Upload Image
										</div>
									</label>
									<input
										id="myImageInput"
										style={{display:'none'}}
										type={"file"}
										onChange={(event) => {
											// console logging selected file from menu
											// setState method with event.target.files[0] as argument
											this.setState(prev => ({...prev, image_upload: event.target.files[0]}))
											console.log( event.target.files[0] ) // gives first file
										}}
									/>
								</div>

								{/*video upload*/}
								<div>
									<label htmlFor="myVideoInput">
										{/* below div will act as myInput button*/}
										<div style={styles.uploadImageAndVideoButton}>
											Upload Video
										</div>
									</label>
									<input
										id="myVideoInput"
										style={{display:'none'}}
										type={"file"}
										onChange={(event) => {
											// console logging selected file from menu
											console.log( event.target.files[0] ) // gives first file
											// setState method with event.target.files[0] as argument
											this.setState(prev => ({...prev, video_upload: event.target.files[0]}))
										}}

									/>
								</div>
							</div>

						</div>

					</div>






				</div>
			);
		}			
	}
}
	
CreateImage.defaultProps = {

};

// export default CreateImage // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateImage))









					// <div style={styles.textinputContainer}>
					// 	<p style={styles.headingOverInput}>
					// 		USER_IMAGE
					// 	</p>
					// 	<form className={styles.root} noValidate autoComplete="off">
					// 		<input
					// 			name="upload_images_by_user" // name of input field or fieldName simply
					// 			enctype="multipart/form-data"
					// 			type="file"
					// 			onChange={(event) => {
					// 				// console logging selected file from menu
					// 				console.log( event.target.files[0] ) // gives first file
					// 				// setState method with event.target.files[0] as argument
					// 				this.setState(prev => ({...prev, image_filepath: event.target.files[0]}))
					// 			}}
					// 		/>
					// 	</form>
					// </div>


				 //  	<div style={styles.textinputContainer}>
					// 	<form className={styles.root} noValidate autoComplete="off">
					// 		<TextField 
					// 			label="Type your category" // placeholder 
					// 			id="standard-basic" // "filled-basic" / "outlined-basic"
					// 			variant="outlined" // "filled"
					// 			classes={styles.textinput}
					// 			onChange={ (event) => this.setState( prev => ({...prev, category: event.target.value})) }
					// 		/>
					// 	</form>
				 //  	</div>


				 //  	<div style={styles.textinputContainer}>
					// 	<form className={styles.root} noValidate autoComplete="off">
					// 		<TextField 
					// 			label="Type your title" // placeholder 
					// 			id="standard-basic" // "filled-basic" / "outlined-basic"
					// 			variant="outlined" // "filled"
					// 			classes={styles.textinput}
					// 			onChange={ (event) => this.setState( prev => ({...prev, title: event.target.value})) }
					// 		/>
					// 	</form>
				 //  	</div>


				 //  	<div style={styles.textinputContainer}>
					// 	<form className={styles.root} noValidate autoComplete="off">
					// 		<TextField 
					// 			label="Type your description" // placeholder 
					// 			id="standard-basic" // "filled-basic" / "outlined-basic"
					// 			variant="outlined" // "filled"
					// 			classes={styles.textinput}
					// 			onChange={ (event) => this.setState( prev => ({...prev, description: event.target.value})) }
					// 		/>
					// 	</form>
				 //  	</div>


				 //  	<div style={styles.textinputContainer}>
					// 	<form className={styles.root} noValidate autoComplete="off">
					// 		<TextField 
					// 			label="Type your all_tags" // placeholder 
					// 			id="standard-basic" // "filled-basic" / "outlined-basic"
					// 			variant="outlined" // "filled"
					// 			classes={styles.textinput}
					// 			onChange={ (event) => this.setState( prev => ({...prev, all_tags: event.target.value})) }
					// 		/>
					// 	</form>
				 //  	</div>

					// <button style={styles.buttonWithoutBG}
					// 	onClick={ () => {

					// 		let setResponseInCurrentImage = (arg) => this.props.set_current_image(arg)
					// 		let redirectToNewImage = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

					// 		// in formData send individual variables and not a complete object
					// 		// formData.append('video_object', video_object) // THIS WILL NOT WORK, SENT VARS INDIVIDUALLY
					// 		const formData = new FormData()
					// 		formData.append('category', this.state.category)
					// 		formData.append('title', this.state.title)
					// 		formData.append('description', this.state.description)
					// 		formData.append('all_tags', this.state.all_tags)
					// 		// formData.append('user_object', user_object) // not needed, since object will be pulled from passport js jwt token
					// 		formData.append('upload_images_by_user', this.state.image_filepath, this.state.image_filepath.name)

					// 		axios.post(utils.baseUrl + '/image-uploads/protected-image-upload', formData)
					// 		.then(function (response) {
					// 			// console.log(this.props.user_name)
					// 			console.log(response.data) // current image screen data
								
					// 			// set to current parent object
					// 			setResponseInCurrentImage(response.data.new_image)

					// 			// change route to current_image
					// 			redirectToNewImage()

					// 		})
					// 		.catch(function (error) {
					// 			console.log(error)
					// 		});						

					// 	}}
					// >
					// 	<p style={styles.innerText}>
					// 		Press To Create Image
					// 	</p>
					// </button>
