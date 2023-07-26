const mongoose = require("mongoose");
const Joi = require("joi")
const { ObjectId } = mongoose.Schema.Types;



const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    productStatus: { type: String, required: false },
    productCategory: { type: String, required: true },
    productImage: { type: String, required: true }
})


const Product = mongoose.model("Product", productSchema)

const validate = (data) => {
    const schema = Joi.object({
        productName: Joi.string().required(),
        productPrice: Joi.string().required(),
        productStatus: Joi.string().optional(),
        productCategory: Joi.string().required(),
        productImage: Joi.string().required(),
    })
    return schema.validate(data)
}
module.exports = { Product, validate };
