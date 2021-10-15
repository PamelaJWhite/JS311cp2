//import express
const express = require("express")
//use express

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

// GET /myStories/list/:user_story_id/:user_id
// See their own list of stories
// By grabbing all the stories with that userId from the UserStory table
// But the UserStory table is only numbers (ids)
// I’ll need to reference the story_id from the Stories table
// In order to get the title 
// Or should I add a title column to the UserStory table so it’s always available? I don’t think so, simpler is better?
router.get("/myStories/list/:user_id:user_id", auth.checkJwt, controllers.seeMyList)

// DELETE /myStories/:user_story_id
// Grab a story on the user’s list
// By the user_story_id in the UserStory table
// And delete it
router.delete("/myStories/delete/:user_story_id", auth.checkJwt, controllers.deleteFromList)

// POST /myStories/read/:story_section_id
// Get the first story section by the story_section_id
// Right now, it seems I’m leaving it to the front end to figure out how to get the correct story_section_id
// I think I need a route or an option within an admin route to connect a specific story_section_id from the StorySections table and add a start_story_section_id (that same id) to the 
// But I have to get something done, so i need to leave this for now
// Add it to the CompleteStory table
// The database is getting updated as the user reads the story and makes choices
// Read the story section
router.post("/myStories/read/:story_section_id", auth.checkJwt, controllers.readStorySection)

// GET /myStories/options/
// Use the story_section_id from the StorySections table
// See choices
// By grabbing all the rows in the Options table
    //query parameters
// That match the storySectionId
router.get("/myStories/options", auth.checkJwt, controllers.seeOptions)

// POST /myStories/options/:storyOptionId
// Make a choice/ continue
// Adds the chosen option to the user’s CompleteStory table
// And leads to the next storySection… how??
router.post("/myStories/options/:storyOptionId", auth.checkJwt, controllers.chooseOption)

// GET /myStories/completeStory/:user_story_id??
// Grab all the rows in the CompleteStory table
// That match the userStoryIds - plural. This will be several rows. 
// And present them all in order (i.e., the order in which they were added to the table)
router.get("/myStories/completeStory/:user_story_id", auth.checkJwt, controllers.seeCompleteStory)

//export router object so routes can be used elsewhere in the code
module.exports = router
