const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const errorHandler = require('./middlewares/errorMiddleware');
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
