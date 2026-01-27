const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(loggingMiddleware)

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', require('./controllers/authController'));
app.use('/api/users', require('./controllers/userController'));
app.use('/api/categories', require('./controllers/categoriesController'));

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server running on port ${process.env.PORT}`)
});
