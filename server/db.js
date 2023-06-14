const mongoose = require("mongoose")

module.exports = () => {
    const databaseName = process.env.DB_NAME;

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    }
    try {
        mongoose.connect(process.env.DB, connectionParams)
        console.log("Connected to database successfully")
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!")
    }
}
