const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date:  { type: Date, default: Date.now },
});

// Virtual for book's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/message/${this._id}`;
});

MessageSchema.virtual('date_formatted').get(function () {
    return this.date
      ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
      : '';
  });

// Export model
module.exports = mongoose.model("Message", MessageSchema);
