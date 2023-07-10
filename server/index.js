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
app.use("https://restaurant-page-ayat.vercel.app/api/employees", employeeRoutes)
app.delete("https://restaurant-page-ayat.vercel.app/api/emplotees/:employeeId?", employeeRoutes)
app.put("https://restaurant-page-ayat.vercel.app/api/users/password", tokenVerification)
app.get("https://restaurant-page-ayat.vercel.app/api/users/",tokenVerification)
//app.delete("/api/users", tokenVerification)
app.delete("https://restaurant-page-ayat.vercel.app/api/users/:userId?", tokenVerification)
app.get("https://restaurant-page-ayat.vercel.app/api/users/user", tokenVerification)
app.use("https://restaurant-page-ayat.vercel.app/api/users", userRoutes)
app.put("https://restaurant-page-ayat.vercel.app/api/orders/:orderId", orderRoutes)
app.use("https://restaurant-page-ayat.vercel.app/api/orders", orderRoutes)
app.get("https://restaurant-page-ayat.vercel.app/api/orders", orderRoutes)
app.use("https://restaurant-page-ayat.vercel.app/api/auth", authRoutes)


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
