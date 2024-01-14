const router = require("express").Router();
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.PRIVATE_STRIPE_KEY);
const { Order } = require("../models/order");

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
      success_url: `${process.env.HOSTING_CLIENT}/order-success`,
      cancel_url: `${process.env.HOSTING_CLIENT}/`,
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
    };
    const order = new Order(orderData);
    await order.save();

    res.json({ url: session.id });
  } catch (error) {
    console.error("Błąd podczas tworzenia sesji płatności:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the payment session." });
  }
});

router.post("/payment-sheet", async (req, res) => {
  try {
    const {
      userEmail,
      userToken,
      tableNumber,
      comments,
      meals,
      totalPrice
    } = req.body;

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    // Tworzenie zamówienia
    const orderData = {
      tableNumber: tableNumber,
      comments: comments,
      meals: meals,
      totalPrice: totalPrice,
      userToken: userToken,
      userEmail: userEmail,
      orderRate: 0,
      status: "Zamówiono",
      paymentStatus: "Oplacono",
    };

    // Zapis zamówienia w bazie danych
    const order = new Order(orderData);
    await order.save();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'pln',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51NUCO4CTvIeCfZ48NcnZga4vVwWBjMV21jqsmPWuBgc9i6CSHUQIfC3hIgjBrdOiu5uMosaLlwmEhQzrWPEAdqYZ00NcG5v8jk'
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia płatności za pomocą payment-sheet:", error);
    res.status(500).json({ error: "An error occurred while creating the payment with payment-sheet." });
  }
});

module.exports = router;
