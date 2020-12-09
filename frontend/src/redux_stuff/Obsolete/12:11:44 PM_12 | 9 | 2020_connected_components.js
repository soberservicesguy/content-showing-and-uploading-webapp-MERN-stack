
import { connect } from "react-redux";
import {mapStateToProps, mapDispatchToProps} from "./store_configuration";

import {

	RootRouterContainer,

	BlogPostContainer,
	IndividualBlogPost,
	VideoContainer,
	IndividualVideo,
	ImageContainer,
	IndividualImage,	
	LoginContainer,

} from "../containers";


import {
	CreateBlogPost,
	ComponentForShowingBlogPost,
	BlogPostCard,
} from "../components/blogposts"

import {
	CreateVideo,
	ComponentForShowingVideo,
	VideoCard,
} from "../components/videos"

import {
	CreateImage,
	ComponentForShowingImage,
	ImageCard,
} from "../components/images"

import {
	CreateComment,
} from "../components/comments"

import {
	CreateComment,
} from "../components/comments"

import {
	CreateComment,
} from "../components/comments"

export const ConnectedRootRouterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RootRouterContainer);

export const ConnectedLoginContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginContainer);


export const ConnectedCreateBlogPost = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateBlogPost);

export const ConnectedBlogPostCard = connect(
	mapStateToProps,
	mapDispatchToProps
)(BlogPostCard);

export const ConnectedComponentForShowingBlogPost = connect(
	mapStateToProps,
	mapDispatchToProps
)(ComponentForShowingBlogPost);

export const ConnectedCreateComment = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateComment);

export const ConnectedCreateVideo = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateVideo);

export const ConnectedVideoCard = connect(
	mapStateToProps,
	mapDispatchToProps
)(VideoCard);

export const ConnectedComponentForShowingVideo = connect(
	mapStateToProps,
	mapDispatchToProps
)(ComponentForShowingVideo);

export const ConnectedCreateComment = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateComment);

export const ConnectedCreateImage = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateImage);

export const ConnectedImageCard = connect(
	mapStateToProps,
	mapDispatchToProps
)(ImageCard);

export const ConnectedComponentForShowingImage = connect(
	mapStateToProps,
	mapDispatchToProps
)(ComponentForShowingImage);

export const ConnectedCreateComment = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateComment);


export const ConnectedIndividualBlogPost = connect(
	mapStateToProps,
	mapDispatchToProps
)(IndividualBlogPost);

export const ConnectedBlogPostContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BlogPostContainer);



export const ConnectedIndividualVideo = connect(
	mapStateToProps,
	mapDispatchToProps
)(IndividualVideo);

export const ConnectedVideoContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(VideoContainer);



export const ConnectedIndividualImage = connect(
	mapStateToProps,
	mapDispatchToProps
)(IndividualImage);

export const ConnectedImageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ImageContainer);

