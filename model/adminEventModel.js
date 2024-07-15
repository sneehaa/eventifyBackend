const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminEventSchema = new Schema({
  adminEventName: {
    type: String,
    required: true,
  },
  adminEventDate: {
    type: Date,
    required: true,
  },
  adminEventTime: {
    type: String,
    required: true,
  },
  adminLocation: {
    type: String,
    required: true,
  },
  adminGeneralPrice: {
    type: Number,
    required: true,
  },
  adminFanpitPrice: {
    type: Number,
    required: true,
  },
  adminVipPrice: {
    type: Number,
    required: true,
  },
  adminImages: {
    type: [String],
    required: true,
  },
  adminCreatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const AdminEvent = mongoose.model("AdminEvent", adminEventSchema);

module.exports = AdminEvent;
