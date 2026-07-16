const router = require("express").Router();

const User = require("../models/user");
const Appointment = require("../models/appointments");


router.get("/providers", async (req, res) => {

    const providers = await User.find({
        role: "provider"
    });
console.log(providers);
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

router.get("/:appointmentId/edit", isSignedIn, async (req, res) => {

    const foundAppointment = await Appointment.findById(
        req.params.appointmentId
    );

    res.render("appointments/edit.ejs", {
        appointment: foundAppointment
    });

});
router.put("/:appointmentId", isSignedIn, async (req, res) => {

    await Appointment.findByIdAndUpdate(
        req.params.appointmentId,
        req.body
    );

    res.redirect("/appointments/" + req.params.appointmentId);

});
router.delete("/:appointmentId", isSignedIn, async (req, res) => {

    await Appointment.findByIdAndDelete(
        req.params.appointmentId
    );

    res.redirect("/appointments");

});
module.exports = router;