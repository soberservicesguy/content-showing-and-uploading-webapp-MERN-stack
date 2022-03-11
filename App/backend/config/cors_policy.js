
const cors = require("cors");

let cors_policy = cors({
	origin: "https://content-mern-stack.herokuapp.com", // restrict calls to those this address
	methods: ['GET', 'POST'] // only allow GET, POST requests
})

module.exports = cors_policy
