const mongoose = require("mongoose");
const Joi = require("joi")
const { ObjectId } = mongoose.Schema.Types;



const orderSchema = new mongoose.Schema({
    orderId: {type: ObjectId, default: () => new mongoose.Types.ObjectId()},
    meals: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: String, required: true },
        },
      ],
    tableNumber: {type: Number, required: false},//zmienic na true 
    totalPrice: {type: Number, required: true},
    status: {type: String, required: false},
    comments: {type: String, default: null},
    userToken: {type: String, required: true},
    orderDate: {type: Date, default: Date.now}
})



const Order = mongoose.model("Order", orderSchema)

const validate = (data) => {
    const schema = Joi.object({
      meals: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.string().required(),
        })
      ),
      tableNumber: Joi.number().required(),
      totalPrice: Joi.number().required(),
      status: Joi.string().optional(),
      comments: Joi.string().allow("", null),
      userToken: Joi.string().required(),
      orderDate: Joi.date().optional(),
    })
    return schema.validate(data)
}
module.exports = {Order, validate};
