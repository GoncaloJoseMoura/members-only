const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("author");
const passport = require("passport");
const bcrypt = require("bcryptjs")


exports.user_signin_get = (req, res, next) => {
  res.render("sign-up", {user: undefined, errors: undefined});
};

exports.user_signin_post = [

  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('email')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isEmail()
    .withMessage('An email must be specified.'),
  body('password', 'Password must have more than 8 characters')
    .isLength({min: 8})
    .escape(),
  body('c_password').custom((value, { req }) => {
      return value === req.body.password;
    }),


  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    let user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {

      res.render('sign-up', {
        user,
        errors: errors.array(),
      });
    } else {
  
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            return next(err);
          }

          user.password = hashedPassword
          await user.save();
          res.redirect("/");
        })
    }
  }),
];

exports.user_login_get = (req, res, next) => {
    res.render("login");
};
  
exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login"
})

exports.user_admin_get = (req, res, next) => {
  res.render("admin", {errors: undefined});
}

exports.user_admin_post = [

  body('password').custom((value) => {
      return '1234' === value;
    })
    .withMessage('Wrong Password'),


  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const user = new User({
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      password: req.user.password,
      membership_status: 'Admin'
    });

    if (!errors.isEmpty()) {

      res.render('admin', {
        errors: errors.array(),
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, user, {});
      res.redirect('/');
    }
  }),
];


exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('session');
    res.redirect("/");
  });
};

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.status(401).json({ msg: 'You are not authorized to view this resource' });
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membership_status == 'Admin') {
      next();
  } else {
      res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
  }
}