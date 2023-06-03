require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/orders")
//middleware
app.use(express.json())
app.use(cors())

const tokenVerification = require('./middleware/tokenVerification')

const connection = require('./db')
connection()

// routes
app.put("/api/users/password", tokenVerification)
app.get("/api/users/",tokenVerification)
app.delete("/api/users", tokenVerification)
app.get("/api/users/user", tokenVerification)
app.use("/api/users", userRoutes)
app.put("/api/orders/:orderId", orderRoutes)
app.use("/api/orders", orderRoutes)
app.get("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
