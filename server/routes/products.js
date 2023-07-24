const router = require("express").Router()
const { Product, validate } = require("../models/product")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if(error)
            return res.status(400)
        const product = await Product.findOne({ email: req.body.email })
        if (product)
            return res
                .status(409)
                .send({message: "already Exist"})
        await new Product({ ...req.body }).save()
        res.status(201).send({ message: "created successfully"})
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router