const router = require("express").Router();
const Availability = require("../models/availability");
const isSignedIn = require("../middleware/is-signed-in");

router.get("/", isSignedIn, async (req, res) => {

    const availability = await Availability.find({
        provider: req.session.user._id
    });

    res.render("availability/index.ejs", {
        availability
    });

});


router.get("/new", isSignedIn, (req, res) => {

    res.render("availability/new.ejs");

});

router.post("/", isSignedIn, async (req, res) => {

    await Availability.create({
        provider: req.session.user._id,
        day: req.body.day,
        availableSlots: req.body.availableSlots
    });

    res.redirect("/availability");

});


router.get("/:providerId", async (req, res) => {

    const availability = await Availability.find({
        provider: req.params.providerId
    }).populate("provider");

    res.render("availability/index.ejs", {
        availability
    });

});


module.exports = router;