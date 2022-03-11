import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from "react-router-dom";

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
	ConnectedResponsiveNavigation,
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

					<Switch>

						<Route exact path="/" render={() => (
							(this.props.isSignedIn) ? (
								<Redirect to="/blogposts"/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/signup">
							<ConnectedSignUpContainer/>
						</Route>

						<Route exact path="/login">
							<ConnectedLoginContainer/>
						</Route>

						<Route exact path="/blogposts" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedBlogPostContainer/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/blogposts/:id" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedIndividualBlogPost/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/videos" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedVideoContainer/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/videos/:id" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedIndividualVideo/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/images" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedImageContainer/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/images/:id" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<ConnectedIndividualImage/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/Bulk-Upload-Image" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<BulkImageUpload/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/Bulk-Upload-Video" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<BulkVideoUpload/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/Bulk-Upload-Blogpost" render={() => (
							(this.props.isSignedIn) ? (
								<React.Fragment>
									<div style={{width:'95%', margin:'auto'}}>
										<ConnectedResponsiveNavigation/>
									</div>
				
									<BulkBlogpostUpload/>
				
									<div style={{backgroundColor: 'black'}}>
										<ConnectedFooterContainer/>
									</div>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>



				{/* if no match was made with endpoint then redirect to sign up */}
						<Route path="/*">
							(this.props.isSignedIn) ? (
								<Redirect to="/blogposts"/>
							) : (
								<Redirect to="/login"/>
							)
						</Route>

					</Switch>

{/*					<div style={{backgroundColor: 'black'}}>
						<ConnectedFooterContainer/>
					</div>*/}

				</div>

			</Router>
		);
	}
}


export default withResponsiveness(RootRouterContainer);
// export default RootRouterContainer;