import mongoose from "mongoose";

const connectDB = async ({ retries = 5, delayMs = 5000 } = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "MongoDB connection string `MONGO_URI` is not set in environment.",
    );
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${error.message}`,
      );
      if (attempt < retries) {
        const wait = delayMs * attempt;
        console.log(
          `Retrying in ${wait / 1000}s... (${attempt + 1}/${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, wait));
        continue;
      }
      console.error(
        "All MongoDB connection attempts failed. Server will continue running without DB connection.",
      );
      console.error("Recommended actions:");
      console.error(
        "- Verify `MONGO_URI` in BACKEND/.env or your hosting environment.",
      );
      console.error(
        "- Ensure the Atlas user exists and the password is correct.",
      );
      console.error(
        "- Whitelist your IP or allow access from your host (Atlas Network Access).",
      );
      return false;
    }
  }
};

export default connectDB;
