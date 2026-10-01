import mongoose from "mongoose";

const connectDB = async () : Promise<void> => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("MongoDB Connected Successfully!");
    }catch(error){
        console.log("MongoDB Connection Failed");
        process.exit(1);
    }
};
export default connectDB;