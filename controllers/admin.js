let db = require("../db/db")

//use bcrypt
const bcrypt = require("bcrypt")

//use jsonwebtoken
const jwt = require("jsonwebtoken")

const createUser = function(req, res){
    console.log("Hey there, createUser()")
    res.json("creating a user is so much fun!")
//     let sql = "INSERT INTO users(username, password_hash, role) values(?, ?, ?);"
//     db.query(sql, [username, passwordHash, 'user'], (err, rows)=> {
//         //if the insert query returned an error, we log the error
//         //and return a failed message back
//         if(err){
//             console.error("failed to add user", err)
//             res.status(500).send("failed to add user")
//         } else {
//             //if the inster statement ran without an error, then the user was created
//             console.log("user created? for real?")
//             res.send("user created")
    //     }
    // })
}


//------------------ STORIES functions ------------------------------
const createStory = function(req, res){
    console.log("createStory() controller function")
    //a story needs a title
    //the story_id will be autocreated/ incremented
    //grab the title that from req body
    let title = req.body.title
    console.log(title)
    
    let sql = `INSERT INTO stories(title) values("${title}")`
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
     console.log(title)
     //need to grab the story_id from the parameters?
     let story_id = req.params.story_id
     console.log(story_id)

    let sql = `UPDATE stories SET title="${title}" WHERE story_id = ${story_id};`
    //Need to disallow where title already exists
     console.log(sql)
     db.query(sql, function(err, rows) {
     //     //if the insert query returned an error, we log the error
     //     //and return a failed message back
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

    let sql = `DELETE FROM stories WHERE story_id = ${story_id};`
    //but what about the story sections and options attached to this story???
     console.log(sql)
     db.query(sql, function(err, rows) {
     //     //if the insert query returned an error, we log the error
     //     //and return a failed message back
         if(err){
             console.error("failed to delete story", err)
             res.status(500).send("failed to update story")
         } else {
             //if the insert statement ran without an error, then the user was created
             console.log("deleted story:", rows)
             res.json(rows);
         }
     })
}

const listStoriesAdmin = function(req, res){
    console.log("in function to list stories for admin listStoriesAdmin()")
    let sql = `SELECT * FROM stories`
    //but what about the story sections and options attached to this story???
     console.log(sql)
     db.query(sql, function(err, rows) {
     //     //if the insert query returned an error, we log the error
     //     //and return a failed message back
         if(err){
             console.error("failed to delete story", err)
             res.status(500).send("failed to update story")
         } else {
             //if the insert statement ran without an error, then the user was created
             console.log("deleted story:", rows)
             res.json(rows);
         }
     })

}


//------------------------ STORY SECTIONS functions -----------------------------
const createStorySection = function(req, res){
    console.log("in function to create a story section createStorySection()")
    let story_section_content = req.body.story_section_content
    let story_id = req.params.story_id
    let sql = `INSERT INTO storysections(story_section_content, story_id) VALUES("${story_section_content}", ${story_id})`
    //somehow need to identify and assign the first story section. This function or a separate route? I think the latter
    db.query(sql, function(err, rows) {
        //     //if the insert query returned an error, we log the error
        //     //and return a failed message back
            if(err){
                console.error("failed to add story section", err)
                res.status(500).send("failed to add story section")
            } else {
                //if the insert statement ran without an error, then the user was created
                console.log("added story section", rows)
                res.json(rows);
            }
        })
}

const modifyStorySection = function(req, res){
    console.log("in function to update a story section modifyStorySection()")
    let story_section_content = req.body.story_section_content
    let section_id = req.params.section_id
    let sql = `UPDATE storysections SET story_section_content ="${story_section_content}" WHERE story_section_id = ${section_id};`
    //also, I should change the title of the column to be section_id,not story_section_id or vice versa
    //somehow need to identify and assign the first story section. This function or a separate route? I think the latter
    db.query(sql, function(err, rows) {
        //     //if the insert query returned an error, we log the error
        //     //and return a failed message back
            if(err){
                console.error("failed to add story section", err)
                res.status(500).send("failed to add story section")
            } else {
                //if the insert statement ran without an error, then the user was created
                console.log("added story section", rows)
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
    let sql = `INSERT INTO options(option_content, story_section_id) VALUES("${option_content}", ${section_id})`
    //somehow need to identify and assign the first story section. This function or a separate route? I think the latter
    db.query(sql, function(err, rows) {
        //     //if the insert query returned an error, we log the error
        //     //and return a failed message back
            if(err){
                console.error("failed to add option", err)
                res.status(500).send("failed to add option")
            } else {
                //if the insert statement ran without an error, then the user was created
                console.log("added option", rows)
                res.json(rows);
            }
        })

}

const modifyOption = function(req, res){
    console.log("in function to update a story option modifyOption()")
    let option_content = req.body.option_content
    let option_id = req.params.option_id
    let sql = `UPDATE sectionoptions SET option_content ="${option_content}" WHERE option_id = ${option_id};`
    db.query(sql, function(err, rows) {
            if(err){
                console.error("failed to modify option", err)
                res.status(500).send("failed to modify option")
            } else {
                console.log("modified option", rows)
                res.json(rows);
            }
        })

}

const deleteOption = function(req, res){
    console.log("in function to delete a story option deleteOption()")
    let option_id = req.params.option_id;
    let sql = `DELETE FROM sectionoptions WHERE option_id = ${option_id};`
    //but what about the story sections and options attached to this story???
     console.log(sql)
     db.query(sql, function(err, rows) {
     //     //if the insert query returned an error, we log the error
     //     //and return a failed message back
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
    deleteStorySection,
    createOption,
    modifyOption,
    deleteOption
} 