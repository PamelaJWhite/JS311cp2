//import express
const express = require("express")
//use express

//create a router object to handle the routes
const router = express.Router()

//import middleware
let auth = require("../middleware/auth")

//import controllers (for admin)
controllers = require("../controllers/admin")

//establish routes
// router.post("/createUser", [auth.checkJwt, auth.isAdmin], controllers.createUser)
//changed route to exclude auth checks so anyone can create a login
router.post("/createUser", controllers.createUser)



//------------- STORIES create, update, delete, get stories ----------------------
//route to create a story title and add it to the db
router.post("/stories", [auth.checkJwt, auth.isAdmin], controllers.createStory)

//route to modify a story title
router.put("/stories/:story_id", [auth.checkJwt, auth.isAdmin], controllers.modifyStory)

//route to delete a story title; will only delete if sections have yet to be created
router.delete("/stories/:story_id", [auth.checkJwt, auth.isAdmin], controllers.deleteStory)

//route to see the list of all stories
router.get("/stories", [auth.checkJwt, auth.isAdmin], controllers.listStoriesAdmin) 


//------------ STORY SECTIONS create, update, delete ----------------

//create a story section
router.post("/stories/:story_id/sections", [auth.checkJwt, auth.isAdmin], controllers.createStorySection)

//modify a story section
router.put("/stories/sections/:section_id", [auth.checkJwt, auth.isAdmin], controllers.modifyStorySection)

//add route to assign first story section to a title/ story
router.put("/stories/:story_id/connectStart/:section_id", [auth.checkJwt, auth.isAdmin], controllers.connectStartStorySection)

//route to delete a story section (eventually)
router.delete("/stories/sections/:section_id", [auth.checkJwt, auth.isAdmin], controllers.deleteStorySection)


//---------------------- OPTIONS create, update, delete ---------------

//route to create options for a story section
router.post("/stories/sections/:section_id/options", [auth.checkJwt, auth.isAdmin], controllers.createOption)

//route to modify an option
router.put("/stories/sections/options/:option_id", [auth.checkJwt, auth.isAdmin], controllers.modifyOption)

//route to link an option to its resulting story section 
//cannot be done during original creation, because the next story section may not be created yet
router.put("/stories/:option_id/connectOption/:resulting_section_id", [auth.checkJwt, auth.isAdmin], controllers.connectOption)

//route to delete an option (eventually)
router.delete("/stories/sections/options/:option_id", [auth.checkJwt, auth.isAdmin], controllers.deleteOption)

//------------- SEE A WHOLE STORY -------
//route to see a whole story
//I'm just leaving these notes in here
//they're mostly my brainstorming about how this might work
//I also tried to "see" what a story would look like as an opject in the notes.js file
//parameters needed labeled with 
//grab the title from Stories table by the story_id
//create an object with the "title" as the first key and the title as its value??
//grab the start_story_section_id from the Stories table by the story_id
//save this somewhere? in the object that holds the title?
//grab the story_section_content from the StorySections table where the start_story_section_id from Stories table matches the story_section_id from StorySections table
//grab all the option_content rows from SectionOptions table where the story_section_id from SectionOptions matches the story_section_id from StorySections
//so far, you'd likely have title, story section, and three(ish) options
//save those option_content rows in an array
//for each in option_content in the array grab the resulting_story_sections_id from SectionOptions table where the 
router.get("/stories/wholeStory/:story_id", controllers.seeWholeStory)

//export router object so routes can be used elsewhere in the code
module.exports = router