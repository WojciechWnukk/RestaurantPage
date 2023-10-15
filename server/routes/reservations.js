const router = require("express").Router();
const { Reservation, validate } = require("../models/reservation");

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const reservation = new Reservation({
    reservationDate: req.body.reservationDate,
    reservationTime: req.body.reservationTime,
    reservationTable: req.body.reservationTable,
    reservationPerson: req.body.reservationPerson,
    reservationComment: req.body.reservationComment,
  });
  await reservation.save();
  res.send(reservation);
  sendEmail(
    req.body.reservationPerson,
    "Rezerwacja",
    `Dziękujemy za rezerwację w naszej restauracji. Poniżej znajdują się szczegóły rezerwacji: \n Data: ${req.body.reservationDate} \n Godzina: ${req.body.reservationTime} \n Stolik dla ${req.body.reservationTable} osób. W razie jakikolwiek pytań zapraszamy do kontaktu z nami pod numerem 123 456 789. \n Pozdrawiamy, \n Zespół restauracji`
  );
});

router.get("/", async (req, res) => {
  Reservation.find()
    .exec()
    .then(async () => {
      const reservations = await Reservation.find();
      res.status(200).send({ data: reservations, message: "Lista rezerwacji" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

module.exports = router;
