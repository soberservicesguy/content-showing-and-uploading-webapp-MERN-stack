
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

		}

	  	const {_xs, _sm, _md, _lg, _xl} = this.props
	  	console.log(this.props.current_image)
  		var base64Image = "data:image/jpeg;base64," + this.props.current_image.image_filepath
  		// var base64Image = "data:image/jpeg;base64," + this.props.current_image
	  
	  	return (
	  		<div style={styles.imageContainer}>
	  			<img 
	  				src={base64Image} 
	  				// src={utils.image}
	  				alt="" 
	  				style={{width:400, height:400, resizeMode: "stretch"}}
  				/>
  				<p>this</p>
	  		</div>
		);
	}
}
	
IndividualIndividualImage.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(IndividualIndividualImage));