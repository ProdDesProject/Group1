const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const utils = require('../utils');
const { body, validationResult } = require('express-validator');


router.post('/', [
    
    body('firstname','Firstname cannot be left blank')
    .isLength({ min: 2 }),
    

    body('lastname','Lastname cannot be left blank')
    .isLength({ min: 2 }),

    body('email',"Email cannot be left blank")
    .isLength({ min: 6, max: 100 })
    .isEmail()
    .normalizeEmail()
    .trim()
    .custom(email =>{
        return utils.checkEmailAvailability(email).then(user => {
            if (user) {
              return Promise.reject('E-mail already in use');
            }
        })
    }),
    body("phonenumber")
    .isMobilePhone(),

    body("address.street",'Street cannot be left blank')
    .isLength({ min: 2 }),

    body('address.postcode','Postcode cannot be left blank')
    .isLength({ min: 2 }),

    body('address.city','Country cannot be left blank')
    .isLength({ min: 2 }),

    body('address.country','Country cannot be left blank')
    .isLength({ min: 2 }),

    body('password')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  ],async (req, res) => {
    try {

    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    const errorArray = errors.array();

    if (!errors.isEmpty()) {
      res.status(400).json({message: errorArray[0].msg});
      return;
    }
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const street = req.body.address.street;
    const city = req.body.address.city;
    const postcode = req.body.address.postcode;
    const country = req.body.address.country;
    const password = bcrypt.hashSync(req.body.password, 5);
    try {
      await utils.addUser(firstname,lastname,email,phonenumber,street,city,postcode,country,password);
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(500);
    }    
} catch (error) {
    return res.status(400).json({ message: errorArray[0].msg});
}
})
module.exports = router;