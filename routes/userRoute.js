const express = require('express')
const user_route = express.Router()
const session = require('express-session')



const config = require('../config/config')
user_route.use(session({secret:config.sessionSecret}))

const auth = require('../middleware/auth')




const bodyParser = require('body-parser')
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))
const path = require('path')


// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,'../public/userImages'))
//     },
//     filename:function(req,file,cb){
//         const name = Date.now()+'-'+file.originalname
//         cb(null,name)
//     }

// })
// const upload = multer({storage:storage})
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/userImages'));
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + '-' + file.originalname;
//         cb(null, name);
//     }
// });

// const upload = multer({ storage: storage });

const userController = require('../controllers/userController')
user_route.get('/registration',userController.loadRegister)



user_route.post('/register',userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verifyLogin)

user_route.get('/home',userController.loadHome)


user_route.get('/logout',userController.userLogout)

user_route.get('/edit',auth.isLogin,userController.editLoad)

 user_route.post('/edit',userController.updateProfile)
module.exports = user_route 