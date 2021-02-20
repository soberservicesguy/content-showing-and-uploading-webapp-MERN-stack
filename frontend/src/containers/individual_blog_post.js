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


class IndividualIndividualBlogPost extends Component {
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

		const styles = {

		}

		var base64Image = "data:image/jpeg;base64," + this.props.current_blogpost.image_main
		let { id } = this.props.match.params // use in render method
		// console.log({id})

		return (
			<div style={styles.imageContainer}>
				<img src={base64Image} alt="" 
					style={{
						width:200, 
						height:400, 
						resizeMode: "contain"
					}}
				/>

				<p>
					{this.props.current_blogpost.category}
				</p>
			</div>
		);
	}
}
	
IndividualIndividualBlogPost.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(IndividualIndividualBlogPost));