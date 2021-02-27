
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
	SignUpContainer,
	FooterContainer,
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
	CreateCommentForBlogpost,
} from "../components/comments"

import {
	CreateCommentForVideo,
} from "../components/comments"

import {
	CreateCommentForImage,
} from "../components/comments"

import {
	CreateLikeForBlogpost,
} from "../components/likes"

import {
	CreateLikeForVideo,
} from "../components/likes"

import {
	CreateLikeForImage,
} from "../components/likes"


export const ConnectedFooterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FooterContainer);


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

export const ConnectedCreateCommentForBlogpost = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateCommentForBlogpost);

export const ConnectedCreateCommentForImage = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateCommentForImage);

export const ConnectedCreateCommentForVideo = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateCommentForVideo);

export const ConnectedCreateLikeForBlogpost = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateLikeForBlogpost);

export const ConnectedCreateLikeForImage = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateLikeForImage);

export const ConnectedCreateLikeForVideo = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateLikeForVideo);

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

export const ConnectedSignUpContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUpContainer);

