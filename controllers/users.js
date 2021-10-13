let db = require("../db/db")

//use bcrypt
const bcrypt = require("bcrypt")

//use jsonwebtoken
const jwt = require("jsonwebtoken")

let login = function(req, res){
    console.log("in login()")
    res.json("you made it to login()")
    //below is all copied - needs to be updated for this project!
    //get the username and password
    // let username = req.body.username
    // let password = req.body.password

    // db.query("SELECT username, password_hash, role FROM appusers where username = ?", [username], function(err, rows){
    //     console.log(`inside login() query. username: ${username}`)
    //     //assume the password provided in the request is bad
    //     //would this work the same way if we set it to null, instead of false
    //         //this seems to assume they don't have a password rather than the password is bad
    //     let goodPassword = false
    //     //not sure why this is here; I just copied it
    //     let role;

    //     //if the db failed then log an error
    //     if(err){
    //         console.error("Error when querying the db", err)
    //     }
    //     //if the db returned too many rows then log the error
    //         //this seems a strange thing to check for; shouldn't the username field be set to unique?
    //     if(rows.length > 1) {
    //         console.error(`Found too many rows with the username: ${username}`)
    //     }
    //     //if no rows returned, but not an error
    //     //e.g., user typed in username incorrectly, therefore the username isn't in the db or
    //     //user hasn't actually signed up yet
    //     if(rows.length == 0){
    //         console.log("Did not find a row/ field with the username: ", username)
    //     }
    //     //if there's no error and there is only one user with that username, i.e., only one row...
    //     if(!err && rows.length ==1){
    //         //save the row
    //         row = rows[0]
    //         //get the stored hash from the db
    //         let hash = row.password_hash
    //         //check that the has matches
    //             //hey bcrypt, can you hash this password to see if it matches the password hash in the db?
    //         goodPassword = bcrypt.compareSync(password, hash)
    //         //this is also in the example, and I'm not sure why yet
    //         //get the role from the db
    //             //I don't think I gave my only user a role, so this would be undefined, anyway
    //         role = row.role
    //     }
    //     //if the password provided is goot then return a signed copy of the access token
    //     if(goodPassword){
    //         const unsignedToken = {
    //             username: username,
    //             role: role
    //         }
    //         const accessToken = jwt.sign(unsignedToken, process.env.jwtSecret)
    //         //sent back signed token
    //         console.log(accessToken)
    //         //send the signed token back
    //         res.json(accessToken)
    //     }else{
    //         res.status(401).send("Unauthorized")
    //     }
    // })
}

 //export controllers
 module.exports = {
     login
    
} 