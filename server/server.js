const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require("passport");
const session = require('express-session');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");

// Passport config
require("./config/passport-config")(passport);

// Session middleware
app.use(
  session({
    secret: '86485824e5de4935d285cbe3616ee00d56f07179832483f7d04a09694baba93e9538c31b66286eb0f50062c27bc164cdaa75a48bb6b6aacc23d243245fea721d',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/authentication", authRoutes);

// MongoDB Configuration
const mongoURI = 'mongodb+srv://21je0110:21je0110@cluster0.39gch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB connection URL
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Data Schema and Model
const dataSchema = new mongoose.Schema({
  // Define the data schema here
  name: String,
  age: Number,
});

const Data = mongoose.model('Data', dataSchema);

// API Routes
app.post('/api/saveData', async (req, res) => {
  try {
    const { data } = req.body;

    // Insert data into the database
    await Data.insertMany(data);
    console.log('Data saved to MongoDB');

    res.status(200).json({ message: 'Data saved to MongoDB' });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).json({ error: 'Error saving data to MongoDB' });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
