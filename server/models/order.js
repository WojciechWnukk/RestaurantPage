const mongoose = require("mongoose");
const Joi = require("joi")
const { ObjectId } = mongoose.Schema.Types;
const orderSchema = new mongoose.Schema({
    orderId: {type: ObjectId, default: () => new mongoose.Types.ObjectId()},
    meals: [
        {
            name: {type: String, required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true},
        }
    ],
    tableNumber: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    status: {type: String, required: false},
    comments: {type: String, required: false},
    orderDate: {type: Date, default: Date.now}
})
const Order = mongoose.model("Order", orderSchema)
/*
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}*/
module.exports = Order;
