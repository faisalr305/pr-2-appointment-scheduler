const router = require("express").Router();

const User = require("../models/User");
const Appointment = require("../models/appointments");


router.get("/providers", async (req, res) => {

    const providers = await User.find({
        role: "provider"
    });

    res.render("users/providers.ejs", {
        providers
    });

});



router.get("/providers/:provider", async (req, res) => {

    const appointments = await Appointment.find({
        provider: req.params.provider
    });

    res.render("users/provider-appointments.ejs", {
        provider: req.params.provider,
        appointments
    });

});


module.exports = router;