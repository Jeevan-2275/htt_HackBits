const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds before timeout
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️  MongoDB Connection Failed: ${error.message}`);
        console.warn('⚠️  Server will run in development mode without database persistence');
        // Continue without database connection in development
    }
};

module.exports = connectDB;
