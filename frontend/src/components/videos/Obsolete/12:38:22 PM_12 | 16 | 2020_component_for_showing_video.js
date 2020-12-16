
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

const styles = theme => ({
	outerContainer: {
	},
});

class ComponentForShowingVideo extends Component {
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

		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist

		return (
			<div style={styles.outerContainer}>
				<p>
					{ data.category }
				</p>
				<p>
					{ data.image_thumbnail }
				</p>
				<p>
					{ data.video_filename }
				</p>
				<p>
					{ data.title }
				</p>
				<p>
					{ data.endpoint }
				</p>
				<p>
					{ data.description }
				</p>
				<p>
					{ data.timestamp_of_uploading }
				</p>
				<p>
					{ data.all_tags }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingVideo.defaultProps = {

};

// export default ComponentForShowingVideo;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingVideo))
