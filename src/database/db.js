import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const connectDatabase = () => {
    console.log("wait connecting database")

    mongoose
        .connect(
            "mongodb+srv://victor:xJBNGEGnPcTFGSi7@breakingnews.zudaxla.mongodb.net/?retryWrites=true&w=majority", 
            {useNewUrlParser: true, useUnifiedTopology: true, }
        ).then(() => console.log("MongoDB Atlas Connected")).catch((error) => console.log(error))

    
};

export default connectDatabase;
