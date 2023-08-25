const mongoose = require("mongoose");
const Joi = require("joi")

const reservationSchema = new mongoose.Schema({
    reservationDate: { type: String, required: true },
    reservationTime: { type: Number, required: true },
    reservationTable: { type: Number, required: true },
    reservationPerson: { type: String, required: true },
    reservationComment: { type: String, required: false },
})

const Reservation = mongoose.model("Reservation", reservationSchema)

const validate = (data) => {
    const schema = Joi.object({
        reservationDate: Joi.string().required(),
        reservationTime: Joi.number().required(),
        reservationTable: Joi.number().required(),
        reservationPerson: Joi.string().required(),
        reservationComment: Joi.string().allow(null, '')
    })
    return schema.validate(data)
}
module.exports = { Reservation, validate };