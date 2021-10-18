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
router.post("/createUser", [auth.checkJwt, auth.isAdmin], controllers.createUser)


//------------- STORIES create, update, delete, get stories ----------------------
router.post("/stories", [auth.checkJwt, auth.isAdmin], controllers.createStory)


router.put("/stories/:story_id", [auth.checkJwt, auth.isAdmin], controllers.modifyStory)


router.delete("/stories/:story_id", [auth.checkJwt, auth.isAdmin], controllers.deleteStory)


router.get("/stories", [auth.checkJwt, auth.isAdmin], controllers.listStoriesAdmin) 


//------------ STORY SECTIONS create, update, delete ----------------

//create a story section
router.post("/stories/:story_id/sections", [auth.checkJwt, auth.isAdmin], controllers.createStorySection)

//modify a story section
router.put("/stories/sections/:section_id", [auth.checkJwt, auth.isAdmin], controllers.modifyStorySection)

//add route to assign first story section to a title/ story
router.put("/stories/:story_id/connectStart/:section_id", [auth.checkJwt, auth.isAdmin], controllers.connectStartStorySection)


router.delete("/stories/sections/:section_id", [auth.checkJwt, auth.isAdmin], controllers.deleteStorySection)


//---------------------- OPTIONS create, update, delete ---------------

router.post("/stories/sections/:section_id/options", [auth.checkJwt, auth.isAdmin], controllers.createOption)


router.put("/stories/sections/options/:option_id", [auth.checkJwt, auth.isAdmin], controllers.modifyOption)

//route to link an option to its resulting story section 
//cannot be done during original creation, because the next story section may not be created yet
router.put("/stories/:section_id/connectOption/:option_id", [auth.checkJwt, auth.isAdmin], controllers.connectOption)


router.delete("/stories/sections/options/:option_id", [auth.checkJwt, auth.isAdmin], controllers.deleteOption)

//------------- SEE A WHOLE STORY -------
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


//export router object so routes can be used elsewhere in the code
module.exports = router