import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    qrScans: {
      type: Number,
      required: true,
      default: 0,
    },
    accessLogs: [
      {
        type: {
          type: String,
          enum: ["click", "qr"],
          default: "click",
        },
        ip: String,
        userAgent: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default shortUrl;
