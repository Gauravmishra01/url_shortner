import mongoose from "mongoose";

const waitForMongoReady = async (timeoutMs) => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("MongoDB is still starting up"));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      mongoose.connection.off("connected", onConnected);
    };

    const onConnected = () => {
      cleanup();
      resolve();
    };

    mongoose.connection.once("connected", onConnected);
  });
};

export const ensureDatabaseReady = async (req, res, next) => {
  const timeoutMs = Number(process.env.MONGO_READY_TIMEOUT_MS || 25000);

  try {
    await waitForMongoReady(timeoutMs);
    next();
  } catch (error) {
    return res.status(503).json({
      message:
        "The authentication service is still starting up. Please try again in a moment.",
    });
  }
};
