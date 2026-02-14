const mongoose = require('mongoose');
const dotenv = require('dotenv');
const UserPrompt = require('../models/UserPrompt');
const connectDB = require('../config/db');

dotenv.config({ path: '../.env' }); // Adjust path if running from src/scripts

const seedData = async () => {
    await connectDB();

    console.log('Seeding Data...');

    // Clear existing
    await UserPrompt.deleteMany();

    // Create UserPrompt
    await UserPrompt.create({
        promptText: 'Collect testimonials for my pizza restaurant',
        interviewGoal: 'Get customers to talk about the crispy crust and fresh toppings.',
        intentMap: ['Favorite Pizza', 'Service Experience', 'Recommendation']
    });

    console.log('Data Seeded!');
    process.exit();
};

seedData();
