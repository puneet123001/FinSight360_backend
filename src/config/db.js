import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }

  // Event listeners for resilience
  mongoose.connection.on("disconnected", () => {
    console.warn(" MongoDB disconnected. Retrying...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log(" MongoDB reconnected successfully.");
  });
};
