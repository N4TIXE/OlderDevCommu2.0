const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// เชื่อมต่อฐานข้อมูล
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ extended: false }));

// กำหนด Routes
app.use('/api', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));