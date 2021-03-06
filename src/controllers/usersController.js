import User from "../models/User.js"
import passport from "passport"


// Normal Users

export const renderSignUpForm = (req, res) => res.render('users/signup')

export const signup = async (req, res) => {
    let errors = []
    const { name, email, password, confirm_password } = req.body
    if(password != confirm_password ) errors.push({ text: 'Passwords do not match'})
    if(password.length < 4) errors.push({ text: 'Passwords must be at least 4 characters'})
    if(errors.length > 0){
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    } else {
        // Look for email coincidence
        const emailUser = await User.findOne({ email: email})
        if(emailUser) {
            req.flash('error_msg', 'The email is already in use')
            req.redirect('/users/signup')
        } else {
            // Saving a New User
            const newUser = new User({ name, email, password })
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'You are registred')
            res.redirect('/users/signin')
        }
    }
}

export const renderSigninForm = (req, res) => res.render('users/signin')

export const signin = passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/users/signin',
    failureFlash: true
})

export const logout = (req, res) => {
    req.logout()
    req.flash("success_msg", "You are logged out now.")
    res.redirect("/")
  }


// Me section. Config user properties
export const renderUserConfig = async (req, res) => {
    const admin = req.user.admin
    const rol = req.user.rol
    res.render('users/config/me', {admin, rol})
}

// Recover account
export const renderRecoverAccountForm = (req, res) => res.render('users/recover-account/recover')

// Moderators

export const renderSigninFormMod = (req, res) => res.render('users/mod/signin')