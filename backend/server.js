const express = require('express');
const bodyParser = require('body-parser');

//init variables
const sequelize = require('./database/sequelize');
const cors = require('cors');
const { User, Event} = require('./database/models');
const users = require('./routes/userRoutes.js');
const events = require('./routes/eventRoutes.js');
//init server app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));


// adding created routes
app.use('/users',users);
app.use('/users',events);
//define relations
User.hasMany(Event);

// app.get('/', async (req, res) => {
//   res.send('Hello World')
// });

 // trigger create tables
 app.get('/sync', async(req, res) => {
  try {
    await sequelize.sync({force: true});
    res.status(200).json({message: 'Tables created'});
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
});

  // get login data and validate in oder to acces data
app.post('/login', async (req, res) => {
  try {
    // const user = await User.findOne({ where: { userName: }});
    const userNameValue = req.body.userName;
    const passwordValue = req.body.password;
    const user = await User.findOne({ where: {userName: userNameValue, password: passwordValue}});
    if ( user === null || user === 'undefined') {
      res.status(200).json({message: 'The user does not exists in the database!'});
    } else {
      res.status(200).json({message: 'Success login!'});
    }
  } catch (err) {
      console.warn(err);
      console.log("user::" + req.body.userName);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
});
  // get data in order to create account
app.post('/create-account', async (req, res) => {
  try {
    await User.create(req.body);
    // to do: validate data
    res.status(200).json({message: 'The user has been registered successfully!'});
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
});


app.listen(8000);