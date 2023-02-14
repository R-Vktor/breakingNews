import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const connectDatabase = () => {
    console.log("wait connecting database")

    mongoose
        .connect( 
            process.env.MONGODB_URI, 
            {useNewUrlParser: true, useUnifiedTopology: true, }
        ).then(() => console.log("MongoDB Atlas Connected")).catch((error) => console.log(error))

    
};

export default connectDatabase;
