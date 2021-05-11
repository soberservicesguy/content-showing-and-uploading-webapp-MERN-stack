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

import {
	ShowLikesOfVideo,
} from "../components/likes"
import {
	ShowCommentsOfVideo
} from "../components/comments"

import {
	ConnectedCreateCommentForVideo,
	ConnectedCreateLikeForVideo,
} from "../redux_stuff/connected_components"

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
			},

			showSocialsContainer:{
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				width:'100%',
				margin:'auto',
				marginTop:10,
			},
			createSocialObjectsContainer:{
				width:'90%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop:20,
				paddingBottom:20,

				borderWidth:0,
				borderTopWidth:1,
				borderStyle:'solid',
				borderColor:'#eee',
				paddingTop:20,
			},



		}

		let video_data = this.props.current_video
		let post_video_content
		let video_source

		if (video_data.object_files_hosted_at === 'gcp_storage'){

			console.log('ITS GCP')
			console.log(video_data.video_filepath)
		 	// video_source = `https://storage.googleapis.com/${ video_data.video_filepath.split(" ").join("-") }`
		 	video_source = `${ video_data.video_filepath.split(" ").join("-") }`

		 	console.log('video_source final')
		 	console.log(video_source)
			post_video_content = (
				<div style={styles.postVideoContainer}>
					<video
						type='video/mp4'
				  		style={styles.videoStyle}
						// width="100%" 
						// height="300" 
						controls
						src={video_source} 
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ video_to_show }`}} 
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ video_data.video_filepath }`}} 
					/>
				</div>
			)

		} else if (video_data.object_files_hosted_at === 'aws_s3'){

			console.log('ITS AWS')
			// video_source = `https://s3.amazonaws.com/${ data.video_filepath }`
			video_source = `${ video_data.video_filepath }` // VERIFY
			// video_source = `https://d3iwm50qkhk5zm.cloudfront.net/${ video_data.video_filepath }`
			// console.log('video_source')
			// console.log(video_source)

			post_video_content = (
				<div style={styles.postVideoContainer}>
					<video
						type='video/mp4'
				  		style={styles.videoStyle}
						// width="100%" 
						// height="300" 
						controls
						src={video_source} 
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ video_to_show }`}} 
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.video_for_post }`}} 
					/>
				</div>
			)
		} else {

			console.log('ITS DISK')
			console.log(video_data)
			post_video_content = (
				<div style={styles.postVideoContainer}>
					<video
						type='video/mp4'
				  		style={styles.videoStyle}
						// width="100%" 
						// height="300" 
						controls
						src={`http://localhost:3001/video/video-streaming?endpoint=${ video_data.endpoint }`} // FOR REACT 
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.socialpost_endpoint }`}}  // FOR NATIVE
						// src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.video_for_post }`}} 
					/>
				</div>
			)
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

	  			{ post_video_content }

		  		{/*<video 
			  		style={styles.videoStyle}
			  		src = {`${utils.baseUrl}/video/video-streaming?endpoint=${this.props.current_video.endpoint}`} 
			  		controls = {true}
		  		/>*/}

	  			<p style={styles.categoryText}>
	  				Category: <span style={{fontWeight:'normal'}}>{this.props.current_video.category}</span>
	  			</p>

	  			<p style={styles.descriptionText}>
	  				{this.props.current_video.description}
	  			</p>

	  			<p style={styles.allTagsText}>
	  				{this.props.current_video.all_tags}
	  			</p>
	  			

	  			<div
	  				style={styles.showSocialsContainer}
	  			>
	  				{/* 2nd show individual summary of childs */}
	  				<div>
	  					<ShowLikesOfVideo
	  						dataPayloadFromParent = { this.props.current_video }
	  						likes_quantity = { this.props.current_video.total_likes }
	  					/>
	  				</div>
	  				<div>
	  					<ShowCommentsOfVideo
	  						dataPayloadFromParent = { this.props.current_video }
	  						comments_quantity = { this.props.current_video.total_comments }
	  					/>
	  				</div>
  				</div>

				<div style={styles.createSocialObjectsContainer}>
					{/* 4th create individual child options like comment / like */}					

					<div style={{flex:1}}>
		  				<ConnectedCreateCommentForVideo
		  					parentDetailsPayload = { this.props.current_video }
		  					redirectToNew = {false}  
		  				/>					
					</div>

					<div style={{flexBasis:100}}>
		  				<ConnectedCreateLikeForVideo
		  					parentDetailsPayload = { this.props.current_video }
		  					redirectToNew = {false}  
		  				/>
		  			</div>
	  			</div>

	  		</div>


		);
	}
}


IndividualIndividualVideo.defaultProps = {
	//:,
};

export default IndividualIndividualVideo;