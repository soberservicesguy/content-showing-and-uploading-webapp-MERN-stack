import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
//IMPORT COMPONENTS
import {TextBoxWithBackgroundImage} from "../components";
// IMPORT material-ui stuff
import { 
	Grid, 
	// Button 
} from "@material-ui/core";
// IMPORT responsiveness hook
import withResponsiveness from "../responsiveness_hook";


class VerticalMasonriesContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

	componentDidMount() {
		this.generate_grid()
	}

	generate_grid(){

		let component
		let children_assigned = 0
		let {_xs, _sm, _md, _lg, _xl} = this.props;


		let total_columns_list = Object.keys(this.props.column_wise_details_list)
		let child_list

		// generating list of child heights in child placement sequence
		let child_heights_list = []
		for (let j = 0; j < this.props.children.length; j++) {
			if (this.props.child_addition_pattern_heights[j]){
				child_heights_list.push( this.props.child_addition_pattern_heights[j] )
			}
		}		

		while (child_heights_list.length < this.props.children.length){
			child_heights_list = [...child_heights_list, ...child_heights_list]
		}

		if (this.props.children.length < child_heights_list.length){
			let number_of_additional = child_heights_list.length - this.props.children.length

			child_heights_list.splice(this.props.children.length, number_of_additional)
		}

		let column_dict = {}

		for (let j = 0; j < this.props.children.length / this.props.child_addition_pattern_heights.length; j++) {

			let iteration_index = j

			for (let i = 0; i < this.props.column_wise_details_list.length; i++) {

				if ( !Array.isArray(column_dict[i]) ){
					column_dict[i] = []
				}

				if ( children_assigned < this.props.children.length ){

					if ( _xs || _sm || _md ){

						component = (
							<Grid item
								style={{
									height: child_heights_list[children_assigned],
									marginBottom: this.props.column_wise_details_list[i].bottom_spacing,
									// marginLeft: this.props.column_wise_details_list[i].leftGap,
								}}
							>
								{ this.props.children[ children_assigned ] }
							</Grid>
						)

						column_dict[i].push(component)
						children_assigned += 1


					} else {

						component = (
							<Grid item
								style={{
									height: child_heights_list[children_assigned],
									marginBottom: this.props.column_wise_details_list[i].bottom_spacing,
									marginLeft: this.props.column_wise_details_list[i].leftGap,
								}}
							>	
								{ this.props.children[ children_assigned ] }
							</Grid>
						)

						column_dict[i].push(component)
						children_assigned += 1

					}

				}
			}



		}

		let all_columns = []
		this.props.column_wise_details_list.map((column_detail, index) => {

			all_columns.push(
			
				<Grid item container direction="column" 
					xs={12} sm={12} 
					md={column_detail.width_in_grids} 
					lg={column_detail.width_in_grids}
				>
					{ column_dict[index] }
				</Grid>
			)

		})

		return all_columns

	}


// RENDER METHOD
	render() {

		let {_xs, _sm, _md, _lg, _xl} = this.props;

		let count = 0

		return (

				<div 
					style={{
						width:this.props.containerWidth,
						margin:'auto',
						backgroundColor: this.props.containerBGcolor,
					}}
				>		
				<Grid container direction="row" style={{backgroundColor: 'none',}}>
					{this.generate_grid()}			

				</Grid>


			</div>
		);
	}
}




VerticalMasonriesContainer.defaultProps = {
	column_wise_details_list:[ 
		{ width_in_grids:3, bottom_spacing:10, leftGap:0 },
		{ width_in_grids:3, bottom_spacing:10, leftGap:10 },
		{ width_in_grids:3, bottom_spacing:10, leftGap:10 },
		{ width_in_grids:3, bottom_spacing:10, leftGap:10 },
	],


	child_addition_pattern_heights:[200, 200, 300, 200, 100, 200,],

	leftMargin:(1) * 8 / 2 ,
	// containerBGcolor:'blue',
	containerWidth:'100%',

};

export default withResponsiveness(VerticalMasonriesContainer);

// DOCSTRING 

	// CHILDREN SHOULD BE PASSED otherwise it gives ERROR, and their relevant objects in masonryListsOfLists should be present otherwise they wont be rendered. 
	// set width of each element, rather than using container width, use container width only for background color or background image pasting, mostly never
	// DOES NOT WORK IN img tag but works on image in bg in div
	//EXAMPLE:

	// <VerticalMasonriesContainer>					
		
		// <p>this 7</p>
		// <p>this 8</p>
		// <p>this 9</p>

		// <p>this 4</p>
		// <p>this 5</p>
		// <p>this 6</p>

		// <p>this 1</p>
		// <p>this 2</p>
		// <p>this 3</p>

		// <p>this 400</p>
		// <p>this 10</p>
		// <p>this 20</p>
		// <p>this 30</p>
		// <p>this 40</p>

	// </VerticalMasonriesContainer>

// OLDER VERSION 1 WITH CHILDINDEXING METHOD

	// Steps:
	// REDONE ABOVE// 1 run map over masonryListsOfLists and get internalList
	// 2 generate range of internalList 
	// 3 if its first internalList, push it as it is in masonryDetails with its index as key
	// 4 if its any other internalList, run map method on this internalList and get previous key value pair, access its last item and then add 1 to each
	// NO LONGER NEEDED !!!
		// childIndexCalculator(firstIndex, secondIndex){

		// 	// const masonryDetails = {};
		// 	// const masonryListsOfLists = this.props.masonryListsOfLists;
		// 	const masonryDetails = this.props.masonryDetails;

		// 	// masonryListsOfLists.map(
		// 	masonryDetails.map(
		// 		(internalList, index) => {
				
		// 		if (index===0){

		// 			var indicesToUse = [...Array(internalList.length).keys()];
		// 			masonryDetails[index] = indicesToUse;

		// 		} else {

		// 			var previousAssignedIndicesList = masonryDetails[index - 1];
		// 			var lastItemOfPreviousList = previousAssignedIndicesList[previousAssignedIndicesList.length -1]

		// 			var indicesToUse = [];
				
		// 			internalList.map(
					
		// 				(listElement, internal_index) => {

		// 					indicesToUse.push( internal_index + lastItemOfPreviousList + 1)

		// 				}
		// 			)
						
		// 				masonryDetails[index] = indicesToUse;

		// 			}
		// 		}
		// 	)

		// 	const locatedList = masonryDetails[firstIndex];
		// 	const locatedListElement = locatedList[secondIndex];
		// 	return locatedListElement;		

		// }




		// <div 
		// 	style={{
		// 		display:'flex',
		// 		backgroundColor: this.props.containerBGcolor,
		// 		flexDirection:'row',
		// 		// flexWrap:'wrap',
		// 		alignContents:'center',
		// 		alignItems:'center',
		// 		justifyContent:'center',
				
		// 	}}
		// >
		// 	{this.props.masonryListsOfLists.map(
				
		// 		(masonryCssList, outer_index) => (
		// 			<div
		// 				key={String(outer_index)}
		// 				style={{
		// 					display:'flex',
		// 					flexDirection:'column',
		// 					alignContents:'center',
		// 					alignItems:'center',
		// 					justifyContent:'center',
		// 					height:this.props.heightOfColumns,
		// 				}}
		// 			>
				
		// 				{masonryCssList.map(
				
		// 						(item, inner_index) => (
		// 							<div
		// 								key={String(inner_index)} 
		// 								style={{
											
		// 									flexBasis:item.flexBasis,
		// 									width:item.width,
		// 									paddingBottom:item.paddingBottom,
		// 									paddingTop:item.paddingTop, 
		// 									// marginRight:item.marginRight,
		// 									// alignSelf:'center',
		// 									marginLeft:item.marginLeft,
		// 									marginRight:item.marginRight,
		// 									backgroundColor: item.backgroundColor
		// 								}} 
		// 							> 
		// 								{this.props.children[this.childIndexCalculator(outer_index, inner_index)]}

		// 							</div>
		// 						)
		// 					)}			
				
		// 			</div>				

		// 		)
		// 	)}
		
		// </div>

// OLD VERSION 2
				// <Grid container direction="row" spacing={0} style={{backgroundColor: 'none', marginLeft:this.props.leftMargin}} >
		
				// 	{this.props.vertical_grid_details.map(

				// 		(grid_detail_item, outer_index) => (

				// 			<Grid item container direction="column" 
				// 				spacing={grid_detail_item.vertical_spacing} 
				// 				xs={12} sm={12} 
				// 				md={grid_detail_item.row_grids} 
				// 				lg={grid_detail_item.row_grids}
				// 			>
				// 				{grid_detail_item.heights.map(
				// 					(masonry_detail_item, inner_index) => (
				// 						<Grid item
				// 							style={{
				// 								height:masonry_detail_item.height
				// 							}}
				// 						>
				// 							{this.props.children[this.childIndexCalculator(outer_index, inner_index)]}
				// 						</Grid>
				// 					)
				// 				)}
				// 			</Grid>
				// 		)
				// 	)}
				// </Grid>
