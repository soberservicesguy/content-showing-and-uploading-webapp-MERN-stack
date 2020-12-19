
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

const styles = theme => ({
  root: {
    height: 48,
    // color: props => (props.cool) ? 'red' : 'black',
    [theme.breakpoints.up('sm')]:{
    	paddingLeft:100
    },
  },

  imageStyle:{
  	resizeMode: "stretch",
  	height: 300,
  	width: 300,
  },
  
  imageContainer:{
  	// marginTop: windowHeight * 0.05, // or 30  gap
  	height: '80%', // or 100
  	width: '80%',
  	justifyContent: 'center', // vertically centered
  	alignSelf: 'center', // horizontally centered
  	// backgroundColor: utils.lightGreen,
  },

});


class IndividualIndividualImage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

		console.log('this')
		console.log(this.props.current_image)
// FETCHING DATA FOR COMPONENT
	}

// RENDER METHOD
	render() {
		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

  		var base64Image = "data:image/jpeg;base64," + this.props.current_image
	  	return (
	  		<div style={styles.imageContainer}>
	  			<img src={base64Image} alt="" style={{width:200, height:400, resizeMode: "contain"}}/>
	  		</div>
		);
	}
}
	
IndividualIndividualImage.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(withStyles(styles)(IndividualIndividualImage)));