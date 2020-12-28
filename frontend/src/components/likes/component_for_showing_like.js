
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

const styles = theme => ({
	outerContainer:{
		marginTop:100,
	}
});

class ComponentForShowingLike extends Component {
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
		var base64Image = "data:image/jpeg;base64," + data.user_image

		return (
			<div style={styles.outerContainer}>
				<p>
					{data.user_name}
				</p>

				<div style={styles.imageContainer}>
					<img src={base64Image} alt="" 
						style={{
							width:100, 
							height:100, 
							resizeMode: "contain"
						}}
					/>
				</div>
			</div>
		);
	}
}
	
ComponentForShowingLike.defaultProps = {

};

// export default ComponentForShowingLike; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingLike))
