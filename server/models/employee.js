const mongoose = require("mongoose")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")


const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date, required: true },
    hireDate: { type: Date, default: Date.now },
    pesel: { type: String, required: true },
    gender: { type: String, required: true },
    salary: { type: Number, required: true },
}, { collection: "employee" })

const Employee = mongoose.model("Employee", employeeSchema)
const validate = (data) => {

    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        birthDate: Joi.date().required().label("Birth Date"),
        hireDate: Joi.date().required().label("Hire Date"),
        pesel: Joi.string().required().label("PESEL"),
        gender: Joi.string().required().label("Gender"),
        salary: Joi.number().required().label("Salary")
    })
    return schema.validate(data)
}
module.exports = { Employee, validate }