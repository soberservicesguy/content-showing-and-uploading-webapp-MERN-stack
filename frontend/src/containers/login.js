
import React, {Component} from 'react';
import axios from 'axios';

// IMPORT connected components
// import {ConnectedSomeComponent} from "../redux_stuff/connected_components";

import utils from "../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";

import {
	TextField,
	// Modal, 
	// Grid, 
	// Button 
} from "@material-ui/core";

const styles = theme => ({
	iconStyle:{
		alignSelf:'center',
	},
	screenContainer:{
		alignItems:'center',
		flex:1,
		// display:'flex',
		// flexDirection: 'column',
		alignItems:'center',
		justifyContent: 'space-between', 
	},

	lowerButton:{
		alignItems: 'center',
		width:'100%',
		paddingTop:15,
		paddingBottom:15,
		marginBottom:0,
		backgroundColor: 'grey',
	},

	buttonWithoutBG:{
		marginTop:50,
		marginBottom:50,

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
	orText:{
		color:utils.lightGrey,
		fontSize:20,
		textAlign:'center',
	},
	orTextChild:{
		flex:1,
	},
	rightBar:{
		flex:3,
		borderBottomWidth:1,
		borderColor:utils.lightGrey,
		width:'100%',
	},
	leftBar:{
		flex:3,
		borderBottomWidth:1,
		borderColor:utils.lightGrey,
	},
	orContainer:{
		marginTop:20,
		display:'flex',
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		width:'80%',
	},
	buttonContainer:{
		marginTop:30,
		justifyContent: 'center',
		alignSelf:'center',
		height:100,
		width:'80%',
	},
	roundButton:{
		borderRadius:50,
		borderColor:'green',
		borderWidth:2,
		backgroundColor: 'green',
		borderStyle:'solid',
		width:'100%',
		paddingTop:15,
		paddingBottom:15,
	},
	text:{
		fontSize:20,
		color:'white',
		textAlign:'center',
	},
	headingOverInput:{
		width:'100%',
		marginTop:20,
		fontSize:18,
		fontWeight:'bold',
		textAlign:'left',
	},
	textinputContainer:{
		width:'80%',
	},
});

class LoginContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {

			user_name: '',
			phone_number: '',
			user_image: '',

		}
	}

	componentDidMount(){

	}


	storeDataAtBackend(){
		// upload file with axios request
		const formData = new FormData()
		formData.append('user_name', this.state.user_name)
		formData.append('phone_number', this.state.phone_number)
		formData.append('category', 'avatar')
		formData.append('avatar_image', this.state.user_image, this.state.user_image.name)


		axios.post(utils.baseUrl + '/avatar-uploads/avatar-image-upload', formData, {
			onUploadProgress: progressEvent => {
				console.log( 'upload progress: ' + Math.round((progressEvent.loaded / progressEvent.total)*100) + '%' )
			}
		})
		.then(function (response) {
			console.log(`POST rest call response is${JSON.stringify(response.data, null, 1)}`);
			if (response.data.success === true){
				// console.log('yes')
			}

			return response
		})
		.then((response) => {
			if (response.data.success === true){
				this.props.set_is_signed_in( true )
				// this.props.set_user_token( response.data.userToken )

				this.props.set_user_name( this.state.user_name )
				this.props.set_phone_number( this.state.phone_number )
				this.props.set_user_image( this.state.user_image )

			}
		})
		.catch(function (error) {
			// console.log(error);
		});	
	}

	render() {
		return(
			<div style={styles.screenContainer}>
				
				<div style={styles.buttonContainer}>
					<button style={styles.roundButton} onClick={() => null} activeOpacity={0.2}>
						<p style={styles.text}>
							SIGN UP WITH FACEBOOK
						</p>
					</button>
				</div>

			
				<div style={styles.orContainer}>
					<div style={styles.leftBar}>
					</div>

					<div style={styles.orTextChild}>
						<p style={styles.orText}>
							OR
						</p>
					</div>

					<div style={styles.rightBar}>
					</div>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_NAME
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user name" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_name: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						PHONE_NUMBER
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your phone number" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, phone_number: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_IMAGE
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<input
							name="avatar_image" // name of input field or fieldName simply
							enctype="multipart/form-data"
							type="file"
							onChange={(event) => {
								// console logging selected file from menu
								console.log( event.target.files[0] ) // gives first file
								// setState method with event.target.files[0] as argument
								this.setState(prev => ({...prev, user_image: event.target.files[0]}))
							}}
						/>
					</form>
				</div>

						
				<button  onClick={() => {}} style={styles.buttonWithoutBG}>
					<p style={styles.lowerText}>
						Already have an account ?
					</p>
				</button>
					
				<button style={styles.lowerButton} activeOpacity={0.2}
					onClick={ () => this.storeDataAtBackend() }
				>
					Create Account
				</button>
								
			</div>
		);
	}
}

// export default LoginContainer;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(LoginContainer))
