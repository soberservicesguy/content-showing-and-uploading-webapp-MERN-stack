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

import { withRouter } from "react-router-dom";


class IndividualIndividualBlogPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
	}

// RENDER METHOD
	render() {
		const { classes } = this.props;
		const {_xs, _sm, _md, _lg, _xl} = this.props

		const styles = {
			outerContainer:{
				margin:'auto',
				width:'80%'
			},


			imageContainer:{
				marginTop:30,
			},
			image:{
				width:'100%', 
				height:400, 
				resizeMode: "contain"
			},
			categoryText:{
				fontWeight:'bold',
				fontSize:20,
				marginTop:10,
				marginBottom:10,

			},
			titleText:{
				fontWeight:'bold',
				fontSize:30,
				marginTop:40,
				marginBottom:0,
			},
			initialTagsText:{
				fontSize:25,
				marginTop:0,
				color:'grey',
			},

			firstParaText:{
				fontSize:20,
				marginTop:30,
				color:'grey',
			},
			secondParaText:{
				fontSize:20,
				marginTop:30,
				color:'grey',
			},
			qoutedParaText:{
				fontSize:20,
				marginTop:50,
				color:'grey',
				borderLeftWidth:2,
				borderLeftStyle:'solid',
				borderLeftColor:'#eee',
				paddingTop:30,
				paddingBottom:30,
				paddingLeft:40,
			},
			thirdParaText:{
				fontSize:20,
				marginTop:50,
				color:'grey',				
			},
			fourthParaText:{
				fontSize:20,
				marginTop:30,
				color:'grey',				
			},
			allTagsText:{
				borderTopColor:'#eee',
				borderTopWidth:2,
				borderTopStyle:'solid',
				paddingTop:30,
				fontSize:15,
				marginTop:30,
				color:'grey',								
			}

		}

		var base64Image = "data:image/jpeg;base64," + this.props.current_blogpost.image_main
		let { id } = this.props.match.params // use in render method
		// console.log({id})

		return (
			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img 
						src={base64Image}
						// src={utils.image} 
						alt="" 
						style={styles.image}
					/>
				</div>


				<p style={styles.titleText}>
					{this.props.current_blogpost.title}
				</p>

				<p style={styles.categoryText}>
					Category: <span style={{fontWeight:'normal'}}>{this.props.current_blogpost.category}</span>
				</p>

				<p style={styles.initialTagsText}>
					{this.props.current_blogpost.initial_tags}
				</p>
				

				<p style={styles.firstParaText}>
					{this.props.current_blogpost.first_para}
				</p>
				
				
				<p style={styles.secondParaText}>
					{this.props.current_blogpost.second_para}
				</p>
				
				<p style={styles.qoutedParaText}>
					{this.props.current_blogpost.qouted_para}
				</p>
				
				<p style={styles.thirdParaText}>
					{this.props.current_blogpost.third_para}
				</p>
				
				<p style={styles.fourthParaText}>
					{this.props.current_blogpost.fourth_para}
				</p>
				
				<p style={styles.allTagsText}>
					{this.props.current_blogpost.all_tags}
				</p>
				
			</div>

		);
	}
}
	
IndividualIndividualBlogPost.defaultProps = {
	//:,
};

export default withRouter(withResponsiveness(IndividualIndividualBlogPost));


/*

title
initial_tags
first_para
second_para
qouted_para
third_para
fourth_para
all_tags
*/