const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MongoDB Error: MONGO_URI is not set. Add your MongoDB connection string to the .env file as MONGO_URI=<your_connection_string>"
    );
    process.exit(1);
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error(
      "MongoDB Error: Invalid MONGO_URI scheme. Expected connection string to start with 'mongodb://' or 'mongodb+srv://'.",
      `Provided: ${uri}`
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
