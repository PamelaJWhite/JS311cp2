//import express
const express = require("express")
//use express

//I added these three lines to fix the cors problem
var cors = require('cors')
var app = express()
app.use(cors())

//create a router object to handle the routes
const router = express.Router()

//import middleware
let auth = require("../middleware/auth")

//import controllers (for users)
controllers = require("../controllers/users")

//establish routes
// POST /login
router.post("/login", controllers.login)

// GET /stories/read
// See list of all stories
router.get("/stories/read", auth.checkJwt, controllers.getAllStories)


// POST /stories/:story_id/myStories/:user_id
//add story to user list
router.post("/stories/:story_id/myStories/:user_id", auth.checkJwt, controllers.addToList)

// GET /myStories/list/:user_id
// See their own list of stories
router.get("/myStories/list/:user_id", auth.checkJwt, controllers.seeMyList)

// DELETE /myStories/:user_story_id
//Delete a story title from a user's list
router.delete("/myStories/delete/:user_story_id", auth.checkJwt, controllers.deleteFromList)

// POST /myStories/readFirst/user_story_id
//read the first story section and add it to CompleteStory
router.post("/myStories/readFirst/:user_story_id", auth.checkJwt, controllers.readFirstStorySection)

//POST /myStories/read/:user_story_id/:resulting_story_sectionId
router.post("/myStories/read/:user_story_id/:resulting_story_section_id", auth.checkJwt, controllers.readNextSection)

// POST /myStories/options/:story_sectin_id
// see all options
router.post("/myStories/options/:story_section_id", auth.checkJwt, controllers.seeOptions)

// POST /myStories/options/user_story_id/:option_id
//add chosen option to userstory table 
router.post("/myStories/options/:user_story_id/:option_id", auth.checkJwt, controllers.chooseOption)

// GET /myStories/completeStory/:user_story_id??
// Grab all the rows in the CompleteStory table
// That match the userStoryIds - plural. This will be several rows. 
// And present them all in order (i.e., the order in which they were added to the table)
router.get("/myStories/completeStory/:user_story_id", auth.checkJwt, controllers.seeCompleteStory)

//export router object so routes can be used elsewhere in the code
module.exports = router
