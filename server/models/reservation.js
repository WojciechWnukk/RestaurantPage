const mongoose = require("mongoose");
const Joi = require("joi")

const reservationSchema = new mongoose.Schema({
    reservationDate: { type: String, required: true },
    reservationTime: { type: String, required: true },
    reservationTable: { type: String, required: true },
    reservationPerson: { type: String, required: true },
})

const Reservation = mongoose.model("Reservation", reservationSchema)

const validate = (data) => {
    const schema = Joi.object({
        reservationDate: Joi.string().required(),
        reservationTime: Joi.string().required(),
        reservationTable: Joi.string().required(),
        reservationPerson: Joi.string().required(),
    })
    return schema.validate(data)
}
module.exports = { Reservation, validate };