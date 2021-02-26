import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";

import {
	MyResponsiveNavigation,
} from "./"

// IMPORT CONNECTED CONTAINERS
import {
	ConnectedLoginContainer,
	ConnectedSignUpContainer,
	ConnectedBlogPostContainer,
	ConnectedIndividualBlogPost,
	ConnectedVideoContainer,
	ConnectedIndividualVideo,
	ConnectedImageContainer,
	ConnectedIndividualImage,
	ConnectedFooterContainer,
} from "../redux_stuff/connected_components";

import {
	BulkImageUpload,
	BulkVideoUpload,
	BulkBlogpostUpload,
} from "../components/"

// IMPORT material-ui stuff
import { withStyles } from '@material-ui/styles';
import { Grid, Button } from "@material-ui/core";
// IMPORT responsiveness hook
import withResponsiveness from "../responsiveness_hook";



class RootRouterContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorEl:null,
			mobileMoreAnchorEl:null,
		}

	}

	render() {

		const styles = {

		}

		const classes = {

		}

		return (
			<Router>
				<div>
					<div style={{width:'95%', margin:'auto'}}>
						<MyResponsiveNavigation/>
					</div>

					<Switch>

						<Route exact path="/signup">
							<ConnectedSignUpContainer/>
						</Route>

						<Route exact path="/login">
							<ConnectedLoginContainer/>
						</Route>


						<Route exact path="/blogposts">
							<ConnectedBlogPostContainer/>
						</Route>

						<Route exact path="/blogposts/:id">
							<ConnectedIndividualBlogPost/>
						</Route>


						<Route exact path="/videos">
							<ConnectedVideoContainer/>
						</Route>

						<Route exact path="/videos/:id">
							<ConnectedIndividualVideo/>
						</Route>


						<Route exact path="/images">
							<ConnectedImageContainer/>
						</Route>


						<Route exact path="/images/:id">
							<ConnectedIndividualImage/>
						</Route>


						<Route path="/Bulk-Upload-Image">
							<BulkImageUpload/>
						</Route>


						<Route path="/Bulk-Upload-Video">
							<BulkVideoUpload/>
						</Route>


						<Route path="/Bulk-Upload-Blogpost">
							<BulkBlogpostUpload/>
						</Route>


				{/* if no match was made with endpoint then redirect to sign up */}
						<Route path="/*">
							<ConnectedSignUpContainer/>
						</Route>

					</Switch>

					<div style={{backgroundColor: 'black'}}>
						<ConnectedFooterContainer/>
					</div>

				</div>

			</Router>
		);
	}
}


export default withResponsiveness(RootRouterContainer);
// export default RootRouterContainer;