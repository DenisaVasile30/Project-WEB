const express = require('express');
const bodyParser = require('body-parser');

//init variables
const sequelize = require('./database/sequelize');
const { User, Event} = require('./database/models');

//init server app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//define relations
User.hasMany(Event);

app.get('/', async (req, res) => {
  res.send('Hello World')
});

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



// just for testing
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
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

 // get login data and validate in oder to acces data
 app.post('/add-event', async (req, res) => {
  try {
    await Event.create(req.body);
    // to do: validate data
    res.status(200).json({message: 'The events was added successfully!'});
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
});

//get all events
app.get('/all-events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
  });

  // get events for a specific user
  //get all events
app.get('/events/show', async (req, res) => {
  try {
    const id = req.query.id;
    const events = await Event.findAll({
      where: {
        userId: id
      }
    });
    res.status(200).json(events);
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
  });
app.listen(8000)