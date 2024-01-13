
const { Users } = require('../models/Users');

const express = require('express');
const router = express.Router();



router.get('/getAll', async (req, res) => {
    const users = await Users.find();
    res.status(200).json(users)
});

router.post('/new', async (req, res) => {
    try {
        if (
            !req.body.name||
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Send all required fields: name,email,password',
            });
        }
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            date:req.body.date
        };


        const user = await Users.create(newUser);
        return res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send({ message: error.message });
    }
});


module.exports =router;