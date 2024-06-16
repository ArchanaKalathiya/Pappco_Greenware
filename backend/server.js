console.log(`Working directory: ${process.cwd()}`);
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
const quotationRoutes = require('./routes/quotationRoute');
const contactRoute = require('./routes/contactRoute');
const errorHandler = require('./middlewares/errorMiddleware');
const cookieParser = require("cookie-parser");
const path = require("path")

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/uploads",express.static(path.join(__dirname, "uploads")))

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/contactus', contactRoute);

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
