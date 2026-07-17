const router = require("express").Router();
const Availability = require("../models/availability");
const isSignedIn = require("../middleware/is-signed-in");


router.get("/", isSignedIn, async (req, res) => {
    const availability = await Availability.find({
        user: req.session.user._id
    });

    res.render("availability/index.ejs", { availability });
});


router.get("/new", isSignedIn, (req, res) => {
    res.render("availability/new.ejs");
});


router.post("/", isSignedIn, async (req, res) => {
    req.body.user = req.session.user._id;

    await Availability.create(req.body);

    res.redirect("/availability");
});

module.exports = router;