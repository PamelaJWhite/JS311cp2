const e = require("express")
let express= require("express")
require("dotenv").config()
let app = express()

let mysql = require("./db/db")

let PORT = process.env.PORT

app.get("/mysql", function(req, res){
    //select now() is a mysql func that gives time and date
    mysql.query("select now()", function(error, rows){
        if(error) {
            console.error("mysql query failed", error)
        } else {
            console.log("Thanks for hooking me up!")
           res.json(rows)
        }
    })
})
//this was copied; I don't know why
app.get("/", function(req, res){
    console.log("What's going on?")
    res.send("YeeHaw")
})

app.post("/createUser", function(req, res){
    console.log("Hey there, createUser")
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
})
//ROUTES:
//  /login
    // /selectStory 
    //     to add it to a user's list of stories
    //      it is identified as "not started" somehow 
    //      stories will stay on this list and later be identified as started and finished, too
    // /viewList
    //     view the list of stories the user has selected
    //      deleteFromList 
    // /readStory
    //     select from list of stories, opens the first page of the story
    //     the routes below are related to readStory
    //     ??? can this also function for stories already started? how do I save progress?
    // /seeOptions
    //     shows options or continue 
    //     click to see options related to the storySection just readStory
    //     continue is one option, if it is not a story section that has a choice to make
    // /makeChoice
    //     choose one from three (or more) choices
    //     or click continue
    //     leads to next page, based on choice
    // /saveProgress
    //     maybe /saveStory
    //     always available once a story is started
    //     adds the story to your story list
    //     marks the story as started (e.g., with a symbol or in a different section of the list)
    //     allows user to restart story from this point (if not finished)
    //         ??? how do I do this? is /continue 
    //         it's own route? a route that would be started when the user clicked on a story marked as started?
    //      I think this can also work for saving a completed story
                // e.g., if last story section, then change the label to completed on the story list

app.listen(PORT, function(){
    console.log("Leeeeeet's go! on port: ", PORT)
})