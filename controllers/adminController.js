const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: 'Email and password  is incorrect' })
                } else {
                    req.session.user_id = userData._id
                    res.redirect('/admin/home')
                }
            } else {
                res.render('login', { message: 'Email and password  is incorrect' })
            }
        } else {
            res.render('login', { message: 'Email and password  is incorrect' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { admin: userData })
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async (req, res) => {
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search
        }
        const usersData = await User.find({ 
            is_admin: 0,
           $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {email:{$regex:'.*'+search+'.*',$options:'i'}},
            {mobile:{$regex:'.*'+search+'.*',$options:'i'}}
           ]
        })
        res.render('dashboard', { users: usersData })
    } catch (error) {
        console.log(error.message);
    }
}

//edit user functionality
const editUserLoad = async (req, res) => {
    try {
        const userid = req.query.id;

        const userData = await User.findById({ _id: userid })

        if (userData) {
            res.render('edit-user', { user: userData })
        }
        else {
            res.redirect('/admin/dashboard')
        }
        res.render('edit-user')
    } catch (error) {
        console.log(error.message)
    }
}

const updateUsers = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, is_verified: req.body.verify } })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

//delete users
const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    editUserLoad,
    updateUsers,
    deleteUser
}