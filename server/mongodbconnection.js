import mongoose from "mongoose";

const mongodb = async () => {

  try {

    const uri = "mongodb+srv://lakshayyadav0014_db_user:Lakshay1234@cluster0.4qmjepe.mongodb.net/test?retryWrites=true&w=majority";

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");

  } catch (error) {

    console.error("❌ Database connection error:", error.message);

  }

};

export default mongodb;