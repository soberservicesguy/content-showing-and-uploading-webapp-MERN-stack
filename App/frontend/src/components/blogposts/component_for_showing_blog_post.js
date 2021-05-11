import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  // Link,
	withRouter,
} from "react-router-dom";


class ComponentForShowingBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			image_src: null,
		}

	}

	getImage(){

		// this.setState({ image_src: null })
		let image_object_id = this.props.dataPayloadFromParent.image_main_filepath

		axios.get(`${utils.baseUrl}/blogpostings/get-image`, 
			{
				params: {
					image_object_id: image_object_id
				}
			}
		)
	    .then(async (response) => {
	    	if (response.data.success){
		    	this.setState({ image_src: "data:image/jpeg;base64," + response.data.image})
	    	}

		});


	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState, snapshot) {


		if (prevProps.getIndividualImage === false && this.props.getIndividualImage === true){
			console.log('getting image')
			this.getImage()

		}

	}


	render() {

		const styles = {
			outerContainer:{
				// height:this.props.local_height,
				marginLeft:15,
				marginRight:15,
			},
			imageContainer:{
				// height:this.props.local_height/2, 
			},
			imageStyle:{
				width:'100%', 
				resizeMode: "stretch",
				height:this.props.local_height, 
			},

			titleText:{
				fontWeight:'bold',
				fontSize:18,
				width:'90%',
				margin:'auto',
				marginTop:40,
				marginBottom:10,
			},
			categoryText:{
				fontSize:16,
				width:'90%',
				margin:'auto',
				marginBottom:10,
			},

			paraText:{
				fontSize:15,
				width:'90%',
				margin:'auto',
				marginTop:20,
				// marginBottom:20,				
			}
		}

		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist
		var base64Image = "data:image/jpeg;base64," + data.image_main_filepath

		return (
			<div style={styles.outerContainer}>
				
				<div style={styles.imageContainer}>
					<img 
						src={this.state.image_src}
						// src={base64Image} 
						// src={utils.image}
						alt="" 
						style={styles.imageStyle}
					/>
				</div>

				<p style={styles.titleText}>
					{ data.title }
				</p>
				<p style={styles.categoryText}>
					{ data.category }
				</p>
				<p style={styles.paraText}>
					{ data.first_para }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingBlogPost.defaultProps = {

};

// export default ComponentForShowingBlogPost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(ComponentForShowingBlogPost))