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
const reservationRoutes = require("./routes/reservations")
const tableRoutes = require("./routes/tables")

//middleware
app.use(express.json())
app.use(cors())



const tokenVerification = require('./middleware/tokenVerification')

const connection = require('./db')
connection()

// routes
app.get("/api/employees", employeeRoutes)
app.put("/api/employees/:employeeId", employeeRoutes)
app.delete("/api/employees/:employeeId?", employeeRoutes)
app.use("/api/employees", employeeRoutes)


app.put("/api/users/:userId", userRoutes)
app.put("/api/users/password", tokenVerification)
app.put("/api/users/phoneNumber", tokenVerification)
app.put("/api/users/points/:userEmail", userRoutes)
app.get("/api/users/", tokenVerification)
//app.delete("/api/users", tokenVerification)
app.delete("/api/users/:userId?", tokenVerification)
app.get("/api/users/user", tokenVerification)
app.get("/api/users/:userEmail", userRoutes)
app.use("/api/users", userRoutes)

app.put("/api/orders/:orderId", orderRoutes)
app.use("/api/orders", orderRoutes)
app.get("/api/orders", orderRoutes)
app.get("/api/orders/:orderId", orderRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/payment", paymentRoutes)

app.put("/api/products/:productId", productRoutes)
app.use("/api/products", productRoutes)
app.get("/api/products", productRoutes)

app.post("/api/reservations", reservationRoutes)
app.use("/api/reservations", reservationRoutes)

app.get("/api/tables", tableRoutes)
app.put("/api/tables/:tableId", tableRoutes)
app.use("/api/tables", tableRoutes)



const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
