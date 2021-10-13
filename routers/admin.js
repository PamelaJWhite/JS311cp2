//import express
const express = require("express")
//use express

//create a router object to handle the routes
const router = express.Router()

//import middleware
//use later
// let auth = require("../middleware/auth")

//import controllers (for admin)
controllers = require("../controllers/admin")

//establish routes
router.post("/createUser", controllers.createUser)


//------------- STORIES create, update, delete, get stories ----------------------
router.post("/stories", controllers.createStory)


router.put("/stories/:story_id", controllers.modifyStory)


router.delete("/stories/:story_id", controllers.deleteStory)


router.get("/stories", controllers.listStoriesAdmin) 


//------------ STORY SECTIONS create, update, delete ----------------
router.post("/stories/:story_id/sections", controllers.createStorySection)


router.put("/stories/sections/:section_id", controllers.modifyStorySection)


router.delete("/stories/sections/:section_id", controllers.deleteStorySection)


//---------------------- OPTIONS create, update, delete ---------------

router.post("/stories/sections/:section_id/options", controllers.createOption)


router.put("/stories/sections/options/:option_id", controllers.modifyOption)


router.delete("/stories/sections/options/:option_id", controllers.deleteOption)

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