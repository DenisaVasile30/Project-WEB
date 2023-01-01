const express = require('express');
const bodyParser = require('body-parser');

//init variables
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'events.db',
  define: {
      timestamps: false
  }
});
// define User
const User = sequelize.define('user', {
  userName: {
      type: Sequelize.STRING,
      allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  } 
});
const Event = sequelize.define('event', {
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  location: {
      type: Sequelize.TEXT,
      allowNull: false
  },
  date: {
      type: Sequelize.DATE,
      allowNull: false
  },
  startHour: {
      type: Sequelize.STRING,
      allowNull: false
  }
});


//init server app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));



app.get('/', async (req, res) => {
  res.send('Hello World')
})

// app.get('/login', async (req, res) => {
//   try {
//     const user = await User.findAll();
//     res.status(200).json({message: 'the user exists'});
//   } catch (err) {
//       console.warn(err);
//       //middleware for treating error TO DO
//       res.status(500).json({message: 'An error occured'});
//   }
//   });

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
app.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
  });
app.listen(8000)