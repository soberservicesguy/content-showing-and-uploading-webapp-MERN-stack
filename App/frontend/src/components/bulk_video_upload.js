
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../utilities";

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
import withResponsiveness from "../responsiveness_hook";


class BulkVideoUpload extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			videos_to_upload: [],
			excel_sheet:'',
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

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
				flexBasis:'35%',
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



		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/videos" }} />

		} else {

			return (
				<div style={styles.outerContainer}>

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
								<label htmlFor="myVideosInput">
									{/* below div will act as myInput button*/}
									<div style={styles.uploadImageButton}>
										Upload Videos
									</div>
								</label>
								<input
									id="myVideosInput"
									style={{display:'none'}}
									name="videos_to_upload" // name of input field or fieldName simply
									multiple="multiple" // for selecting multiple files
									enctype="multipart/form-data"
									type="file"
									onChange={(event) => {
										// console logging selected file from menu
										console.log( event.target.files ) // gives all files
										// setState method with event.target.files[0] as argument
										this.setState(prev => ({...prev, videos_to_upload: event.target.files}))
									}}
								/>
							</div>

							{/*image upload*/}
							<div>
								<label htmlFor="myExcelFileInput">
									{/* below div will act as myInput button*/}
									<div style={styles.uploadImageButton}>
										Upload Excel File
									</div>
								</label>
								<input
									id="myExcelFileInput"
									style={{display:'none'}}
									name="excel_sheet" // name of input field or fieldName simply
									// multiple="multiple" // for selecting multiple files
									enctype="multipart/form-data"
									type="file"
									onChange={(event) => {
										// console logging selected file from menu
										console.log( event.target.files[0] ) // gives first file
										// setState method with event.target.files[0] as argument
										this.setState(prev => ({...prev, excel_sheet: event.target.files[0]}))
									}}
								/>
							</div>
						</div>
					</div>


					<div style={{
						width:'90%',
						margin:'auto',
						display:'flex',
						flexDirection:'row',
						justifyContent: 'space-around',
						alignItems:'center',
						height:60,
						marginBottom:20,
					}}>
						<div style={styles.formAndRounButtonContainer}>
							<button 
								style={styles.roundButton}
								onClick={ () => {

									// let setResponseInFetchedVideos = (arg) => this.props.set_fetched_videos(arg)
									let redirectToNewVideos = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

									// in formData send individual variables and not a complete object
									// formData.append('video_object', video_object) // THIS WILL NOT WORK, SENT VARS INDIVIDUALLY
									const formData = new FormData()
									// attaching multiple files with formData

									if (this.state.videos_to_upload.length > 0){

										Array.from(this.state.videos_to_upload).forEach((file) => {
											formData.append('videos_to_upload', file, file.name)
										})

									}
									if(this.state.excel_sheet !== ''){
										formData.append('excel_sheet', this.state.excel_sheet, this.state.excel_sheet.name)
									}

									if (this.state.excel_sheet !== '' && this.state.videos_to_upload.length > 0){
										console.log('ATTEMPTING TO UPLOAD VIDEOS')

										axios.post(utils.baseUrl + '/uploads/bulk-upload-videos', formData)
										.then(function (response) {
											console.log(response.data) // current blogpost screen data
											
											// set to current parent object
											// setResponseInFetchedVideos(response.data.new_blogpost)

											// change route to current_blogpost
											redirectToNewVideos()

										})
										.catch(function (error) {
											console.log(error)
										});						

									}

								}}
							>
								Upload All Videos
							</button>
						</div>



						<div style={styles.formAndRounButtonContainer}>
							<button 
								style={styles.roundButton}
								onClick={ () => {
									axios.get(utils.baseUrl + '/uploads/bulk-delete-videos')
									.then(function (response) {
										console.log(response.data)
									})
									.catch(function (error) {
										console.log(error)
									});
								}}
							>
								Delete Existing Videos
							</button>
						</div>
					</div>

				</div>	
			);
		}			
	}
}
	
BulkVideoUpload.defaultProps = {

};

// export default BulkVideoUpload // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(BulkVideoUpload))