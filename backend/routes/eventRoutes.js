const {Event, User} = require("../database/models")
const express = require('express')
const router = express.Router()

//get all events
router.get('/events/all', async (req, res) => {
  try {
      const events = await Event.findAll();
      res.status(200).json(events);
  } catch (err) {
      console.warn(err);
      res.status(500).json({message: 'An error occured'});
  }
});

 // get events for a specific user 
 router.get('/:id/events', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (user) {
        const events = await user.getEvents({
            where: {
                userId: id
            }
        });
        res.status(200).json(events);
    } else {
        res.status(404).json({message: 'User not found!'});                  
    }      
  } catch (err) {
    console.warn(err);
    res.status(500).json({message: 'An error occured'});
  }
});

// add event for specific user
router.post('/:id/events/add', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (user) {
      const event = req.body;
      event.userId = user.id;
      await Event.create(event);
      // to do: validate data
      res.status(201).json({message: 'The event was added successfully!'});
    }  else {
      res.status(404).json({message: 'User not found!'});                  
    }        
  } catch (err) {
    console.warn(err);
    res.status(500).json({message: 'An error occured'});
  }
});

// delete event by id
router.delete('/:id/events/delete/:idEvent', async (req, res) => {
  try {
    const idUser = req.params.id;
    const idEvent = req.params.idEvent;
    const user = await User.findByPk(idUser);        
    if (user) {
      const events = await user.getEvents({
        where: {
            id: idEvent
        }
      });
      const event = events.shift();
      if (event){
        await event.destroy();
        res.status(201).json({ message: "The event was successfully deleted!" });
      } else {
        res.status(404).json({ message: "Event not found!" });
      }               
    } else {
      res.status(404).json({ message: "User not found!" });
    }    
  } catch (err) {
    console.warn(err);
    res.status(500).json({message: 'An error occured'});
  }
});

// update event by id
router.put("/:id/events/edit/:idEvent", async (req, res, next) => {
  try {
    const id = req.params.id;
    const idEvent = req.params.idEvent;
    const user = await User.findByPk(id);
    if(user){
      const events = await user.getEvents({
        where: {
            id: idEvent
        }
      });
      const event = events.shift();
      if (event) {
        const eventTemp = req.body;
        eventTemp.idUser = user.id;
        await event.update(eventTemp);
        res.status(202).json({ message: "The events was updated successfully!" });
      } else {
        res.status(400).json({ message: "Event not found!" });
      }
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router