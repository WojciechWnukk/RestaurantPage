const router = require("express").Router()
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.PRIVATE_STRIPE_KEY);


router.post("/", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
          line_items: req.body.meals.map((meal) => ({
            price_data: {
              currency: "pln",
              product_data: {
                name: meal.name,
              },
              unit_amount: meal.price,
            },
            quantity: meal.quantity,
          })),
          mode: "payment",
          success_url: `http://localhost:3000/order-success`,
          cancel_url: `http://localhost:3000/`,
          automatic_tax: { enabled: true },
        });
    
        res.json({ url: session.id });
      } catch (error) {
        console.error("Błąd podczas tworzenia sesji płatności:", error);
        res.status(500).json({ error: "An error occurred while creating the payment session." });
      }
    });
    
    module.exports = router;