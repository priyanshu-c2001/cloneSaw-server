require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mailRoutes = require('./routes/mailSendRoute');

app.use(cors({
    origin: "https://clone-saw-client.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/posts', publicRoutes); 
app.use('/admin', adminRoutes);
app.use('/mail', mailRoutes);

connectDB().then(() => {
    console.log("Database Connection Established...");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Database cannot be connected!!");
    console.error(error);
});