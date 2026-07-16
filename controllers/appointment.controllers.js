const Appointment = require("../models/appointments.js");

const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in.js");
const User = require("../models/user.js");


router.get("/", isSignedIn, async (req, res) => {

    const allAppointments = await Appointment.find({
        user: req.session.user._id
    });

    res.render("appointments/all-appointments.ejs",{appointments: allAppointments});

});

router.get("/new", isSignedIn, async (req, res) => {

    const providers = await User.find({
        role: "provider"
    });

    res.render("appointments/new.ejs", {
        providers
    });

});

router.post("/", isSignedIn, async (req, res) => {

   const createdAppointment = await Appointment.create({
    title: req.body.title,
    service: req.body.service,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    notes: req.body.notes,
    user: req.session.user._id,
    provider: req.body.provider
});
    res.redirect("/appointments");

});


router.get("/:appointmentId", isSignedIn, async (req, res) => {

    const foundAppointment = await Appointment.findById(
        req.params.appointmentId
    );
    res.render(
        "appointments/details.ejs",
        {appointment: foundAppointment}
    );
});
module.exports = router;
