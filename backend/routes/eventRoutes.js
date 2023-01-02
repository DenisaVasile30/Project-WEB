const {Event} = require("../database/models");
const express = require('express');
const app = express();

//get all events
app.get('/events/all', async (req, res) => {
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
  app.get('/:id/events', async (req, res) => {
    try {
        const id = req.params.id;
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

// add event for specific user
app.post('/:id/events/add', async (req, res) => {
    try {
        const id = req.params.id;
        const {name, location, date, startHour} = req.body;
        console.warn("name::"+name);
        if (id !== null && id !== 'undefined') {
            console.warn("idd"+id);
            const ev = {
                "name": name,
                "location": location, 
                "date": date, 
                "startHour": startHour, 
                "userId": id
            };
            await Event.create(ev);
            // to do: validate data
            res.status(200).json({message: 'The events was added successfully!'});
        }
        
    } catch (err) {
        console.warn(err);
        //middleware for treating error TO DO
        res.status(500).json({message: 'An error occured'});
    }
});

// delete event by id
app.delete('/:id/events/delete/:idEvent', async (req, res) => {
    try {
        const idUser = req.params.id;
        const idEvent = req.params.idEvent;
        if (idUser !== null && idUser !== 'undefined') {
            const event = await Event.findByPk(idEvent);
            if(event){
            await event.destroy();
                res.status(200).json({ message: "The event was successfully deleted!" });
            } else {
                res.status(404).json({ message: "User not found!" });
            }                    
        }
        
    } catch (err) {
        console.warn(err);
        res.status(500).json({message: 'An error occured'});
    }
});

// update event by id
app.put("/:id/events/edit/:idEvent", async (req, res, next) => {
    try {
        const id = req.params.id;
        const idEvent = req.params.idEvent;
        const event = await Event.findByPk(idEvent);
        if(event){
            if( req.body.name && req.body.location
                && req.body.date && req.body.startHour)
            {
                const {name, location, date, startHour} = req.body;
                const event = {
                    "name": name,
                    "location": location, 
                    "date": date, 
                    "startHour": startHour, 
                    "userId": id
                };
                    await Event.update(event, {
                        where: {
                            id: idEvent
                        }
                    });
                    res.status(201).json({ message: "The course was updated successfully!" });
            } else {
            res.status(400).json({ message: "Malformed request!" });
            }
        } else {
            res.status(404).json({ message: "Event not found!" });
        }
    } catch (err) {
      next(err);
    }
  });



module.exports=app;