const router = require("express").Router();

const User = require("../models/User.js");
const Appointment = require("../models/appointments.js");

const isSignedIn = require("../middleware/is-signed-in.js");
const requireRole = require("../middleware/require-role.js");


router.get(
    "/providers",
    isSignedIn,
    requireRole("customer"),
    async (req, res) => {

        const providers = await User.find({
            role: "provider"
        });

        res.render("users/providers.ejs", {
            providers
        });

    }
);





module.exports = router;