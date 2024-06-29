const bcrypt = require("bcryptjs")
const User = require("../models/user");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

const customFields = {
    usernameField: 'email',
    passwordField: 'password',
}

const verifyCallback = async (username, password, done) => {
    try {

      const user = await User.findOne({ email: username });
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      };

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      };

      return done(null, user); 
      
    } catch(err) {
      return done(err);
    };
}


const strategy = new LocalStrategy(customFields, verifyCallback)
passport.use(strategy)


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});