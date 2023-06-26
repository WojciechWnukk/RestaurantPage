const router = require("express").Router()
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');


const generateRandomPassword = () => {
  const length = 8; // Długość generowanego hasła
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

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
        const { password, roles } = req.body
        const user = await User.findOne({ email: req.body.email })
        if (user){
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
        }
        let generatedPassword = null;
        if (roles === "Employee") {
            generatedPassword = generateRandomPassword();
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(generatedPassword || password, salt)
        const newUser = new User({ ...req.body, password: hashPassword });
        await newUser.save()
        if(roles == "Employee"){
          console.log(generatedPassword)
          const recipient = req.body.email
          const subject = 'Hasło do konta'
          const content = `Gratulujemy zostania nowym pracownikiem w naszej restauracji, Twoje hasło logowania to: ${generatedPassword}. Zalecamy zmienić to hasło tak szybko jak jest to możliwe.`
          sendEmail(recipient, subject, content);
        }
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    } 
})

router.get("/", async (req, res) => {
    User.find().exec()
    .then(async () => {
    const users = await User.find();
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


    router.get("/user", async (req, res) => {
        try {
          const userId = req.user._id;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
          res.status(200).send({ data: user, message: "User details retrieved successfully" });
        } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
      router.put("/password", async (req, res) => {
        try {
          const userId = req.user._id;
          const { currentPassword, newPassword } = req.body;

          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }

          const validPassword = await bcrypt.compare(currentPassword, user.password);
          if (!validPassword) {
            return res.status(401).send({ message: "Invalid current password" });
          }
      
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashPassword = await bcrypt.hash(newPassword, salt);
      
          user.password = hashPassword;
          await user.save();
      
          res.status(200).send({ message: "Password updated successfully" });
        } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
      
module.exports = router