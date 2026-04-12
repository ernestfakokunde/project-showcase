import mongoose from 'mongoose';

export const connectDB = async ()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    console.warn('⚠️  Database connection failed. Server will continue but database operations will fail.')
    // Don't exit - let server continue so we can debug
  }
}