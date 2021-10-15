let db = require("../db/db")

//use bcrypt
const bcrypt = require("bcrypt")

//use jsonwebtoken
const jwt = require("jsonwebtoken")

let login = function(req, res){
    console.log("in login()")
    
    //get the username and password
    let username = req.body.username
    let password = req.body.password

    //the ? in the sql statement is holding a space for
    //the first (and in this case, only) argument in the array of arguments following the statement (i.e., username)
    //so that the user input (i.e., username) is not directly put into the sql statement
    //to avoid sql injection
    db.query("SELECT user_name, password_hash, role FROM Users where user_name = ?", [username], function(err, rows){
        console.log(`inside login() query. username: ${username}`)
        
        //assume the password provided in the request is bad
        //the user needs to prove that the password is good 
        let goodPassword = false

        //instantiating the variable role
        let role;

        //if the db failed then log an error
        if(err){
            console.error("Error when querying the db", err)
        }

        //if the db returned too many rows then log the error
        //user_name is set to be unique, so this would be a strange problem
        if(rows.length > 1) {
            console.error(`Found too many rows with the username: ${username}`)
        }

        //if no rows returned, but not an error
        //e.g., user typed in username incorrectly, therefore the username isn't in the db or
        //user hasn't actually signed up yet
        if(rows.length == 0){
            console.log("Did not find a row/ field with the username: ", username)
        }

        //if there's no error and there is only one user with that username, i.e., only one row...
        if(!err && rows.length ==1){
            //save the row
            row = rows[0]
            
            //get the stored hash from the db
            let hash = row.password_hash

            //check that the hash matches
                //hey bcrypt, can you hash this password to see if it matches the password hash in the db?
            goodPassword = bcrypt.compareSync(password, hash)

            //get the role from the db
            role = row.role
        }

        //if the password provided is good then return a signed copy of the access token
        //anyone who is logged in will get a signed token
        //signed tokens will get you through middleware function checkJwt()
        //signed tokens with the admin role will get through middleware function isAdmin()
        if(goodPassword){

            //the token is passing along the username and role so every time the token is checked
            //that function can use them (?)
            const unsignedToken = {
                username: username,
                role: role
            }

            //take the unsigned token and sign it
            // save signed token as accessToken
            const accessToken = jwt.sign(unsignedToken, process.env.jwtSecret)

            //see the signed token
            console.log("Here, have a token: ", accessToken)
            //send the signed token back
            res.json(accessToken)

        }else{
            res.status(401).send("Unauthorized")
        }
    })
}

// Any user can see this list as long as they’re logged in
let getAllStories = function(req, res){
    console.log("user seeAllStories()")
    //get all the titles from the stories table
    let sql = `SELECT title FROM stories`
    db.query(sql, function(err, rows) {
        if(err){
            console.error("failed to get all stories", err)
            res.status(500).send("failed get all stories")
        } else {
            console.log("stories:", rows)
            res.json(rows);
        }
    })
    
}

let addToList = function(req, res) {
    console.log("user addToList()")
    //Grab a story by the story_id
    let story_id = req.params.story_id
    // and the :user_id
    let user_id = req.params.user_id
    // use both to create new row in UserStory table
    // This will give it a user_story_id, which is a unique instance of one time through reading/ playing the the whole story
    let sql = `INSERT INTO UserStory(story_id, user_id) values (?,?)`
    db.query(sql, [story_id, user_id], function(err, rows) {
        if(err){
            console.error("failed to add story to user list", err)
            res.status(500).send("failed to add story to user list")
        } else {
            console.log("created user story for user list", rows)
            res.json(rows);
        }
    })
}

let seeMyList = function(req, res) {
    console.log("user seeMyList()")
    //Grab the user_id
    let user_id = req.params.user_id
   
    // let sql = `SELECT story_id FROM UserStory WHERE user_id = ?`
    // db.query(sql, [user_id], function(err, rows) {
    //     if(err){
    //         console.error("failed to add story to user list", err)
    //         res.status(500).send("failed to add story to user list")
    //     } else {
    //     //     console.log("here are the story_id rows from UserStory: ", rows)
    //     //     //save those story ids
    //     //     //gather all the story titles that match those story ids in stories
    //     //     let sqlTitles =
    //     //     db.query(sql,  function(err, rows) {
    //     //         if(err){
    //     //             console.error("failed to add story to user list", err)
    //     //             res.status(500).send("failed to add story to user list")
    //     //         } else {
    //     //             let sqlTitles =
    //     //             console.log("created user story for user list", rows)
    //     //             res.json(rows);
    //     //         }
    //         console.log("created user story for user list", rows)
    //         res.json(rows);
        
    // })
}

let deleteFromList = function(req, res){
    console.log("user deleteFromList()")
}

let readStorySection = function(req, res){
    console.log("user readStorySection()")
}

let seeOptions = function(req, res){
    console.log("user seeOptions()")
}

let chooseOption = function(req, res){
    console.log("user chooseOption()")
}

let seeCompleteStory = function(req, res){
    console.log("user seeCompleteStory()")
}

 //export controllers
 module.exports = {
     login,
     getAllStories,
     addToList,
     seeMyList,
     deleteFromList,
     readStorySection,
     seeOptions,
     chooseOption,
     seeCompleteStory
} 