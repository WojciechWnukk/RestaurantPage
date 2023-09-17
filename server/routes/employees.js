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

router.get("/", async (req, res) => {
  Employee.find().exec()
    .then(async () => {
      const employees = await Employee.find();
      res.status(200).send({ data: employees, message: "Lista pracowników" });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
})



router.put("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params
    const { firstName, lastName, phoneNumber, email, birthDate, pesel, salary } = req.body
    if (firstName && lastName && phoneNumber && email && birthDate && pesel && salary) {
      const employee = await Employee.findByIdAndUpdate(employeeId, { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email: email, birthDate: birthDate, pesel: pesel, salary: salary })

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json({ data: employee, message: "Employee updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

router.delete("/:employeeId?", async (req, res) => {
  try {
    const { employeeId } = req.params

    if (employeeId) {
      await Employee.findByIdAndRemove(employeeId)
      res.status(200).send({ message: "Employee deleted" })
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

module.exports = router