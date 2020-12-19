
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
import ReactPlayer from 'react-player'

const styles = theme => ({
  root: {
    height: 48,
    // color: props => (props.cool) ? 'red' : 'black',
    [theme.breakpoints.up('sm')]:{
    	paddingLeft:100
    },
  },
});


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
		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		  		// <ReactPlayer 
		  		// 	controls={true}
			  	// 	url={`http://localhost:3001/video-stream/video?endpoint=${this.props.current_video}`} 
		  		// />
		console.log(this.props.current_video)
	  	return (
	  		<div>

		  		<video 
			  		src = {`http://localhost:3001/video-stream/video?endpoint=${this.props.current_video}`} 
			  		controls = {true}
		  		/>
	  			
	  		</div>


		);
	}
}
	
IndividualIndividualVideo.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(withStyles(styles)(IndividualIndividualVideo)));

	  		// <Grid container direction="row" spacing={4} style={{backgroundColor: '#eee'}} >

	  		// 	<Grid item container direction="column" xs={12} sm={12} md={2} lg={3}>
	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>
	  		// 	</Grid>

	  		// 	<Grid item container direction="column" xs={12} sm={12} md={8} lg={6}>
	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>
	  		// 	</Grid>

	  		// 	<Grid item container direction="column" xs={12} sm={12} md={2} lg={3}>
	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>

	  		// 		<Grid item>
	  		// 		</Grid>
	  		// 	</Grid>

	  		// </Grid>