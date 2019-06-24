const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 1707;

// Connect Database
connectDB();
//Init Middleware

app.use(express.json());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/auth', require('./routes/auth'));

// Serve static assets in production
if (process.env.NODE_DEV === 'production') {
  //set statis folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
