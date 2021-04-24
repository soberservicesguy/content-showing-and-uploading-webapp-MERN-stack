# social_network_webapp_MERN_stack

**Project Details:**

'App' refers to the development version having Node backend with Express and MongoDB, along with  React frontend.
'Containers_Version' refers to the app in containers network form based on Docker Compose
'Kubernetes_Version' refers to app in the pods network form based on deployments, services and Ingress

**Note:**

Make sure to add some data in the app right after turning on any of the three forms ie simple App / Containers_Version / Kubernetes_Version so that you see the app as in app's live link


**App Features:**
	
User can sign up, select privileges, upload avatar, add friends, create written posts, image posts, video posts. User can also interact with posts from friends, send and accept friend requests, like / comment  / share posts of friends.

Video posts are created and 4-5 snaphosts are taken and everytime that video posts is shown, different snapshot is shown with it.

Every post has different visual way of showing

User can like, comment on books, pages, sports etc

User can upload advertisements if privileged.

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
user can create posts here such as simple written post, post with  image, post with video
notification bell shows notifications of friends activities
settings icon allows user to set his personal details including cover image
/socialposts where user is redirected once he logins, shows posts from friends at center, pages suggestions along friends suggestions at left, and advertisement at right
/settings allows user to upload cover image, and enter his details to show
/about-me shows users own personal details, along with friends and pages and books liked
/books allows user to create or like books
/pages allows user to create or like pages
/sports allows user to create or like sports
