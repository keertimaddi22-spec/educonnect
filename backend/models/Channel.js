import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: String,
  instructor: String,

  members: [
    {
      student: String,
    },
  ],

  requests: [
    {
      student: String,
      status: {
        type: String,
        default: "pending", 
      },
    },
  ],
});

export default mongoose.model("Channel", channelSchema);