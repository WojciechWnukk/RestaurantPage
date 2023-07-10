/*
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/orders")
const employeeRoutes = require("./routes/employees")
//middleware
app.use(express.json())
app.use(cors())

const tokenVerification = require('./middleware/tokenVerification')

const connection = require('./db')
connection()

// routes
app.use("/api/employees", employeeRoutes)
app.delete("/api/emplotees/:employeeId?", employeeRoutes)
app.put("/api/users/password", tokenVerification)
app.get("/api/users/",tokenVerification)
//app.delete("/api/users", tokenVerification)
app.delete("/api/users/:userId?", tokenVerification)
app.get("/api/users/user", tokenVerification)
app.use("/api/users", userRoutes)
app.put("/api/orders/:orderId", orderRoutes)
app.use("/api/orders", orderRoutes)
app.get("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
*/
// server.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const employeeRoutes = require('./routes/employees');

const app = express();

app.use(express.json());
app.use(cors());

const tokenVerification = require('./middleware/tokenVerification');

// routes
app.use('/api/employees', employeeRoutes);
app.delete('/api/emplotees/:employeeId?', employeeRoutes);
app.put('/api/users/password', tokenVerification);
app.get('/api/users/', tokenVerification);
app.delete('/api/users/:userId?', tokenVerification);
app.get('/api/users/user', tokenVerification);
app.use('/api/users', userRoutes);
app.put('/api/orders/:orderId', orderRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
