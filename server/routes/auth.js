const router = require("express").Router()
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

// Obsługa nagłówków CORS
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://restaurant-page-pink.vercel.app'); // Zmień na rzeczywisty adres klienta na Vercel
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" })
        console.log("AAAAAAAAAA")
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        console.log("BBBB")
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Password" })
        const token = user.generateAuthToken();
        //const token = "Temp"
        console.log("Loginguje")
        res.status(200).send({ data: token, message: "logged in successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Errordsds" })
    }
})
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}
module.exports = router