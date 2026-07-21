const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
router.post("/sign-up", async (req, res) => {

    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (userInDatabase) {
        return res.send("Username already taken.");
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match.");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });

    res.redirect("/auth/sign-in");

});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});


router.post("/sign-in", async (req, res) => {

    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (!userInDatabase) {
        return res.send("Login failed.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );

    if (!validPassword) {
        return res.send("Login failed.");
    }

    req.session.user = {
        _id: userInDatabase._id,
        username: userInDatabase.username,
        email: userInDatabase.email,
        role: userInDatabase.role
    };

    res.redirect("/");

});


router.get("/sign-out", (req, res) => {

    req.session.destroy();

    res.redirect("/");

});

module.exports = router;