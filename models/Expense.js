const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    date: String,
    purpose:String,
    type:String
});
const Expense=mongoose.model('Expense',expenseSchema);
module.exports = {Expense}; //we need to export object so expense is object