
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
import withResponsiveness from "../responsiveness_hook";

import { withRouter } from "react-router-dom";



class IndividualIndividualImage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

		// console.log('this')
		// console.log(this.props.current_image)
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
				marginTop:20,
				marginBottom:10,

			},
			titleText:{
				fontWeight:'bold',
				fontSize:30,
				marginTop:40,
				marginBottom:30,
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

		}

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	let data = this.props.current_image
	  	console.log('BELOW')
	  	console.log(this.props.current_image)

  		var base64Image = "data:image/jpeg;base64," + data.image_filepath
  		// var base64Image = "data:image/jpeg;base64," + this.props.current_image
	  
	  	return (
	  		<div style={styles.outerContainer}>


	  			<p style={styles.titleText}>
	  				{data.title}
	  			</p>

	  			<div>
		  			<img 
		  				src={base64Image} 
		  				// src={utils.image}
		  				alt="" 
		  				style={{
		  					// width:'100%', height:600, 
		  					resizeMode: "stretch"
		  				}}
	  				/>
	  			</div>

	  			<p style={styles.categoryText}>
	  				Category: <span style={{fontWeight:'normal'}}>{data.category}</span>
	  			</p>

	  			<p style={styles.descriptionText}>
	  				{data.description}
	  			</p>

	  			<p style={styles.allTagsText}>
	  				{data.all_tags}
	  			</p>
	
	  		</div>
		);
	}
}
	
// category
// title
// description
// all_tags

IndividualIndividualImage.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(IndividualIndividualImage));