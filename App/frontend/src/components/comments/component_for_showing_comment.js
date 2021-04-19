
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


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

		const styles = {
			outerContainer:{
				width:'70%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				alignItems:'center',
				backgroundColor: '#eee',
				borderBottomWidth:1,
				borderBottomColor:'black',
				borderBottomStyle:'solid',
				paddingBottom:20,
				marginBottom:20,
			},

			usernameText:{
				fontSize:20,
				fontWeight:'bold',
			},
			commentText:{
				fontSize:20,
				color:'grey'
			},

			imageContainer:{
				flex:1
			},
			commentContainer:{
				flex:5
			},
		}

		const data = this.props.componentData // data being plugged from parent flatlist
		// console.log('COMMENT')
		// console.log(data)

		var base64Image = "data:image/jpeg;base64," + data.user_image
		return (
			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img src={base64Image} alt="" 
						style={{
							width:100, 
							height:100, 
							resizeMode: "contain",
							borderRadius: 100/2,
						}}
					/>
				</div>
			
			
				<div style={styles.commentContainer}>
					<p style={styles.usernameText}>
						{data.user_name}
					</p>					

					<p style={styles.commentText}>
						{data.comment_text}
					</p>
				</div>
			
			</div>
		);
	}
				// <p>
				// 	{ data.commenting_timestamp }
				// </p>
}
	
ComponentForShowingComment.defaultProps = {

};

// export default ComponentForShowingComment; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingComment)