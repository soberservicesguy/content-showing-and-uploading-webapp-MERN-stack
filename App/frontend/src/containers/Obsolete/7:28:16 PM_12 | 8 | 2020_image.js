
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
	ConnectedImageCard,
	ConnectedCreateImage,
} from '../redux_stuff/connected_components';


const styles = theme => ({
  root: {
    height: 48,
//    color: props => (props.cool) ? 'red' : 'black',
    [theme.breakpoints.up('sm')]:{
    	paddingLeft:100
    },
  },
});

class ImageContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
			axios.get(utils.baseUrl + '/images/images-list-with-children',)
			.then((response) => {
				this.props.set_fetched_images(response.data)
			})
			.catch((error) => {
				console.log(error);
			})


	}
	get_10_more_items() {
		axios.get(utils.baseUrl + `/images/images-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_image(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_images = this.props.total_images

		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="row" spacing={4} style={{backgroundColor: '#eee'}} >
				
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
		  			<ConnectedCreateImage/>
		  		</Grid>

				{total_images.map((item, index)=>(

					<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
						<ConnectedImageCard
							dataPayloadFromParent = { item }

							comments_quantity = { item.comments_quantity }
							comments = { item.comments || [] }
						
						/>
					</Grid>

				))}

			</Grid>

		);
	}
}

ImageContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(withStyles(styles)(ImageContainer));

