
const components_list = ['React_Component_1',]
const containers_list = ['React_Grid',]

	
const all_schemas = [
	
	{
		parent:{
			react_class_name_for_component:'Individual_Blog_Post', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Blog_Post', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Blog_Post_Card',

			class_name:'BlogPost', // first letter should be capitalized of each token and singular
			summarized_version_length:6,
			index:'endpoint',

			children_classes:['Comment','Like','User',],
			schemafields:
					{
						category: 'String',
						image_main: 'String',
						title: 'String',
						date_of_publishing: 'String',
						initial_tags: 'String',
						endpoint: 'String',
						first_para: 'String',
						second_para: 'String',
						qouted_para: 'String',
						third_para: 'String',
						fourth_para: 'String',
						all_tags: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [
					{
						set_collection_name: 'Fashion Blogs',
						category: 'Fashion',
					},

					{
						set_collection_name: 'Food Blogs',
						category: 'Food',
					},

					{
						set_collection_name: 'Travel Blogs',
						category: 'Travel',
					},

					{
						set_collection_name: 'Lifestyle Blogs',
						category: 'Lifestyle',
					},

					{
						set_collection_name: 'Fitness Blogs',
						category: 'Fitness',
					},

					{
						set_collection_name: 'DIY Blogs',
						category: 'DIY',
					},
],

			linked_object_and_live_object_in_redux: 'User',

			other_model_links:[
	
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment' }]`},

					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like' }]`},

					{user: `{ type: Schema.Types.ObjectId, ref: 'User' }`},

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'comment_order',
				schemafields:
					{
						text: 'String',
						commenting_timestamp: 'String',
					},

				other_model_links:[
					{blogpost: `{ type: Schema.Types.ObjectId, ref: 'BlogPost'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_Like', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Like', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Like_Card',
				class_name:'Like', // first letter should be capitalized of each token and singular
				summarized_version_length:1,
				index:'time_of_liking',
				schemafields:
					{
						timestamp_of_liking: 'String',
					},

				other_model_links:[
					{blogpost: `{ type: Schema.Types.ObjectId, ref: 'BlogPost'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_User', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'User', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'User_Card',
				class_name:'User', // first letter should be capitalized of each token and singular
				summarized_version_length:3,
				index:'phone_number',
				schemafields:
					{
						user_name: 'String',
						phone_number: 'String',
						user_image: 'String',
						hash: 'String',
						salt: 'String',
					},

				other_model_links:[
					{blogposts: `[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},

				],
			
				linked_object_and_live_object_in_redux: '',
			},				
	
		]
	},

	{
		parent:{
			react_class_name_for_component:'Individual_Video', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Video', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Video_Card',

			class_name:'Video', // first letter should be capitalized of each token and singular
			summarized_version_length:5,
			index:'endpoint',

			children_classes:['Comment','Like','User',],
			schemafields:
					{
						category: 'String',
						image_thumbnail: 'String',
						video_filename: 'String',
						title: 'String',
						endpoint: 'String',
						description: 'String',
						timestamp_of_uploading: 'String',
						all_tags: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [
					{
						set_collection_name: 'Film & Animation Videos',
						category: 'Film & Animation',
					},

					{
						set_collection_name: 'Autos & Vehicles Videos',
						category: 'Autos & Vehicles',
					},

					{
						set_collection_name: 'Pets & Animals Videos',
						category: 'Pets & Animals',
					},

					{
						set_collection_name: 'Sports Videos',
						category: 'Sports',
					},

					{
						set_collection_name: 'Travel & Events Videos',
						category: 'Travel & Events',
					},

					{
						set_collection_name: 'Entertainment Videos',
						category: 'Entertainment',
					},
],

			linked_object_and_live_object_in_redux: 'User',

			other_model_links:[
	
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment' }]`},

					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like' }]`},

					{user: `{ type: Schema.Types.ObjectId, ref: 'User' }`},

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'comment_order',
				schemafields:
					{
						text: 'String',
						commenting_timestamp: 'String',
					},

				other_model_links:[
					{video: `{ type: Schema.Types.ObjectId, ref: 'Video'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_Like', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Like', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Like_Card',
				class_name:'Like', // first letter should be capitalized of each token and singular
				summarized_version_length:1,
				index:'time_of_liking',
				schemafields:
					{
						timestamp_of_liking: 'String',
					},

				other_model_links:[
					{video: `{ type: Schema.Types.ObjectId, ref: 'Video'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_User', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'User', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'User_Card',
				class_name:'User', // first letter should be capitalized of each token and singular
				summarized_version_length:3,
				index:'phone_number',
				schemafields:
					{
						user_name: 'String',
						phone_number: 'String',
						user_image: 'String',
						hash: 'String',
						salt: 'String',
					},

				other_model_links:[
					{blogposts: `[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},
					{videos: `[{ type: Schema.Types.ObjectId, ref: 'Video'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},

				],
			
				linked_object_and_live_object_in_redux: '',
			},				
	
		]
	},

	{
		parent:{
			react_class_name_for_component:'Individual_Image', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Image', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Image_Card',

			class_name:'Image', // first letter should be capitalized of each token and singular
			summarized_version_length:4,
			index:'endpoint',

			children_classes:['Comment','Like','User',],
			schemafields:
					{
						category: 'String',
						image_source: 'String',
						title: 'String',
						endpoint: 'String',
						timestamp_of_uploading: 'String',
						description: 'String',
						all_tags: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [
					{
						set_collection_name: 'Animals Images',
						category: 'Animals',
					},

					{
						set_collection_name: 'Architecture Images',
						category: 'Architecture',
					},

					{
						set_collection_name: 'Food Images',
						category: 'Food',
					},

					{
						set_collection_name: 'Sports Images',
						category: 'Sports',
					},

					{
						set_collection_name: 'Travel Images',
						category: 'Travel',
					},

					{
						set_collection_name: 'Nature Images',
						category: 'Nature',
					},
],

			linked_object_and_live_object_in_redux: 'User',

			other_model_links:[
	
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment' }]`},

					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like' }]`},

					{user: `{ type: Schema.Types.ObjectId, ref: 'User' }`},

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'comment_order',
				schemafields:
					{
						text: 'String',
						commenting_timestamp: 'String',
					},

				other_model_links:[
					{image: `{ type: Schema.Types.ObjectId, ref: 'Image'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_Like', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Like', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Like_Card',
				class_name:'Like', // first letter should be capitalized of each token and singular
				summarized_version_length:1,
				index:'time_of_liking',
				schemafields:
					{
						timestamp_of_liking: 'String',
					},

				other_model_links:[
					{image: `{ type: Schema.Types.ObjectId, ref: 'Image'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_User', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'User', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'User_Card',
				class_name:'User', // first letter should be capitalized of each token and singular
				summarized_version_length:3,
				index:'phone_number',
				schemafields:
					{
						user_name: 'String',
						phone_number: 'String',
						user_image: 'String',
						hash: 'String',
						salt: 'String',
					},

				other_model_links:[
					{blogposts: `[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},
					{videos: `[{ type: Schema.Types.ObjectId, ref: 'Video'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},
					{images: `[{ type: Schema.Types.ObjectId, ref: 'Image'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},

				],
			
				linked_object_and_live_object_in_redux: '',
			},				
	
		]
	},

]

module.exports = {
	components_list:components_list,
	containers_list:containers_list,
	all_schemas:all_schemas,
};
