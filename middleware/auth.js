const userControllers = require("../controllers/users")
const adminControllers  = require("../controllers/admin")

const jwt = require("jsonwebtoken")

//middleware functions here:

//all my admin functions should have this isAdmin middleware function
let isAdmin = function(req, res, next){
    
    console.log("inside the auth.js file, isAdmin")

    //---------this first section is set up just to get through "for free"-----
    //just to make sure the routes are going through this function
    next()
    //---------------------------------------------------------------------

    // this next section is the real code:
    // if(req.isAdmin){
    //     next()
    // }else {
    //     res.status(401.).send("Unauthorized")
    // }
}

// put this function in as a parameter in the route 
// for all routes where a user needs to be logged in to access them
let checkJwt = function(req, res, next){
    //gatekeeper prints a message, nothing else
    console.log("inside the auth.js file, checkJwt()")

    // //-----this first section is set up just to get through "for free"----
    //just to make sure the routes are going through this function
    next()
    // //-------------------------------------------------------------------

    // //this next section will actually do the work
    // //this is working! (login, copy token, paste to header, attempt to create user = works)

    // //read the token from the header
    // let token;
    // //if the request has authorization in the header
    // console.log("req.headers.authorization: ", req.headers.authorization)
    // if(req.headers.authorization){
    //     token = req.headers.authorization
    //     // //take it apart
    //     // let bearer = req.headers.authorization.split(" ")
    //     // //save the second part of the authorization, the second element in the array, as the token
    //     // token = bearer[1]
    // } else {
    //     token = null
    // }
    // //if the token is not valid, there is nothing to check
    // if(!token){
    //     return res.status(401).send("Unauthorized")
    // }
    // //verify token
    // jwt.verify(token, process.env.jwtSecret, (err, decoded) =>{
    //     if(err) {
    //         console.log("Did not veryfy jwt", err)
    //         return res.status(401).send("Unauthorized")
    //     }
    //     //for a valid token
    //         //store the username from the token in the request
    //         //so that it is available to everyone following this call
    //     console.log(decoded)
    //     req.username = decoded.username
    //     req.isAdmin = decoded.role == 'admin'
    //     next()
    // })
}


module.exports = {
    checkJwt,
    isAdmin
}