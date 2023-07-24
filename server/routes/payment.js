const router = require("express").Router()
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.PRIVATE_STRIPE_KEY);
const { Order } = require("../models/order")

router.post("/", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.meals.map((meal) => ({
        price_data: {
          currency: "pln",
          product_data: {
            name: meal.name,
          },
          unit_amount: parseFloat(meal.price.replace(/\D/g, "")),
        },
        quantity: meal.quantity,
      })),
      mode: "payment",
      success_url: `http://localhost:3000/order-success`,
      cancel_url: `http://localhost:3000/`,
      automatic_tax: { enabled: true },
    });
    const orderData = {
      tableNumber: req.body.tableNumber,
      comments: req.body.comments,
      meals: req.body.meals,
      totalPrice: req.body.totalPrice,
      userToken: req.body.userToken,
      userEmail: req.body.userEmail,
      orderRate: 0,
      status: "Zamówiono",
      paymentStatus: "Oplacono",
      paymentSessionId: session.id,
    }
    const order = new Order(orderData)
    await order.save()

    res.json({ url: session.id });
  } catch (error) {
    console.error("Błąd podczas tworzenia sesji płatności:", error);
    res.status(500).json({ error: "An error occurred while creating the payment session." });
  }
});




module.exports = router;