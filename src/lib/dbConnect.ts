//https://chatgpt.com/share/8c7e99ff-7351-4d73-873c-0ee280e76dad
import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("DB is connected already")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")

        connection.isConnected=db.connections[0].readyState

        console.log("DB connected succesfully")
        
    } catch (error) {

        console.log("DB connection failed",error)
        process.exit(1);
    }
} 

export default dbConnect;
