
import { persistStore, persistReducer } from 'redux-persist' 
import storage from 'redux-persist/lib/storage'

import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import { connect } from "react-redux";
import { combineReducers } from 'redux'; 


// IMPORT rootSaga
import {rootSaga} from "../saga_stuff/saga_combined";

import {
	reducerJWT,
	reducerForBlogPost,
	reducerForComment,
	reducerForUser,
	reducerForVideo,
	// reducerForComment,
	reducerForImage,
	// reducerForComment,
} from "./reducers"

export const rootReducer = combineReducers({
	blogpostReducer: reducerForBlogPost,
	comments: reducerForComment,
	users: reducerForUser,
	videos: reducerForVideo,
	// comments: reducerForComment,
	images: reducerForImage,
	// comments: reducerForComment,
});

export const mapStateToProps = state => {
  return {

	total_blogposts: state.blogpostReducer.totalBlogPost,
	current_blogpost: state.blogpostReducer.currentBlogPost,

	userToken: state.users.userToken,
	isSignedIn: state.users.isSignedIn,
	user_name: state.users.user_name,
	phone_number: state.users.phone_number,
	total_videos: state.videos.totalVideo,
	current_video: state.videos.currentVideo,

	total_images: state.images.totalImage,
	current_image: state.images.currentImage,

	};
};

export const mapDispatchToProps = dispatch => {
	return {

		set_current_blogpost: (current_blogpost) => dispatch( { type: "SET_CURRENT_BLOGPOST", current_blogpost:current_blogpost } ),
		set_fetched_blogposts: (blogpost_list) => dispatch( { type: "SET_FETCHED_BLOGPOST", blogpost_list: blogpost_list } ),
		set_fetched_10_more_blogpost: (blogpost_list) => dispatch( { type: "SET_FETCHED_10_MORE_BLOGPOST", blogpost_list: blogpost_list } ),

		add_comment_to_blogpost: (blogpost_id, comment_object) => dispatch( { type: "ADD_COMMENT_TO_BLOGPOST", blogpost_id: blogpost_id, comment_object: comment_object } ),
		remove_comment_from_blogpost: (blogpost_id, comment_object, comment_id) => dispatch( { type: "REMOVE_COMMENT_FROM_BLOGPOST", blogpost_id: blogpost_id, comment_object: comment_object, comment_id: comment_id } ),
		set_is_signed_in: (booleon) => dispatch( { type:"SET_IS_SIGNED_IN", booleon: booleon } ),
		set_user_token: (token) => dispatch( { type:"SET_USER_TOKEN", token: token } ),

		set_user_name: (user_name) => dispatch( { type: "SET_USER_NAME", user_name: user_name} ),
		remove_user_name: () => dispatch( { type: "REMOVE_USER_NAME" } ),
		set_phone_number: (phone_number) => dispatch( { type: "SET_PHONE_NUMBER", phone_number: phone_number} ),
		remove_phone_number: () => dispatch( { type: "REMOVE_PHONE_NUMBER" } ),

		set_current_video: (current_video) => dispatch( { type: "SET_CURRENT_VIDEO", current_video:current_video } ),
		set_fetched_videos: (video_list) => dispatch( { type: "SET_FETCHED_VIDEO", video_list: video_list } ),
		set_fetched_10_more_video: (video_list) => dispatch( { type: "SET_FETCHED_10_MORE_VIDEO", video_list: video_list } ),

		add_comment_to_video: (video_id, comment_object) => dispatch( { type: "ADD_COMMENT_TO_VIDEO", video_id: video_id, comment_object: comment_object } ),
		remove_comment_from_video: (video_id, comment_object, comment_id) => dispatch( { type: "REMOVE_COMMENT_FROM_VIDEO", video_id: video_id, comment_object: comment_object, comment_id: comment_id } ),

		set_current_image: (current_image) => dispatch( { type: "SET_CURRENT_IMAGE", current_image:current_image } ),
		set_fetched_images: (image_list) => dispatch( { type: "SET_FETCHED_IMAGE", image_list: image_list } ),
		set_fetched_10_more_image: (image_list) => dispatch( { type: "SET_FETCHED_10_MORE_IMAGE", image_list: image_list } ),

		add_comment_to_image: (image_id, comment_object) => dispatch( { type: "ADD_COMMENT_TO_IMAGE", image_id: image_id, comment_object: comment_object } ),
		remove_comment_from_image: (image_id, comment_object, comment_id) => dispatch( { type: "REMOVE_COMMENT_FROM_IMAGE", image_id: image_id, comment_object: comment_object, comment_id: comment_id } ),

	};

};

const sagaMiddleWare = createSagaMiddleware();

const persistConfig = {
	key: 'root',
	storage,
	blacklist: [
			'total_blogposts',
			'current_blogpost',
			'total_videos',
			'current_video',
			'total_images',
			'current_image',
	],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleWare));
export const persistor = persistStore(store)

sagaMiddleWare.run(rootSaga);