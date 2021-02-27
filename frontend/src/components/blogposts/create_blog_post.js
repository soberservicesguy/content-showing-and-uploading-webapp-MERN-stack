import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	withRouter,
	Redirect,
} from "react-router-dom";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


class CreateBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,

			category: '',
			image_main_filepath: '',
			title: '',
			// timestamp_of_uploading: '',
			initial_tags: '',
			// endpoint: '',
			first_para: '',
			second_para: '',
			qouted_para: '',
			third_para: '',
			fourth_para: '',
			all_tags: '',


			new_blogpost_id: null,
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		const styles = {

			outerContainer:{
				backgroundColor: 'white',
				// height:500,
				marginBottom:10,
				paddingTop:30,
				paddingBottom:30,
			},


		// round text input
			roundTextInputContainer:{
				width:'55%', 
				height:50,
				margin:'auto',
				marginTop:10,
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

		// roundButton
			formAndRounButtonContainer:{
				marginTop:20,
				// flex:1,
				flexBasis:'50%',
				// width: '20%',
				// width: 100,
				height: 40,
				backgroundColor: 'none',
				borderRadius: 40,
				borderWidth: 1, 
				borderStyle: 'solid',
				borderColor: 'grey', 
				backgroundColor: 'grey',

				// position: 'relative',
				// bottom: (this.state.tracked_height2 + 2) + (this.state.tracked_height1 + 2 - this.state.tracked_height2 - 2)/2, // self_height_including_border_thickness + difference in heights of both / 2
				// left: this.state.tracked_width1 + 2 - this.state.tracked_width2 - 10, // tracked_width - self_width - some_gap 
			},
			roundButton:{
				width:'100%',
				height:'100%',
				border:'none',
				background: 'none',
				outline:'none',
				color:'white',
				fontWeight:'bold',
			},

			uploadImageContainer:{
				flexBasis:'50%',
				// height:60,
				margin:'auto',
				// marginTop:5,
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between', 
				alignItems:'center',
			},
			uploadImageButton:{
				paddingTop:20,
				// paddingBottom:20,
				fontWeight:'bold',
				color:'grey'
			}

		}

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: `/blogposts/:${this.state.new_blogpost_id}` }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your category" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, category: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your title" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, title: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your initial_tags" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, initial_tags: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your first_para" 
								type="text" 
								// name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, first_para: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								type="text" 
								// name="post_text"
								multiline={true}
								placeholder="Type your second_para" 
								onChange={ (event) => this.setState( prev => ({...prev, second_para: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your qouted_para" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, qouted_para: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your third_para" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, third_para: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your fourth_para" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, fourth_para: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								placeholder="Type your all_tags" 
								type="text" 
								// name="post_text"
								// multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, all_tags: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>
					</div>

					<div style={{
						display:'flex',
						flexDirection:'row',
						justifyContent: 'space-between',
						alignItems:'center',
						height:60,
						marginBottom:20,
					}}>

						<div style={styles.uploadImageContainer}>
							
							{/*image upload*/}
							<div>
								<label htmlFor="myImageInput">
									{/* below div will act as myInput button*/}
									<div style={styles.uploadImageButton}>
										Upload Image
									</div>
								</label>
								<input
									id="myImageInput"
									style={{display:'none'}}
									name="blogpost_image_main_filepath" // name of input field or fieldName simply
									multiple="multiple" // for selecting multiple files
									enctype="multipart/form-data"
									type="file"
									onChange={(event) => {
										// console logging selected file from menu
										console.log( event.target.files[0] ) // gives first file
										// setState method with event.target.files[0] as argument
										this.setState(prev => ({...prev, image_main_filepath: event.target.files[0]}))
									}}
								/>
							</div>

							<div style={styles.formAndRounButtonContainer}>
								<button 
									style={styles.roundButton}
									onClick={ () => {

										let setResponseInCurrentBlogPost = (arg) => this.props.set_current_blogpost(arg)
										let redirectToNewBlogPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
										let setNewBlogpostIDInState = (response) => this.setState(prev => ({...prev, new_blogpost_id: response.data.new_blogpost.endpoint }))	

										// in formData send individual variables and not a complete object
										// formData.append('video_object', video_object) // THIS WILL NOT WORK, SENT VARS INDIVIDUALLY
										const formData = new FormData()
										formData.append('category', this.state.category)
										formData.append('title', this.state.title)
										formData.append('initial_tags', this.state.initial_tags)
										formData.append('first_para', this.state.first_para)
										formData.append('second_para', this.state.second_para)
										formData.append('qouted_para', this.state.qouted_para)
										formData.append('third_para', this.state.third_para)
										formData.append('fourth_para', this.state.fourth_para)
										formData.append('all_tags', this.state.all_tags)
										if(this.state.image_main_filepath !== ''){
											formData.append('blogpost_image_main', this.state.image_main_filepath, this.state.image_main_filepath.name)
										}

										axios.post(utils.baseUrl + '/blogpostings/create-blogpost-with-user', formData)
										.then(function (response) {
											console.log(response.data) // current blogpost screen data
											
											setNewBlogpostIDInState(response)

											// set to current parent object
											setResponseInCurrentBlogPost(response.data.new_blogpost)

											// change route to current_blogpost
											redirectToNewBlogPost()

										})
										.catch(function (error) {
											console.log(error)
										});						

									}}
								>
									Create BlogPost
								</button>
							</div>

						</div>

					</div>

				</div>

			);
		}			
	}
}
	
CreateBlogPost.defaultProps = {

};

// export default CreateBlogPost // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateBlogPost))