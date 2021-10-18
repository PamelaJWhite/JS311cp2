let db = require("../db/db")

//use bcrypt
const bcrypt = require("bcrypt")

//use jsonwebtoken
const jwt = require("jsonwebtoken")

const createUser = function(req, res){
    console.log("Hey there, createUser()")

    //will need: user_name, password, confirmPassword, email, and role to create a user
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    let email = req.body.email
    let role = req.body.role

     //make sure the passwords are the same
     if(password !== confirmPassword){
        return res.status(400).send("Passwords do not match, you dolt")
    } else {
        console.log("passwords match!")
    }

    //create and store the hashed password from the password provided by the user
    let passwordHash = bcrypt.hashSync(password, 10)

    //add four things into the user table, values set to ?
    let sql = "INSERT INTO Users(user_name, password_hash, email, role) values(?, ?, ?, ?);"

    //array as second parameter = the four ? values
    db.query(sql, [username, passwordHash, email, role], (err, rows)=> {
        //if the insert query returned an error, we log the error
        //and return a failed message back

        if(err){
            console.error("failed to add user", err)
            res.status(500).send("failed to add user")
        } else {
            //if the inster statement ran without an error, then the user was created
            console.log("user created")
            res.json(rows);
        }
    })
}



//------------------ STORIES functions ------------------------------
const createStory = function(req, res){
    console.log("createStory() controller function")
    //a story needs a title
    //the story_id will be autocreated/ incremented
    //grab the title that from req body
    let title = req.body.title
    console.log("Title received: ", title)

    if(!title){
        return res.status(400).send("Need a title to proceed")
    }

    let sql = `INSERT INTO stories(title) values(?)`
    //Need to disallow where title already exists
    console.log(sql)
    db.query(sql, title, (err, rows)=> {
    //     //if the insert query returned an error, we log the error
    //     //and return a failed message back
        if(err){
            console.error("failed to add story", err)
            res.status(500).send("failed to add story title")
        } else {
            //if the insert statement ran without an error, then the user was created
            console.log("created story:", rows)
            res.json(rows);
        }
    })
}

const modifyStory = function(req, res){
    console.log("function to update a story that has already been created modifyStory()")
     //grab the title that from req body
     let title = req.body.title
     console.log("Want to change the title to: ", title)
     //need to grab the story_id from the parameters?
     let story_id = req.params.story_id
     console.log(story_id)

    let sql = `UPDATE stories SET title= ? WHERE story_id = ?;`
    //Need to disallow where title already exists
    //couldn't quickly figure out how to modify a column :/
    
     db.query(sql, [title, story_id], function(err, rows) {

         if(err){
             console.error("failed to update story", err)
             res.status(500).send("failed to update story")
         } else {
             //if the insert statement ran without an error, then the user was created
             console.log("updated title:", rows)
             res.json(rows);
         }
     })
}

const deleteStory = function(req, res){
    console.log("function to delete a whole story deleteStory()")
    let story_id = req.params.story_id
     console.log(story_id)

    let sql = `DELETE FROM stories WHERE story_id = ?;`
    //but what about the story sections and options attached to this story?
    //this just deletes the title
    //and it can only delete a title if there is no content attached to it (i.e., if it is not a parent)
     console.log(sql)
     db.query(sql, story_id, function(err, rows) {
         if(err){
             console.error("failed to delete story", err)
             res.status(500).send("failed to update story")
         } else {
             console.log("deleted story:", rows)
             res.json(rows);
         }
     })
}

const listStoriesAdmin = function(req, res){
    console.log("in function to list stories for admin listStoriesAdmin()")
    let sql = `SELECT * FROM stories`
    
     db.query(sql, function(err, rows) {
         if(err){
             console.error("failed to get story titles", err)
             res.status(500).send("failed to get story titles")
         } else {
             console.log("here are the stories", rows)
             res.json(rows);
         }
     })

}


//------------------------ STORY SECTIONS functions -----------------------------
const createStorySection = function(req, res){
    console.log("in function to create a story section createStorySection()")
    let story_section_content = req.body.story_section_content
    let story_id = req.params.story_id
    let sql = `INSERT INTO storysections(story_section_content, story_id) VALUES(?, ?)`
    //somehow need to identify and assign the first story section. This function or a separate route? I think the latter
    db.query(sql, [story_section_content, story_id], function(err, rows) {
        //     //if the insert query returned an error, we log the error
        //     //and return a failed message back
            if(err){
                console.error("failed to add story section", err)
                res.status(500).send("failed to add story section")
            } else {
                //if the insert statement ran without an error, then the user was created
                //there's a key called insertId in the rows object that's returned that I think I'd like to get here
                console.log("added story section", rows)
                res.json(rows);
            }
        })
}

const modifyStorySection = function(req, res){
    console.log("in function to update a story section modifyStorySection()")
    let story_section_content = req.body.story_section_content
    let section_id = req.params.section_id
    let sql = `UPDATE storysections SET story_section_content = ? WHERE story_section_id = ? ;`
   
     db.query(sql, [story_section_content, section_id], function(err, rows) {
            if(err){
                console.error("failed to add story section", err)
                res.status(500).send("failed to add story section")
            } else {
                console.log("added story section", rows)
                res.json(rows);
            }
        })

}

//after creating the first section of a story
//link it to the story_id in the stories
const connectStartStorySection = function(req, res){
    console.log("connect the start story section to the story connectStartStorySection()")
    let storyId = req.params.story_id
    let sectionId = req.params.section_id
    let sql = `UPDATE stories SET start_story_section_id = ? WHERE story_id = ?`
    db.query(sql, [sectionId, storyId], function(err, rows){
        if(err){
        console.error("failed to connect first story section", err)
        res.status(500).send("failed to connect start story section")
        } else {
        console.log("connected story section", rows)
        res.json(rows);
        }
    })
}
const deleteStorySection = function(req, res){
    console.log("in function to delete a story section deleteStorySection()")
    //I'm really concerned about this, because if you delete a story section, it will mess up the whole story
    //I'm not sure I want you to be able to delete, but instead only modify
    //I'll come back to this after I work on the user routes
    res.json("you made it to deleteStorySection() controllers")

}


//------------------------ OPTIONS functions -----------------------------
const createOption = function(req, res){
    console.log("in function to create an option createOption()")
    let option_content = req.body.option_content
    let section_id = req.params.section_id
    let sql = `INSERT INTO sectionoptions(option_content, story_section_id) VALUES(? , ? )`
   
    db.query(sql, [option_content, section_id], function(err, rows) {
            if(err){
                console.error("failed to add option", err)
                res.status(500).send("failed to add option")
            } else {
                console.log("added option", rows)
                res.json(rows);
            }
        })

}

const modifyOption = function(req, res){
    console.log("in function to update a story option modifyOption()")
    let option_content = req.body.option_content
    let option_id = req.params.option_id
    let sql = `UPDATE sectionoptions SET option_content =? WHERE option_id =?;`
    db.query(sql, [option_content, option_id], function(err, rows) {
            if(err){
                console.error("failed to modify option", err)
                res.status(500).send("failed to modify option")
            } else {
                console.log("modified option", rows)
                res.json(rows);
            }
        })

}

const connectOption = function(req, res){
    console.log("in function to connect a resulting story section to an option")
    let storySection = req.params.section_id
    let option = req.params.option_id
    let sql = `UPDATE sectionoptions SET resulting_story_section_id = ? WHERE option_id = ?`
    db.query(sql, [storySection, option], function(err, rows){
        if(err){
            console.error("failed to link option to story section", err)
            res.status(500).send("failed to option to story section")
        }else{
            console.log("connected story section id to option")
            res.json(rows)
        }
    })
}

const deleteOption = function(req, res){
    console.log("in function to delete a story option deleteOption()")
    let option_id = req.params.option_id;
    let sql = `DELETE FROM sectionoptions WHERE option_id = ?;`
    //but what about the story sections and options attached to this story?
    //only delete if it does NOT have a resulting story section attached?
     console.log(sql)
     db.query(sql, option_id, function(err, rows) {
         if(err){
             console.error("failed to delete option", err)
             res.status(500).send("failed to delete option")
         } else {
             //if the insert statement ran without an error, then the user was created
             console.log("deleted options:", rows)
             res.json(rows);
         }
     })
}


//export
module.exports = {
    createUser,
    createStory,
    modifyStory,
    deleteStory,
    listStoriesAdmin,
    createStorySection,
    modifyStorySection,
    connectStartStorySection,
    deleteStorySection,
    createOption,
    modifyOption,
    connectOption,
    deleteOption
} 