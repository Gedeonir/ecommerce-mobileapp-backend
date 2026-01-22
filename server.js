const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server running on port ${process.env.PORT}`)
});
