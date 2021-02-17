
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

import {
	VerticalMasonriesContainer,
} from "./"


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
				// console.log(response.data)
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

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles ={

	  	}
	  	
		return (

			<Grid container direction="row">
				
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
		  			<ConnectedCreateImage/>
		  		</Grid>

		  		<VerticalMasonriesContainer
		  			child_addition_pattern_heights={[400, 200, 400, 200, 400, 200, ]}
		  			containerBGcolor={'none'}
		  			containerWidth={'100%'}
		  			column_wise_details_list={[ 
		  				{ width_in_grids:4, bottom_spacing:10, leftGap:0 },
		  				{ width_in_grids:4, bottom_spacing:10, leftGap:10 },
		  				{ width_in_grids:4, bottom_spacing:10, leftGap:10 },
		  				// { width_in_grids:3, bottom_spacing:10, leftGap:10 },
		  			]}


		  		>
		  			{total_images.map((item, index) => {

		  				return(
/*		  					<div style={{backgroundColor: 'blue', height:'100%'}}>
		  						<p>
		  							this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this {index}
		  						</p>
		  					</div>*/
		  					<ConnectedImageCard
		  						dataPayloadFromParent = { item }

		  						comments_quantity = { item.comments_quantity }
		  						comments = { item.comments || [] }

		  						likes_quantity = { item.likes_quantity }
		  						likes = { item.likes || [] }

		  						user_quantity = { item.user_quantity }
		  						user = { item.user || [] }
		  					
		  					/>
			  			)

		  			})}
		  		</VerticalMasonriesContainer>

			</Grid>

		);
	}
}




				// {total_images.map((item, index)=>(

				// 	<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
				// 		<ConnectedImageCard
				// 			dataPayloadFromParent = { item }

				// 			comments_quantity = { item.comments_quantity }
				// 			comments = { item.comments || [] }

				// 			likes_quantity = { item.likes_quantity }
				// 			likes = { item.likes || [] }

				// 			user_quantity = { item.user_quantity }
				// 			user = { item.user || [] }
						
				// 		/>
				// 	</Grid>

				// ))}


ImageContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(ImageContainer);



		  			// <div style={{backgroundColor: '#000000'}}>
		  			// 	<p>this</p>
		  			// </div>

		  			// <div style={{backgroundColor: 'grey'}}>
		  			// 	<p>this</p>
		  			// </div>

		  			// <div 
		  			// 	style={{backgroundColor: 'red'}}
	  				// >
		  			// 	<p>this</p>
		  			// </div>


		  			// <div style={{backgroundColor: '#000000'}}>
		  			// 	<p>this</p>
		  			// </div>

		  			// <div style={{backgroundColor: 'grey'}}>
		  			// 	<p>this</p>
		  			// </div>
