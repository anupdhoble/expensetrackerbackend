
const fetchUser = require('../middleware/fetchUser.js');
const { Expense } = require('../models/Expense.js');
const express = require('express');
const router = express.Router();


router.get('/getAll', fetchUser, async (req, res) => {

    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses)
});

router.get('/get/:id', async (req, res) => {
    const exp = await Expense.findById(req.params.id);
    if (!exp) {
        return res.status(500).json({
            message: "Item not found with that id"
        })
    }
    res.status(200).json({
        success: "true",
        exp
    })
});

router.post('/new', fetchUser, async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.amount ||
            !req.body.date
        ) {
            return res.status(400).send({
                message: 'Send all required fields: title, amount, date',
            });
        }
        const newExpense = {
            user: req.user.id,
            title: req.body.title,
            amount: req.body.amount,
            date: req.body.date,
            purpose: req.body.purpose,
            type: req.body.type
        };


        const expense = await Expense.create(newExpense);
        return res.status(201).json({
            success: true,
            expense
        });
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send({ message: error.message });
    }
});

router.put('/update/:id', async (req, res) => {

    let exp = await Expense.findById(req.params.id);
    if (!exp) {
        return res.status(404).json({
            success: false,
            message: "No such product exists"
        })
    }
    try {
        exp = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false,
            runValidators: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred finding that id",

        })
    }
    return res.status(200).json({
        success: "true",
        exp
    })
});

router.delete("/delete/:id", async (req, res) => {
    let exp = await Expense.findByIdAndDelete(req.params.id);

    if (!exp) {
        return res.status(404).json({
            success: false,
            message: "No such product exists"
        })
    }
    return res.status(200).json({
        success: true,
        message: "Product is deleted successfully!!",
        Deleted_item: exp
    })
});

module.exports = router;