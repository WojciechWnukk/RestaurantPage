require('dotenv').config()
const express = require('express')
const app1 = express()
const cors = require('cors')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/orders")
const employeeRoutes = require("./routes/employees")
//middleware
app1.use(express.json())
app1.use(cors())


// Obsługa nagłówków CORS
app1.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://restaurant-page-pink.vercel.app'); // Zmień na rzeczywisty adres klienta na Vercel
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

const tokenVerification = require('./middleware/tokenVerification')

const connection = require('./db')
connection()

// routes
app1.use("/api/employees", employeeRoutes)
app1.delete("/api/emplotees/:employeeId?", employeeRoutes)
app1.put("/api/users/password", tokenVerification)
app1.get("/api/users/",tokenVerification)
//app.delete("/api/users", tokenVerification)
app1.delete("/api/users/:userId?", tokenVerification)
app1.get("/api/users/user", tokenVerification)
app1.use("/api/users", userRoutes)
app1.put("/api/orders/:orderId", orderRoutes)
app1.use("/api/orders", orderRoutes)
app1.get("/api/orders", orderRoutes)
app1.use("/api/auth", authRoutes)


const port = process.env.PORT || 8080
app1.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
