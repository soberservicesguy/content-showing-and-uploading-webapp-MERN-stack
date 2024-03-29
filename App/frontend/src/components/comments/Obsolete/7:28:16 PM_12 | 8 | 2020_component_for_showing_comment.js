
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

		return (
			<div style={styles.outerContainer}>
				<p>
					{ data.image_thumbnail }
				</p>
				<p>
					{ data.text }
				</p>
				<p>
					{ data.date_of_publishing }
				</p>
				<p>
					{ data.author_name }
				</p>
				<p>
					{ data.comment_order }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingComment.defaultProps = {

};

// export default ComponentForShowingComment; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingComment))
