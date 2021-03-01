import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import utils from "../utilities"
// IMPORT material-ui stuff
import { withStyles } from '@material-ui/styles';
import { 
	Grid, 
	// Button 
} from "@material-ui/core";
// IMPORT responsiveness hook
// import withResponsiveness from "../responsiveness_hook";

// import { withRouter } from "react-router-dom";
// import ReactPlayer from 'react-player'


class IndividualIndividualVideo extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
	}

// RENDER METHOD
	render() {

		const styles = {
			outerContainer:{
				margin:'auto',
				width:'80%'
			},
			descriptionText:{
				fontWeight:'normal',
				fontSize:20,
				marginTop:10,
				marginBottom:10,

			},
			categoryText:{
				fontWeight:'bold',
				fontSize:18,
				marginTop:10,
				marginBottom:10,

			},
			titleText:{
				fontWeight:'bold',
				fontSize:30,
				marginTop:40,
				marginBottom:0,
			},
			allTagsText:{
				borderTopColor:'#eee',
				borderTopWidth:2,
				borderTopStyle:'solid',
				paddingTop:30,
				fontSize:15,
				marginTop:30,
				color:'grey',								
			},
			videoStyle:{
				width:'100%',
				height:400,
			}

		}


		console.log(this.props.current_video.endpoint)

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		  		// <ReactPlayer 
		  		// 	controls={true}
			  	// 	url={`http://localhost:3001/video-stream/video?endpoint=${this.props.current_video}`} 
		  		// />
	  	return (
	  		<div style={styles.outerContainer}>

	  			<p style={styles.titleText}>
	  				{this.props.current_video.title}
	  			</p>

		  		<video 
			  		style={styles.videoStyle}
			  		src = {`${utils.baseUrl}/video/video-streaming?endpoint=${this.props.current_video.endpoint}`} 
			  		controls = {true}
		  		/>

	  			<p style={styles.categoryText}>
	  				Category: <span style={{fontWeight:'normal'}}>{this.props.current_video.category}</span>
	  			</p>

	  			<p style={styles.descriptionText}>
	  				{this.props.current_video.description}
	  			</p>

	  			<p style={styles.allTagsText}>
	  				{this.props.current_video.all_tags}
	  			</p>
	  			
	  		</div>


		);
	}
}


IndividualIndividualVideo.defaultProps = {
	//:,
};

export default IndividualIndividualVideo;