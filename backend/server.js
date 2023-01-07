const express = require('express')
const bodyParser = require('body-parser')

//init variables
const client = 'http://localhost:3000'
// const session = require("client-sessions");
const sequelize = require('./database/sequelize')
const cors = require('cors');
const { User, Event} = require('./database/models')
const users = require('./routes/userRoutes.js')
const events = require('./routes/eventRoutes.js')
//init server app
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


// adding created routes
app.use('/users',users)
app.use('/users',events)
//define relations
User.hasMany(Event)

// for authorization: 
// app.use(function (req, res, next) { // ading data in Headers ( view in Postman -> Headers )
//   res.header("Access-Control-Allow-Origin", client);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// configuration for caches 
// app.options("*", cors({ origin: client }));
// app.get("/*", (req, res, next) => {
//   res.header("Cache-Control", "no-cache, no-store");
//   next();
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
})

  // get login data and validate in oder to acces data
app.post('/login', async (req, res) => {
  try {
    // const user = await User.findOne({ where: { userName: }});
    const userNameValue = req.body.userName;
    const passwordValue = req.body.password;
    console.log(req.body.userName + passwordValue + '!!!!!');
    const user = await User.findOne({ where: {userName: userNameValue, password: passwordValue}});
    if ( user === null || user === 'undefined') {
      res.status(401).json({message: 'Invalid username or password! If you do not have an account you can create' 
      + ' one with Sign Up option!'});
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
      console.warn(err);
      console.log("user::" + req.body.userName);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
})
  // get data in order to create account
app.post('/create-account', async (req, res) => {
  try {
    const userNameValue = req.body.userName;
    const passwordValue = req.body.password;
    console.log("valuues::" + userNameValue + passwordValue);
    const user = await User.findOne({ where: {userName: userNameValue, password: passwordValue}});
    console.log("createAccount::" + user);
    if (user != null) {
      console.log('already exists');
      res.status(401).json({message: 'This user already exists!'});
    } else {
      console.log('must create');
      await User.create(req.body);
      res.status(201).json({message: 'The user has been registered successfully!'});
    }    
  } catch (err) {
      console.warn(err);
      //middleware for treating error TO DO
      res.status(500).json({message: 'An error occured'});
  }
})


app.listen(8000)