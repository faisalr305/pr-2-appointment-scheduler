const Appointment = require("../models/appointments.js");
const User = require("../models/User.js");
const Availability = require("../models/Availability.js");
const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const requireRole = require("../middleware/require-role.js");

router.get("/", isSignedIn, requireRole("customer"), async (req, res) => {
    try {
        const allAppointments = await Appointment.find({
            customer: req.session.user._id
        }).populate("provider").populate("availability").sort({ date: 1 });

        res.render("appointments/all-appointments.ejs", {
            appointments: allAppointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get("/new", isSignedIn, requireRole("customer"), async (req, res) => {
    try {
        const providers = await User.find({ role: "provider" });
        const availabilities = await Availability.find({
            "slots.status": "available"
        }).populate("provider");

        res.render("appointments/new.ejs", {
            providers,
            availabilities
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.post("/", isSignedIn, requireRole("customer"), async (req, res) => {
    try {
        if (!req.body.selectedSlot) {
            return res.status(400).send("Please select an available time slot.");
        }

        const [availabilityId, time] = req.body.selectedSlot.split("|");
        const availability = await Availability.findById(availabilityId);

        if (!availability) {
            return res.status(404).send("Availability not found");
        }

        const slot = availability.slots.find(slot => slot.time === time);

        if (!slot) {
            return res.status(404).send("Time slot not found");
        }

        if (slot.status !== "available") {
            return res.status(400).send("This slot is already booked");
        }

        const appointment = await Appointment.create({
            customer: req.session.user._id,
            provider: availability.provider,
            availability: availability._id,
            service: req.body.service,
            date: availability.date,
            startTime: time,
            endTime: time,
            notes: req.body.notes,
            status: "pending"
        });

        slot.status = "booked";
        slot.appointment = appointment._id;

        await availability.save();

        res.redirect("/appointments");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get("/provider-dashboard", isSignedIn, requireRole("provider"), async (req, res) => {
    try {
        const appointments = await Appointment.find({
            provider: req.session.user._id
        }).populate("customer").populate("provider").populate("availability").sort({
            date: 1
        });

        res.render("appointments/provider-dashboard.ejs", {
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.put("/:appointmentId/accept", isSignedIn, requireRole("provider"), async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.appointmentId,
                provider: req.session.user._id
            },
            {
                status: "confirmed"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.redirect("/appointments/provider-dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.put("/:appointmentId/cancel", isSignedIn, requireRole("provider"), async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.appointmentId,
                provider: req.session.user._id
            },
            {
                status: "cancelled"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.redirect("/appointments/provider-dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.put("/:appointmentId/complete", isSignedIn, requireRole("provider"), async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.appointmentId,
                provider: req.session.user._id
            },
            {
                status: "completed"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.redirect("/appointments/provider-dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.put("/:appointmentId/reschedule", isSignedIn, requireRole("provider"), async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.appointmentId,
                provider: req.session.user._id
            },
            {
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                status: "rescheduled"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.redirect("/appointments/provider-dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get("/:appointmentId/edit", isSignedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.render("appointments/edit.ejs", {
            appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.put("/:appointmentId", isSignedIn, async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            req.body
        );

        res.redirect("/appointments/" + req.params.appointmentId);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.delete("/:appointmentId", isSignedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        const availability = await Availability.findById(appointment.availability);

        if (availability) {
            const slot = availability.slots.find(
                slot => slot.time === appointment.startTime
            );

            if (slot) {
                slot.status = "available";
                slot.appointment = null;
                await availability.save();
            }
        }

        await Appointment.findByIdAndDelete(req.params.appointmentId);

        if (req.session.user.role === "provider") {
            return res.redirect("/appointments/provider-dashboard");
        }

        res.redirect("/appointments");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get("/:appointmentId", isSignedIn, async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.appointmentId
        ).populate("customer").populate("provider").populate("availability");

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        res.render("appointments/details.ejs", {
            appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});


router.post("/search", isSignedIn, async (req, res) => {
    try {
        const availabilitiesForProvider = await Availability.find({
            provider: req.body.provider
        });
        const providers = await User.find({ role: "provider" });

        res.render("appointments/new.ejs", {
            providers,
            availabilities: availabilitiesForProvider
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

module.exports = router;