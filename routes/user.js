
const { Users } = require('../models/Users');
const bcrypt = require('bcryptjs');

const express = require('express');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();

const JWT_SECRET = "I am Anup";

router.get('/getAll', async (req, res) => {
    const users = await Users.find();
    res.status(200).json(users)
});

router.post('/new', async (req, res) => {
    try {
        if (
            !req.body.name ||
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Send all required fields: name,email,password',
            });
        }


        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);



        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
            date: req.body.date
        };


        const user = await Users.create(newUser);
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);




        return res.status(201).json({
            success: true,
            authToken
        });
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
});

//Authenticate User
router.post('/auth', async(req, res) => {
    try {
        if (
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Send all required fields: email,password',
            });
        }

        const { email, password } = req.body;
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Try Logging with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try Logging with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        return res.status(201).json({
            success: true,
            authToken
        });

    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
})

//Getuser details with token provided. Login required
router.post('/getUser',fetchUser,async(req,res)=>{

    try {
        const userId = req.user.id;
        const user = await Users.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
})


module.exports = router;