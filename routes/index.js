const express = require("express");
const router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/// MESSAGES ROUTES ///

// GET catalog home page.
router.get("/", message_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/message/create", message_controller.message_create_get);

// POST request for creating Book.
router.post("/message/create", message_controller.message_create_post);

// GET request to delete Book.
router.get("/message/:id/delete", user_controller.isAdmin, message_controller.message_delete_get);

/// USERS ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/user/sign-up", user_controller.user_signin_get);

// POST request for creating Author.
router.post("/user/sign-up", user_controller.user_signin_post);

router.get("/user/admin", user_controller.user_admin_get);

// POST request for creating Author.
router.post("/user/admin", user_controller.user_admin_post);


router.get("/user/login", user_controller.user_login_get);

// POST request for creating Author.
router.post("/user/login", user_controller.user_login_post);

// POST request for creating Author.
router.get("/user/logout", user_controller.isAuth, user_controller.user_logout_get);

module.exports = router;
