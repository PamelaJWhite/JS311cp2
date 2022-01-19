let db = require("../db/db")

//use bcrypt
const bcrypt = require("bcrypt")

//use jsonwebtoken
const jwt = require("jsonwebtoken")
const e = require("express")

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
    //get all the titles and story_ids from the stories table
    let sql = `SELECT * FROM stories`
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
    // User sees their own list of stories (story titles)
    //If they have chosen the same title multiple times,
    //it will be listed multiple times
    //I'd like to add some indicator, like date added,
    //that can help differentiate the various iterations of each chosen title
    console.log("user seeMyList()")
    //Grab the user_id
    let user_id = req.params.user_id
    
    //grab all the titles from the story table and user_ids from the usertable 
    //for all the rows where the story_ids match across tables 
    //and a specific user_id is present
    let sql = `SELECT userstory.user_story_id, stories.title, stories.story_id, userstory.user_id FROM stories INNER JOIN userstory ON stories.story_id = userstory.story_id WHERE user_id = ?` 

    db.query(sql, [user_id], function(err, rows) {
        if(err){
            console.error("failed to gather your list", err)
            res.status(500).send("failed to gather your list")
        } else {
            console.log("these are all the titles this user has saved ", rows)
            res.json(rows)
        }
    })
}

let deleteFromList = function(req, res){
    //Delete a title from the user's list
    //Only if the user hasn't started reading, yet
    console.log("user deleteFromList()")

    //grab the user_story_id from the params
    let userStoryId = req.params.user_story_id
    let sql = "DELETE FROM userStory WHERE user_story_id = ?"

    db.query(sql, userStoryId, function(err, rows){
        if(err){
            //how would I give a more specific response back
            //i.e., "You can't delete that title, because you've already started reading that story"?
            //err is generic - i know it's not allowing the delete because of foreign key constraints
            //but it could be a different reason for err
            console.error("couldn't delete that title", err)
            res.status(500).send("couldn't delete that title")
        } else {
            console.log("Just deleted title from userStory ", rows)
            res.json(rows)
        }
    })
}

// Get the first story section by the story_section_id
// Add it to the CompleteStory table
// The database is getting updated as the user reads the story and makes choices
// Read the story section
let readFirstStorySection = function(req, res){
    //read a story section and add it to the CompleteStory table
    console.log("user readStorySection()")

    //grab the user_story_id from path params 
    let userStoryId = req.params.user_story_id;
    console.log("path params had this user_story_id: ", userStoryId)

    let resultingStorySection = req.query.resulting_story_section_id
    console.log("query params had this resulting_story_section ", resultingStorySection)

    let sql = `SELECT 
    userstory.user_story_id,
    stories.story_id, 
    stories.start_story_section_id,
    storysections.story_section_id, 
    storysections.story_section_content
    FROM userstory
    JOIN stories ON userstory.story_id = stories.story_id 
    JOIN storysections ON stories.start_story_section_id = storysections.story_section_id
    WHERE user_story_id = ?;`
    db.query(sql, userStoryId, function(err, rows){
        if(err){
            console.error("couldn't join those tables", err)
            res.status(500).send("couldn't join those tables")
            } else {
            console.log("rows from join userstory, stories, storysections to read first content: ", rows)
            //save the user_story_id
            let userStoryId = rows[0].user_story_id
            console.log("user story id from the rows to add to completestory: ", userStoryId)

            //save the story_section_id 
            let storySectionId = rows[0].story_section_id
            console.log("story section id to add to completestory: ", storySectionId)

            //and add it to CompleteStory table 
            let sqlCompleteStory = `INSERT INTO completestory(user_story_id, story_section_id, options_id) VALUES (?, ?, ?)`
            db.query(sqlCompleteStory, [userStoryId, storySectionId], function(req, res){
        if(err){
            console.error("couldn't insert new completestory row: ", err)
            res.status(500).send("couldn't insert new complete story row")
            } 
            //This should be the FIRST row for this userstory
            //in the completestory table 
            //bc it was obtained through the user_story_id
            //and future rows (pieces of the story) will be obtained through the chosen option
            //if the user_story_id already exists, that's a problem
            //I want to account for this with an if statement, but I think that involves another query
            //of the completestory table
            //and I need to get the big stuff done, first
        else {
            console.log("user_story_id and first story_section inserted into completeStory")
            }
        } )
        // save just the row; take it out of the returned array
        // and show just the value (i.e., the content)
        let section =  rows[0]
            console.log(section)
            res.json(section)
        }
    } )
}

let readNextSection = function(req, res){
    console.log("in readNextSection()")

    //grab the user_story_id from path params 
    let userStoryId = req.params.user_story_id;
    console.log("in readNextSection(); path params had this userStoryId: ", userStoryId)

     //grab the resulting_story_section_id from the path params
    let resultingStorySection = req.params.resulting_story_section_id
    console.log("in readNextSection(); path params had this resulting_story_section ", resultingStorySection)

    // let optionId = req.params.option_id;

    //JOIN sectionoptions and storysections tables
    //on the column resultingstorysection in sectionoptions matches the column storysectionid in storysections
    //select columns: sectionoptions.resulting_story_section, storysections.story_section_id, storysections.story_section_content
    //and i still need the user_story_id to   add to the completestory table
    let sql = 
    `SELECT 
    sectionoptions.resulting_story_section_id,
    storysections.story_section_id,
    storysections.story_section_content
    FROM sectionoptions
    JOIN storysections ON sectionoptions.resulting_story_section_id = storysections.story_section_id
    WHERE resulting_story_section_id = ?`
    
    db.query(sql, resultingStorySection, function(err, rows){
        if(err){
            console.error("couldn't join sectionoptions and storysections tables", err)
            res.status(500).send("couldn't join sectionoptions and storysections tables")
            
        }else{
            let sqlCompleteStory = `INSERT INTO completestory(user_story_id, story_section_id) VALUES (?, ?)`
            db.query(sqlCompleteStory, [userStoryId, resultingStorySection], function(err, rows){
                if(err){
                    console.error("couldn't add those rows to completestory", err)
                    res.status(500).send("couldn't add rows to completestory")
                }else{
                    console.log("added the row to complete table, now you can read it")
                }
            })
        //return the section here
        // let section =  rows[0].story_section_content
        // console.log("read this: ", section) 
        // res.json(section)
        res.json(rows[0])
        }
    } )
}

let seeOptions = function(req, res){
    //see all the options associated with an option
    console.log("user seeOptions()")

    //grab the section id
    let sectionId = req.params.story_section_id

    //grab the option_content  that match that sectionId
    let sql = `SELECT option_content, option_id, resulting_story_section_id FROM sectionoptions WHERE story_section_id = ?`
    db.query(sql, sectionId, function(err, rows){
        if(err){
            console.error("couldn't get options ", err)
            res.status(500).send("couldn't get options")
        }else{
            // let optionsArray = rows.map((element) => {
            //     console.log("in foreach:", element.option_content)
            //     return element.option_content
            // })
            // console.log("optionsArray: ", optionsArray)
            // res.json(optionsArray)
            
            let test = rows.map((element) => {
                    console.log("in map: ", element)
                    return element
                })
                res.json(test)
        }
    })
}

// Make a choice/ continue
// Adds the chosen option to the user’s CompleteStory table
let chooseOption = function(req, res){
    console.log("user chooseOption()")

    //grab the userstoryid and option_id from the path paramaters
    let userStoryId = req.params.user_story_id
    let optionId = req.params.option_id

    let nullVariable = null;
    //add the option id to the completestory table 
    //so it matches the user_story_id
    //and the options_id column is null
    //only the most recent column should be null
        //alternatively, I could set up a string in the option_id column
        //in the readStory function
        //so that it's more distinct than null
        //null doesn't work, anyway
    let sqlAddOption = `UPDATE completestory SET options_id = ?
    WHERE user_story_id = ? AND options_id = 0`
        db.query(sqlAddOption, [optionId, userStoryId], function(err, rows){
            if(err){console.error("couldn't add option to completestory ", err)
                res.status(500).send("couldn't add option to completestory")
            }else{
                console.log("rows in addOption() db query: ", rows)
                res.status(200).send("added option to complete story")
            }
        })
        
    }
    
let seeCompleteStory = function(req, res){
    console.log("user seeCompleteStory()")

    let userStoryId = req.params.user_story_id

    let sql = "SELECT completestory.complete_story_id, sectionoptions.option_content, sectionoptions.option_id, storysections.story_section_content,storysections.story_section_id FROM completestory JOIN sectionoptions ON sectionoptions.story_section_id = completestory.story_section_id JOIN storysections ON storysections.story_section_id = completestory.story_section_id WHERE user_story_id = ? ORDER BY completestory.complete_story_id"

    db.query(sql, userStoryId, function(err, rows){
        if(err){
            //how would I give a more specific response back
            //i.e., "You can't delete that title, because you've already started reading that story"?
            //err is generic - i know it's not allowing the delete because of foreign key constraints
            //but it could be a different reason for err
            console.error("couldn't get complete story", err)
            res.status(500).send("couldn't get complete story")
        } else {
            console.log("Here's the complete story: ", rows)
            res.json(rows)
        }
    })
}

 //export controllers
module.exports = {
    login,
    getAllStories,
    addToList,
    seeMyList,
    deleteFromList,
    readFirstStorySection,
    readNextSection,
    seeOptions,
    chooseOption,
    seeCompleteStory
} 

  //if the resulting story section (not the user story id)
    //was sent in the query params
    // if(resultingStorySection){
    //     //do i have access to the path params in here?
    //     console.log("there is a resulting story section")
    //     //JOIN sectionoptions and storysections tables
    //     //on the column resultingstorysection in sectionoptions matches the column storysectionid in storysections
    //     //select columns: sectionoptions.resulting_story_section, storysections.story_section_id, storysections.story_section_content
    //     //and i still need the user_story_id to   add to the completestory table
    //     let sql = 
    //     `SELECT 
    //     sectionoptions.resulting_story_section_id,
    //     storysections.story_section_id,
    //     storysections.story_section_content
    //     FROM sectionoptions
    //     JOIN storysections ON sectionoptions.resulting_story_section_id = storysections.story_section_id
    //     WHERE resulting_story_section_id = ?`
        
    //     db.query(sql, resultingStorySection, function(err, rows){
    //         if(err){
    //             console.error("couldn't join sectionoptions and storysections tables", err)
    //             res.status(500).send("couldn't join sectionoptions and storysections tables")
    //         }else{
    //             let sqlCompleteStory = `INSERT INTO completestory(user_story_id, story_section_id, options_id) VALUES (?, ?, 0)`
    //             db.query(sqlCompleteStory, [userStoryId, rows[0].story_section_id], function(err, rows){
    //                 if(err){
    //                     console.error("couldn't add those rows to completestory", err)
    //                     res.status(500).send("couldn't add rows to completestory")
    //                 }else{
    //                     console.log("added the row to complete table, now you can read it")
    //                 }
    //             })
    //         //return the section here
    //         let section =  rows[0].story_section_content
    //         console.log("read this: ", section)
    //         }
    //     } )
    // } 
    // //else, the default is that this is the first story section
    // //and we'll use the userStoryId to get the first story section
    // //this needs some safeguards - if you screw up the query parameters, this happens
    // else{
        //JOINs userstory, stories, and storysections tables
        //where the start_story section ID equals the story_section_id given in the params
        //this gets the first story section for a story
        //that will create the row to insert into CompleteStory
        // }

          // //grab the resulting_story_section_id from the query params if it's there
   
