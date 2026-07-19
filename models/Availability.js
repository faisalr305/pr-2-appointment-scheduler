const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    slots: [
      {
        time: {
          type: String,
          required: true,
        },

        status: {
          type: String,
          enum: ["available", "booked", "blocked"],
          default: "available",
        },

        appointment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

availabilitySchema.index(
  { provider: 1, date: 1 },
  { unique: true }
);



availabilitySchema.pre("validate", function (next) {
  if (this.date) {
    this.day = this.date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  next();
});


const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);

module.exports = Availability;