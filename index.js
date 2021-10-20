const express = require("express")
let app = express()
// enable the app to parse JSON bodies in post/put
app.use(express.json())

require("dotenv").config()

let mysql = require("./db/db")

let PORT = process.env.PORT

//get access to the users file in the router folder
let userRoutes = require("./routers/users")
//and use it
app.use(userRoutes)

//get access to the admin file in the router folder
let adminRoutes = require("./routers/admin")
//and use it
app.use(adminRoutes)

//testing connection
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
//this shows my main page
app.get("/", function(req, res){
    console.log("What's going on?")
    res.send("WOW")
})
 
app.listen(PORT, function(){
    console.log("Leeeeeet's go! on port: ", PORT)
})