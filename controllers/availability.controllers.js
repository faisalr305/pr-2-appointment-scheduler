const router = require("express").Router();

const Availability = require("../models/Availability.js");
const User = require("../models/User.js");

const isSignedIn = require("../middleware/is-signed-in.js");
const requireRole = require("../middleware/require-role.js");

router.get("/",isSignedIn,requireRole("provider"),
    async (req, res) => {
        const availability = await Availability.find({
            provider: req.session.user._id
        });

        res.render("availability/index.ejs", {
            availability
        });
    }
);

router.get("/new",isSignedIn,requireRole("provider"),
    (req, res) => {

        res.render("availability/new.ejs");
    }
);


router.post("/",isSignedIn,requireRole("provider"),
    async (req, res) => {
        try {

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

            } else {

                await Availability.create({
                    provider: req.session.user._id,
                    date: selectedDate,
                    slots
                });
            }

            res.redirect("/availability");

        } catch (error) {

            console.log(error);

            res.status(500).send(error.message);

        }
    }
);

router.get( "/provider/:providerId",isSignedIn,requireRole("customer"),
    async (req, res) => {

        const provider = await User.findOne({
            _id: req.params.providerId,
            role: "provider"
        });

        if (!provider) {
            return res.status(404).send("Provider not found");
        }

        const availability = await Availability.find({
            provider: provider._id
        }).sort({ date: 1 });

        res.render(
            "availability/provider-availability.ejs",
            {
                provider,
                availability
            }
        );

    }
);


module.exports = router;