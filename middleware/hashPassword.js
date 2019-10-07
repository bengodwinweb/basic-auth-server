const bcrypt = require("bcrypt-nodejs");

module.exports = (req, res, next) => {
    const pass = req.body.password;
  
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
  
      bcrypt.hash(pass, salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }
  
        req.body.password = hash;
        next();
      });
    });
}