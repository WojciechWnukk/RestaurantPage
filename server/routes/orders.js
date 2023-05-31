const router = require("express").Router();
const Order = require("../models/order");


router.post("/", async (req, res) => {
  try {
    await new Order({...req.body}).save()
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/", async (req, res) => {
  //pobranie wszystkich użytkowników z bd:
  Order.find().exec()
  .then(async () => {
  const orders = await Order.find();
  //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
  res.status(200).send({ data: orders, message: "Lista użytkowników" });
  })
  .catch(error => {
  res.status(500).send({ message: error.message });
  });
 })

router.put("/:orderId", async (req, res) => {
  try{
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ data: order, message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;


/*
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
module.exports = router*/