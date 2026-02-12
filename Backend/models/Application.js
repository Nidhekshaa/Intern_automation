const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Approved", "Rejected", "Completed"],
      default: "Applied",
    },
    meetingLink: String,
    interviewDateTime: Date,
    timeline: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    offerLetter: { type: String },
    certificate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
