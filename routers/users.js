//import express
const express = require("express")
//use express

//create a router object to handle the routes
const router = express.Router()

//import middleware
//use later
// let auth = require("../middleware/auth")

//import controllers (for users)
controllers = require("../controllers/users")

//establish routes

//login, no authorizations
router.post("./login", function(req, res){
    console.log("You made it to login()")
})
//export router object so routes can be used elsewhere in the code
module.exports = router
