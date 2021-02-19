import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


class ComponentForShowingBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {

		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

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
						// src={base64Image} 
						src={utils.image}
						alt="" 
						style={styles.imageStyle}
					/>
				</div>

				<p style={styles.titleText}>
					Title{ data.title }
				</p>
				<p style={styles.categoryText}>
					Category{ data.category }
				</p>
				<p style={styles.paraText}>
					Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum 
					{ data.first_para }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingBlogPost.defaultProps = {

};

// export default ComponentForShowingBlogPost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingBlogPost)

				// <p>
				// 	{ data.timestamp_of_uploading }
				// </p>
				// <p>
				// 	{ data.initial_tags }
				// </p>
				// <p>
				// 	{ data.endpoint }
				// </p>
				// <p>
				// 	{ data.second_para }
				// </p>
				// <p>
				// 	{ data.qouted_para }
				// </p>
				// <p>
				// 	{ data.third_para }
				// </p>
				// <p>
				// 	{ data.fourth_para }
				// </p>
				// <p>
				// 	{ data.all_tags }
				// </p>