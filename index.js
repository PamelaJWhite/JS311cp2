let express= require("express")
require("dotenv").config()
let app = express()

let PORT = process.env.PORT

app.get("/", function(req, res){
    res.send("Wuzuuuuuuuuup")
})

app.listen(PORT, function(){
    console.log("Leeeeeet's go! on port: ", PORT)
})