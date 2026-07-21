const router = require("express").Router();
const Availability = require("../models/Availability.js");
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

    res.render("availability/new.ejs",{provider, availabilities});

});



router.post("/", isSignedIn, async (req, res) => {

    try {

        console.log(req.body);

        const slots = req.body.slots
            .split(",")
            .map(time => ({
                time: time.trim(),
                status: "available"
            }));

        const selectedDate = new Date(req.body.date);

        let availability = await Availability.findOne({
            provider: req.session.user._id,
            date: selectedDate
        });

        if (availability) {

            availability.slots.push(...slots);

            await availability.save();

            console.log("Availability updated");

        } else {

            await Availability.create({
                provider: req.session.user._id,
                date: selectedDate,
                slots
            });

            console.log("Availability created");

        }

        res.redirect("/availability");

    } catch (error) {

        console.log(error);

        res.send(error.message);

    }

});

router.get("/:providerId", isSignedIn, async (req, res) => {

    const availability = await Availability.find({
        provider: req.params.providerId
    }).populate("provider");

    res.render("availability/index.ejs", {
        availability
    });

});

module.exports = router;