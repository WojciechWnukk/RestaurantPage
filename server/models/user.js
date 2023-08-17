const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    roles: { type: String, required: false },
    points: { type: Number, default: 0 }
}, { collection: "users" })
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    })
    return token
}
const User = mongoose.model("User", userSchema)
const validate = (data) => {
    const complexityOptions = {
        min: 8,
        max: 50,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity(complexityOptions).optional().label("Password"),
        roles: Joi.string()
            .valid("User", "Admin", "Employee")
            .label("Role")
            .optional(),
        points: Joi.number().optional().label("Points")
    })
    return schema.validate(data)
}
module.exports = { User, validate }