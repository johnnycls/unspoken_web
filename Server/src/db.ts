import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

const InitiateMongoServer = () => {
  try {
    if (MONGODB_URI) {
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGODB_URI);
      console.log("Connected to DB !!");
    }
  } catch (e) {
    console.log(JSON.stringify(e));
    throw e;
  }
};

export default InitiateMongoServer;
