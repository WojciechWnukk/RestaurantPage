const jwt = require("jsonwebtoken");
function tokenVerification(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodeduser) => {
    if (err) {
      console.log("Unauthorized!");
      res.status(401).send({ message: "Unauthorized!" });
    }
    console.log("Token poprawny, użytkownik: " + decodeduser._id);
    req.user = decodeduser;
    next();
  });
}
module.exports = tokenVerification;
