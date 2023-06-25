const router = require("express").Router()
const { Employee, validate } = require("../models/employee")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
      }
  });
  
  const sendEmail = (recipient, subject, content) => {
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: recipient,
      subject: subject,
      text: content,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Błąd wysyłania e-maila:', error);
      } else {
        console.log('E-mail wysłany:', info.response);
      }
    });
  };


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
        const recipient = req.body.email
        const subject = 'Hasło do konta'
        const content = 'Gratulujemy zostania nowym pracownikiem w naszej restauracji, Twoje hasło logowania to: Marek123.' 
        sendEmail(recipient, subject, content);
        res.status(201).send({ message: "Employee created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    } 
})

      
module.exports = router