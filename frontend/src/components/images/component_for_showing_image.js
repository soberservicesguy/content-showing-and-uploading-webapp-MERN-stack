
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

class ComponentForShowingImage extends Component {
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
					{ data.image_source }
				</p>
				<p>
					{ data.title }
				</p>
				<p>
					{ data.description }
				</p>
				<p>
					{ data.date_of_publishing }
				</p>
				<p>
					{ data.author_name }
				</p>
				<p>
					{ data.total_likes }
				</p>
				<p>
					{ data.total_shares }
				</p>
				<p>
					{ data.endpoint }
				</p>
				<p>
					{ data.all_tags }
				</p>
				<p>
					{ data.uploader_details }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingImage.defaultProps = {

};

// export default ComponentForShowingImage;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingImage))
