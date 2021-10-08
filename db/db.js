let mysql = require('mysql')
require("dotenv").config()

//give the information to allow it to access the db
//this needs to change:
// let connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PW,
//     database: process.env.MYSQL_DB
//   })
//to this, which has everything in a string in the right format, insted of the object (like above/ before)
let pool = mysql.createPool(process.env.CLEARDB_GOLD_URL);

// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log('creating connection pool...')
//       this.pool = mysql.createPool(process.env.CLEARDB_GOLD_URL)
//       return this.pool
//     }

//     return this.pool
//   }
// }

// const instance = new Connection()

//make that connection
  // pool.connect();

  
//issue a query on that connection 
//and the callback is saying
//do this with errors
//or else (if the error is falsey)show me the sqlrows in the console
//   pool.query("use " + process.env.CLEARDB_GOLD_URL, function(error, rows){
//     if(error){
//         console.log("DB query error", error)
//     } else {
//         console.log("Query results:", rows)
//   }
// })

module.exports = pool;
  