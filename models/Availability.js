const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      default: null,
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
  {
    timestamps: true,
  }
);

availabilitySchema.index(
  { provider: 1, date: 1 },
  { unique: true }
);

availabilitySchema.pre("validate", function () {
  if (this.date) {
    this.day = new Date(this.date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }
});

module.exports =
  mongoose.models.Availability ||
  mongoose.model("Availability", availabilitySchema);