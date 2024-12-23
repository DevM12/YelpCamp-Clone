const { storeReturnTo } = require('../middleware');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const passport = require('passport');
const user = require('../controllers/users')
//register

router.get('/register', user.renderRegister)

router.post('/register', catchAsync(user.createUser));

//login

router.get('/login', user.renderLogin)

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser),


    router.get('/logout', user.logoutUser)



module.exports = router;
