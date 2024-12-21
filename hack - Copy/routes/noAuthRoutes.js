const express=require('express')
const { createUser, loginUser } = require('../Controllers/userController')

const noAuthRoutes=express.Router()


noAuthRoutes.post("/register",createUser);
noAuthRoutes.post("/login",loginUser);


module.exports=noAuthRoutes