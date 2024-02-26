const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/user_management_system')

const express = require('express')
const nocache=require('nocache')
const app = express()

//for user routes

app.set('view engine','ejs')
app.set('views','./views/users')
app.use(nocache())
const userRoute = require('./routes/userRoute')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/',userRoute)

//for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

app.listen(3000,()=>console.log('running on http://localhost:3000'))