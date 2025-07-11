const express = require('express');
const cors = require('cors');
const dbConnection = require('./src/config/dbConnect');
const authRoute = require('./src/routes/authRoute');
const categoryRoute = require('./src/routes/categoryRoute');
const productRoute = require('./src/routes/productRoute');
const userRoute = require('./src/routes/userRoute');
require('dotenv').config();

dbConnection();

const app = express();
const path = require('path');

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);

