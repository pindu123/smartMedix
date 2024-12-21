const mysql=require('mysql2/promise')


const mySqlConnect= mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Refugee_APP'
  
})

module.exports=mySqlConnect