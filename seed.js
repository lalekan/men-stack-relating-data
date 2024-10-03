// Load environment variables
require('dotenv').config();
const mongoose = require('mongoose'); // Import mongoose
const User = require('./models/user'); // Import the User model
const Food = require('./models/food'); // Import the Food model

// Dummy data for users
const users = [
    { username: 'user1', email: 'user1@example.com', password: 'password1' },
    { username: 'user2', email: 'user2@example.com', password: 'password2' },
];

// Dummy data for food
const foods = [
    {
        name: 'Apples',
        calories: 95,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire in 7 days
        userId: null, // Will be filled in after user creation
    },
    {
        name: 'Bananas',
        calories: 105,
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Expire in 10 days
        userId: null, // Will be filled in after user creation
    },
];

async function seedDatabase() {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connection successful');

        // Clear existing data
        await User.deleteMany({});
        await Food.deleteMany({});

        // Seed users
        const createdUsers = await User.insertMany(users);
        console.log('Dummy users added:', createdUsers);

        // Assign user IDs to food items
        foods.forEach((food, index) => {
            food.userId = createdUsers[index % createdUsers.length]._id; // Assign userId
        });

        // Seed food
        const createdFoods = await Food.insertMany(foods);
        console.log('Dummy foods added:', createdFoods);
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
}

// Run the seed function
seedDatabase();
