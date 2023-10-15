const router = require("express").Router();
const { Order, validate } = require("../models/order");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
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
      console.log("Błąd wysyłania e-maila:", error);
    } else {
      console.log("E-mail wysłany:", info.response);
    }
  });
};

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).send({ message: errorMessage });
    }

    const orderData = { ...req.body };
    if (orderData.comments === "") {
      orderData.comments = null;
    }

    const order = new Order(orderData);
    if (order.comments === null) {
      order.comments = "";
    }

    await order.save();
    res.status(201).json({ message: "Order created successfully" });
    const recipient = req.body.userEmail;
    const subject = "Zamówienie w restaurantsystemPOS";
    const content = `Dziękujemy za złożenie zamówienia w naszej restauracji. Twoje danie jest już przygotowywane przez naszego szefa kuchni. Życzymy smacznego! :) Całkowita wartość zamówienia to ${req.body.totalPrice}zł`;
    sendEmail(recipient, subject, content);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.log("Validation error details:", error.response.data.message);
    } else {
      console.log("Error creating order:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  Order.find()
    .exec()
    .then(async () => {
      const orders = await Order.find();
      res.status(200).send({ data: orders, message: "Lista użytkowników" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

router.get("/:orderId", async (req, res) => {
  Order.findById(req.params.orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ data: order, message: "Order found" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, orderRate, modifyOrder } = req.body;

    if (status) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res
        .status(200)
        .json({ data: order, message: "Order status updated successfully" });
    } else if (orderRate) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderRate },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res
        .status(200)
        .json({ data: order, message: "Order Rate updated successfully" });
    } else if (modifyOrder) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { modifyOrder },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ data: order, message: "Modified successfully" });
      console.log("Zmodyfikowano");
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
