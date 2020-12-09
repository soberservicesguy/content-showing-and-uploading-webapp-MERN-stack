
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

			children_classes:['Comment','User',],
			schemafields:
					{
						category: 'String',
						image_main: 'String',
						title: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						first_para: 'String',
						total_likes: 'String',
						total_shares: 'String',
						endpoint: 'String',
						initial_tags: 'String',
						second_para: 'String',
						qouted_para: 'String',
						third_para: 'String',
						fourth_para: 'String',
						all_tags: 'String',
						author_details: 'String',
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

					{user: `{ type: Schema.Types.ObjectId, ref: 'User' }`},

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:5,
				index:'comment_order',
				schemafields:
					{
						image_thumbnail: 'String',
						text: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						comment_order: 'Number',
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
				summarized_version_length:2,
				index:'phone_number',
				schemafields:
					{
						user_name: 'String',
						phone_number: 'String',
					},

				other_model_links:[
					{blogposts: `[{ type: Schema.Types.ObjectId, ref: 'Blog_Post'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},

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
			summarized_version_length:8,
			index:'endpoint',

			children_classes:['Comment',],
			schemafields:
					{
						category: 'String',
						image_main: 'String',
						title: 'String',
						description: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						first_para: 'String',
						total_likes: 'String',
						total_shares: 'String',
						endpoint: 'String',
						initial_tags: 'String',
						video_path: 'String',
						video_format: 'String',
						all_tags: 'String',
						uploader_details: 'String',
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

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:5,
				index:'comment_order',
				schemafields:
					{
						image_thumbnail: 'String',
						text: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						comment_order: 'Number',
					},

				other_model_links:[
					{video: `{ type: Schema.Types.ObjectId, ref: 'Video'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
		]
	},

	{
		parent:{
			react_class_name_for_component:'Individual_Image', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Image', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Image_Card',

			class_name:'Image', // first letter should be capitalized of each token and singular
			summarized_version_length:8,
			index:'endpoint',

			children_classes:['Comment',],
			schemafields:
					{
						category: 'String',
						image_source: 'String',
						title: 'String',
						description: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						total_likes: 'String',
						total_shares: 'String',
						endpoint: 'String',
						all_tags: 'String',
						uploader_details: 'String',
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

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:5,
				index:'comment_order',
				schemafields:
					{
						image_thumbnail: 'String',
						text: 'String',
						date_of_publishing: 'String',
						author_name: 'String',
						comment_order: 'Number',
					},

				other_model_links:[
					{image: `{ type: Schema.Types.ObjectId, ref: 'Image'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
		]
	},

]

module.exports = {
	components_list:components_list,
	containers_list:containers_list,
	all_schemas:all_schemas,
};
