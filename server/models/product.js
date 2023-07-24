const mongoose = require("mongoose");
const Joi = require("joi")
const { ObjectId } = mongoose.Schema.Types;



const productSchema = new mongoose.Schema({
    productId: {
        type: String
    },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStatus: { type: String, required: false },
    productCategory: { type: String, required: true },
    productImage: { type: String, required: true }
})

productSchema.pre("save", function (next) {
    this.productId = this._id;
    next();
})

const Product = mongoose.model("Product", productSchema)

const validate = (data) => {
    const schema = Joi.object({
        productName: Joi.string().required(),
        productPrice: Joi.number().required(),
        productStatus: Joi.string().optional(),
        productCategory: Joi.string().required(),
        productImage: Joi.string().allow("", null),
    })
    return schema.validate(data)
}
module.exports = { Product, validate };
