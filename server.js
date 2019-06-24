const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 1707;

// Connect Database
connectDB();
//Init Middleware

app.use(express.json());

const whitelist = [
  'http://localhost:3000',
  'https://trinhtodo.netlify.com/',
  'https://trinhtodo-new-api.herokuapp.com/'
];

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', function(req, res) {
  res.send('Welcome to Trinhtodo API');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
