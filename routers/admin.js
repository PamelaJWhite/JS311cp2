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
router.post("/createUser", function(req, res){
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
})

//export router object so routes can be used elsewhere in the code
module.exports = router