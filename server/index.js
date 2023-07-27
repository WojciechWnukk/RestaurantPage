require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/orders")
const employeeRoutes = require("./routes/employees")
const paymentRoutes = require("./routes/payment")
const productRoutes = require("./routes/products")
//middleware
app.use(express.json())
app.use(cors())



const tokenVerification = require('./middleware/tokenVerification')

const connection = require('./db')
connection()

// routes
app.use("/api/employees", employeeRoutes)
app.get("/api/employees", employeeRoutes)
app.delete("/api/employees/:employeeId?", employeeRoutes)
app.put("/api/users/password", tokenVerification)
app.get("/api/users/", tokenVerification)
//app.delete("/api/users", tokenVerification)
app.delete("/api/users/:userId?", tokenVerification)
app.get("/api/users/user", tokenVerification)
app.use("/api/users", userRoutes)
app.put("/api/orders/:orderId", orderRoutes)
app.use("/api/orders", orderRoutes)
app.get("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/payment", paymentRoutes)

app.use("/api/products", productRoutes)
app.get("/api/products", productRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
