
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

const styles = theme => ({
	outerContainer:{
		
	}
});

class ComponentForShowingComment extends Component {
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

		const data = this.props.componentData // data being plugged from parent flatlist
		// console.log('COMMENT')
		// console.log(data)

		var base64Image = "data:image/jpeg;base64," + data.user_image
		return (
			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img src={base64Image} alt="" 
						style={{
							width:100, 
							height:100, 
							resizeMode: "contain"
						}}
					/>
				</div>
			
				<p>
					{data.user_name}
				</p>
			
				<p>
					{data.comment_text}
				</p>
			
			</div>
		);
	}
				// <p>
				// 	{ data.text }
				// </p>
				// <p>
				// 	{ data.commenting_timestamp }
				// </p>
}
	
ComponentForShowingComment.defaultProps = {

};

// export default ComponentForShowingComment; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingComment))
