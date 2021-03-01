
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

import {
	ConnectedVideoCard,
	ConnectedCreateVideo,
} from '../redux_stuff/connected_components';


class VideoContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {
		// this.props.allow_videos_privilege()
		
// FETCHING DATA FOR COMPONENT
			axios.get(utils.baseUrl + '/video/videos-list-with-children',)
			.then((response) => {
				this.props.set_fetched_videos(response.data)
			})
			.catch((error) => {
				console.log(error);
			})


	}
	get_10_more_items() {
		axios.get(utils.baseUrl + `/videos/videos-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_video(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_videos = this.props.total_videos

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles ={

	  	}

		return (

			<Grid container direction="row">

				{(this.props.isAllowedVideosControl) ? (
				
					<Grid item xs={12}>
			  			<ConnectedCreateVideo/>
			  		</Grid>

					) : (
						null
					)
				}

				{total_videos.map((item, index)=>(

					<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
						<ConnectedVideoCard
							dataPayloadFromParent = { item }

							comments_quantity = { item.comments_quantity }
							comments = { item.comments || [] }

							likes_quantity = { item.likes_quantity }
							likes = { item.likes || [] }

							// user_quantity = { item.user_quantity }
							// user = { item.user || [] }
						
						/>
					</Grid>

				))}

			</Grid>

		);
	}
}

VideoContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(VideoContainer);