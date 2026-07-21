const Appointment = require("../models/appointments.js");
const User = require("../models/user.js");

const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in.js");
const Availability = require("../models/Availability");


router.get("/", isSignedIn, async (req, res) => {

    const allAppointments = await Appointment.find({
        customer: req.session.user._id
    });

    res.render("appointments/all-appointments.ejs", {
        appointments: allAppointments
    });

});


router.get("/new", isSignedIn, async (req, res) => {

    const providers = await User.find({
        role: "provider"
    });

    const availabilities = await Availability.find({
        "slots.status": "available"
    }).populate("provider");

    res.render("appointments/new.ejs", {
        providers,
        availabilities
    });

});

router.post("/", isSignedIn, async (req, res) => {

    const [availabilityId, time] =
        req.body.selectedSlot.split("|");

    const availability =
        await Availability.findById(availabilityId);

    const appointment =
        await Appointment.create({

            customer: req.session.user._id,
            provider: req.body.provider,
            availability: availabilityId,
            service: req.body.service,
            date: availability.date,
            startTime: time,
            endTime: time,
            notes: req.body.notes
        });

    const slot = availability.slots.find(
        s => s.time === time
    );

    slot.status = "booked";
    slot.appointment = appointment._id;

    await availability.save();

    res.redirect("/appointments");

});
router.get("/:appointmentId/edit", isSignedIn, async (req, res) => {

    const appointment = await Appointment.findById(
        req.params.appointmentId
    );

    res.render("appointments/edit.ejs", {
        appointment
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

router.get("/:appointmentId", isSignedIn, async (req, res) => {

    const appointment = await Appointment.findById(
        req.params.appointmentId
    );

    res.render("appointments/details.ejs", {
        appointment
    });

});


module.exports = router;