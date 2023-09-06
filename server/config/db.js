import mongoose from "mongoose"


const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`HOSTNAME - ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

export default connectDB