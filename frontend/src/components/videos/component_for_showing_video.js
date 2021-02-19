import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import withResponsiveness from "../../responsiveness_hook";


class ComponentForShowingVideo extends Component {
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
		const styles ={
			outerContainer:{
				marginLeft:5,
				marginRight:5,
			},

			imageContainer:{
				// paddingTop:(400-300)/2,
				// paddingBototm:(400-300)/2,
				width:'100%', 
				// height:400, 
				backgroundColor: '#000000',
			},

			imageStyle:{
				width:'100%', 
				height:300, 
				resizeMode: "contain"
			},

			titleText:{
				fontWeight:'bold',
				fontSize:18,
				width:'90%',
				margin:'auto',
				marginBottom:10,
			},
			categoryText:{
				fontSize:16,
				width:'90%',
				margin:'auto',
				marginBottom:10,
			},

			descriptionText:{
				fontSize:15,
				width:'90%',
				margin:'auto',
				marginTop:20,
				marginBottom:20,				
			}
		}

		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist
		var base64Image = "data:image/jpeg;base64," + data.image_thumbnail

		return (
			<div style={styles.outerContainer}>

				<p style={styles.titleText}>
					Title{ data.title }
				</p>
				<p style={styles.categoryText}>
					Category{ data.category }
				</p>
				<div style={styles.imageContainer}>
					<img 
						// src={base64Image} 
						src={utils.image}
						alt="" 
						style={styles.imageStyle}
					/>
				</div>

				<p style={styles.descriptionText}>
					Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum Loren ipsum 
					{ data.description }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingVideo.defaultProps = {

};

// export default ComponentForShowingVideo;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingVideo)


				// <p>
				// 	{ data.video_filename }
				// </p>
				// <p>
				// 	{ data.endpoint }
				// </p>
				// <p>
				// 	{ data.timestamp_of_uploading }
				// </p>
				// <p>
				// 	{ data.all_tags }
				// </p>
