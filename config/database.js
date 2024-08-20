import mongoose from "mongoose";
// MONGO_URI=mongodb://127.0.0.1/gbuMovies 
// MONGO_URI=mongodb+srv://sachin891singh:WhN6ECnUoCwa6fC5@gbumovies.uf7okr7.mongodb.net/?retryWrites=true 
export const connectDB = async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected with ${connection.host}`);
};
