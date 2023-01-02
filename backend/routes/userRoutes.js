const {User} = require("../database/models");
const express = require('express');
const app = express();

// get users
app.get('/all', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
  });



module.exports=app;