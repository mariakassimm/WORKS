const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "[MongoDB] MONGO_URI is missing. Check that a .env file exists in the " +
      "server/ folder and that it contains a real MONGO_URI value (not the " +
      "<user>/<password>/<cluster> placeholders from .env.example)."
    );
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
