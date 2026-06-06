const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected for seeding');

        const adminEmail = 'admin@gmail.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        const admin = await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: 'password123', // Model should hash this if pre-save hook is set up
            role: 'admin',
        });

        console.log('Admin user seeded successfully:', admin.email);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
