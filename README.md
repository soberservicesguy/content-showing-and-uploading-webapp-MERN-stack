# content_showing_and_uploading_webapp_MERN_stack

**Live App:**

https://content-mern-stack.herokuapp.com

**Project Details:**

'App' refers to the development version having Node backend with Express and MongoDB, along with  React frontend.
'Containers_Version' refers to the app in containers network form based on Docker Compose
'Kubernetes_Version' refers to app in the pods network form based on deployments, services and Ingress

**Note:**

Make sure to add some data in the app right after turning on any of the three forms ie simple App / Containers_Version / Kubernetes_Version so that you see the app as in app's live link


**App Features:**
	
User can sign up, select privileges, upload avatar, read blogposts and watch images and videos, upload images / blogposts / videos if privileged, also user can upload images / blogposts / videos in bulk using excel files. User can also interact with images / blogposts /videos like commenting, liking. 

Video posts are created and 4-5 snaphosts are taken and everytime that video posts is shown, different snapshot is shown with it.

Users powers are determined with the privileges he carries.


**Database:**

Anyone from MongoDB Atlas and Local MongoDB service can be used. Simply adjust the .env file with path App/backend/.env 


**Storage:**

Anyone from Local storage, AWS S3 or Google Cloud storage can be used. Simply adjust the .env file with path App/backend/.env 

**Authentication:**	

Includes jwt authentication and authorization system, as well as privileges system


**Usage:**

/login allows user to login
/signup allows user to sign up, select privileges and upload avatar
/blogposts where user is redirected once he logins, blogpost cards are shown in masonry as well as forms for creating blogpost if user is privileged
/videos video thumbnails are shown as well as forms for uploading video if user is privileged
/images images are shown in masonry as well as forms for uploading image if user is privileged
/Bulk-Upload-Image allows user to upload images in bulk along with excel file having details, if privileged
/Bulk-Upload-Video allows user to upload videos in bulk along with excel file having details, if privileged
/Bulk-Upload-Blogpost allows user to upload blogposts in bulk along with excel file having details, if privileged
