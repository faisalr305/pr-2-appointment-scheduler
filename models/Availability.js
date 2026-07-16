const mongoose = require("mongoose");

const availiblitySchema = new mongoose.Schema({

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    day: {
        type: String,
        required: true,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
    },

    availableSlots: [
        { type: String, },],
}, { timestamps: true });



const Availiblity = mongoose.model("Availiblity", availiblitySchema);

module.exports = Availiblity;
