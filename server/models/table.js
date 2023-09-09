const mongoose = require("mongoose")
const Joi = require("joi")

const tableSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    tableNumber: { type: Number, required: true },
    tableCapacity: { type: Number, required: true },
    tableStatus: { type: String, required: true },
})

const Table = mongoose.model("Table", tableSchema)

const validate = (data) => {
    const schema = Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        tableNumber: Joi.number().required(),
        tableCapacity: Joi.number().required(),
        tableStatus: Joi.string().required(),
    })
    return schema.validate(data)
}
module.exports = { Table, validate };