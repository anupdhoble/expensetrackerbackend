const express = require('express');
const mongoose = require('mongoose');
const { Expense } = require('./models/expenseModel.js');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
app.use(bodyParser.json());//parser text from body really helpfull
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://anup:KrCQQaZx7mhwHj9wtfujkbDpgUV5Yt4zFM0POky9zWK5qLx1kShqyzO038ewbPV9MpC3p5Jj9uGQACDbJ9CJsA==@anup.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@anup@").then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
        console.log(`App is running on port:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});

app.get('/expense/getAll', async (req, res) => {
    const expenses = await Expense.find();
    res.status(200).json(expenses)
});

app.get('/expense/get/:id', async (req, res) => {
    const exp = await Expense.findById(req.params.id);
    if(!exp){
        return res.status(500).json({
            message:"Item not found with that id"
        })
    }
    res.status(200).json({
        success: "true",
        exp
    })
});

app.post('/expense/new', async (req, res) => {
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
            title: req.body.title,
            amount: req.body.amount,
            date: req.body.date,
            purpose:req.body.purpose,
            type:req.body.type
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

app.put('/expense/update/:id', async (req, res) => {

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

app.delete("/expense/delete/:id", async (req, res) => {
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

