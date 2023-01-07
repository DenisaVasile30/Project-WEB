const {User} = require("../database/models");
const express = require('express');
const router = express.Router();

// get users
router.get('/all', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
  });



module.exports = router;