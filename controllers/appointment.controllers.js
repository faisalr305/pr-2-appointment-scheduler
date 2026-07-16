const Appointment = require("../models/appointments.js");

const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in.js");


router.get("/", isSignedIn, async (req, res) => {

    const allAppointments = await Appointment.find({
        user: req.session.user._id
    });

    res.render("appointments/all-appointments.ejs",{appointments: allAppointments});

});

router.get("/new", isSignedIn, (req, res) => {

    res.render("appointments/new.ejs");

});

router.post("/", isSignedIn, async (req, res) => {

    const createdAppointment = await Appointment.create({

        title: req.body.title,

        service: req.body.service,

        date: req.body.date,

        startTime: req.body.startTime,

        endTime: req.body.endTime,

        notes: req.body.notes,

        user: req.session.user._id

    });


    res.redirect("/appointments");

});


module.exports = router;
