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
// POST /login
// Login
//no authorizations (yet?)
router.post("/login", controllers.login)

//I haven't checked any of these:
//not sure about the routes!

// //user chooses stories to add to their myStories list
// router.post("/myStories/add/:id", function(req, res){
//     console.log("in user function chooseStory()")
//     res.json("you made it to chooseStory()")
//     //given the story id
//     //adds a story to a specific user's story list
// })

// //users see all the stories they have chosen
// router.get("/stories/myStories", function(req, res){
//     console.log("in function to list stories for users myStories()")
//     res.json("this will be a list of stories the user has chosen")
// })

//export router object so routes can be used elsewhere in the code
module.exports = router
