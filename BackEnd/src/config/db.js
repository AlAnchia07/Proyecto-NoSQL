const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI; 
      //"mongodb://localhost:27017/BiteUp"

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
    console.log("Base:", mongoose.connection.name);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;