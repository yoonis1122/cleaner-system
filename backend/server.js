const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}

// Export the Express API for Vercel Serverless Functions
module.exports = app;
