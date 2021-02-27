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
	FooterContainer,
} from "./"

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


// copied from vertical masonries file
	get_height_of_nth_child_in_masonry_through_pattern(children_props, child_addition_pattern_heights){
		// generating list of child heights in child placement sequence
		let child_heights_list = []
		for (let j = 0; j < children_props.length; j++) {
			if (child_addition_pattern_heights[j]){
				child_heights_list.push( child_addition_pattern_heights[j] )
			}
		}		

		while (child_heights_list.length < children_props.length){
			child_heights_list = [...child_heights_list, ...child_heights_list]
		}

		if (children_props.length < child_heights_list.length){
			let number_of_additional = child_heights_list.length - children_props.length

			child_heights_list.splice(children_props.length, number_of_additional)
		}
		
		return child_heights_list

	}

// RENDER METHOD
	render() {
			
		const total_images = this.props.total_images

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles = {

	  	}

	// copying EXACT same children being passed to VerticalMasonriesContainer below but without local_height prop
		let total_children = total_images.map((item, index) => {

			return(
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

		})

	// copying same child_addition_pattern_heights from child_addition_pattern_heights prop to VerticalMasonriesContainer
		let child_addition_pattern_heights = [400, 200, 400, 200, 400, 200, ]

		return (

			<Grid container direction="row">

				{(this.props.isAllowedImagesControl) ? (
				
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
			  			<ConnectedCreateImage/>
			  		</Grid>

					) : (
						null
					)
				}

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
/*  test component for masonry
							<div style={{backgroundColor: 'blue', height:'100%'}}>
		  						<p>
		  							this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this this {index}
		  						</p>
		  					</div>*/
		  					<div>
			  					<ConnectedImageCard
			  						dataPayloadFromParent = { item }

			  						comments_quantity = { item.comments_quantity }
			  						comments = { item.comments || [] }

			  						likes_quantity = { item.likes_quantity }
			  						likes = { item.likes || [] }

			  						user_quantity = { item.user_quantity }
			  						user = { item.user || [] }

			  						index={index}
			  						local_height = {this.get_height_of_nth_child_in_masonry_through_pattern(total_children, child_addition_pattern_heights)[index]}						  			
			  					/>
		  					</div>
			  			)

		  			})}
		  		</VerticalMasonriesContainer>

			</Grid>

		);
	}
}


ImageContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(ImageContainer);