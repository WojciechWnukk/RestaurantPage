const router = require("express").Router()
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    } 
})

router.get("/", async (req, res) => {
    //pobranie wszystkich użytkowników z bd:
    User.find().exec()
    .then(async () => {
    const users = await User.find();
    //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
    res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
    res.status(500).send({ message: error.message });
    });
   })

router.delete("/", async (req, res) => {
    try {
        const id = req.user._id
        console.log(id)
        await User.findByIdAndRemove(id)
        res.status(200).send({ message: "User deleted successfully" })
        
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
      }
    })

module.exports = router