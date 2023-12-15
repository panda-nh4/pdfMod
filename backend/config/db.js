import mongoose from "mongoose";

// Configure MongoDB

const connectDB= async()=>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI) // Try connecting to DB using connection string from .env file
        console.log("Connected to DB")
    }
    catch(error){
        console.log(`Error: ${error.message}`); // If DB cannot be connected to, exit
        process.exit(1);
    }
}

export default connectDB