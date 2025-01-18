// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Configuration
// const mongoURI = 'mongodb+srv://themanya473:OL6OOz9m4MYJZ9mD@cluster0.5m95y.mongodb.net/';
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Data Schema and Model
// const dataSchema = new mongoose.Schema({
//   // Define the data schema here
//   name: String,
//   age: Number,
// });

// const Data = mongoose.model('Data', dataSchema);

// // API Routes
// app.post('/api/saveData', async (req, res) => {
//   try {
//     const { data } = req.body;

//     // Insert data into the database
//     await Data.insertMany(data);
//     console.log('Data saved to MongoDB');

//     res.status(200).json({ message: 'Data saved to MongoDB' });
//   } catch (error) {
//     console.error('Error saving data to MongoDB:', error);
//     res.status(500).json({ error: 'Error saving data to MongoDB' });
//   }
// });

// // Start the server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); // For creating the server
const { Server } = require('socket.io'); // For WebSocket communication

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Configuration
const mongoURI = process.env.MONGODB_URI
// const mongoURI = 'mongodb+srv://themanya473:OL6OOz9m4MYJZ9mD@cluster0.5m95y.mongodb.net/';
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

// Create an HTTP server for Socket.IO
const server = http.createServer(app);

// Integrate Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Stock price generator for live updates
let lastPrice = 100; // Initial stock price
let day = 0;

io.on('connection', (socket) => {
  console.log('New client connected');

  const interval = setInterval(() => {
    const changePercent = Math.random() * 2; // Random percent change
    const changeAmount = lastPrice * (changePercent / 100);
    lastPrice += Math.random() > 0.5 ? changeAmount : -changeAmount;

    const stockData = {
      price: parseFloat(lastPrice.toFixed(2)), // Format to 2 decimal places
      day: ++day,
    };

    socket.emit('stockData', stockData); // Emit live stock price
  }, 2000); // Emit every 2 seconds

  socket.on('disconnect', () => {
    clearInterval(interval); // Clean up interval on disconnect
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
