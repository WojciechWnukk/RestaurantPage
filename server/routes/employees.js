const router = require("express").Router()
const { Employee, validate } = require("../models/employee")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const employee = await Employee.findOne({ email: req.body.email })
        if (employee)
            return res
                .status(409)
                .send({ message: "Employee with given email already Exist!" })
        await new Employee({ ...req.body }).save()
        res.status(201).send({ message: "Employee created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    } 
})

      
module.exports = router