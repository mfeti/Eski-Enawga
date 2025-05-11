import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Database connected successfully!`);
  } catch (err) {
    console.log("Database error: ", err);
  }
};

export default connectToDB;
