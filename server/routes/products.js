const router = require("express").Router()
const { Product, validate } = require("../models/product")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: "Bad request"})
        const product = await Product.findOne({ productName: req.body.productName })
        if (product)
            return res
                .status(409).send({message: "already Exist"})
        await new Product({ ...req.body }).save()
        res.status(201).send({ message: "created successfully"})
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.get("/", async (req, res) => {
    Product.find().exec()
        .then(async () => {
            const products = await Product.find()
            res.status(200).send({ data: products, message: "Lista produktów"})
        })
        .catch(error => {
            res.status(500).send({ message: error.message })
        })
})

module.exports = router