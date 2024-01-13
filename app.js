const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
app.use(bodyParser.json());//parser text from body really helpfull
app.use(cors());
const PORT = process.env.PORT || 5000;
// -->> mongodb://expensetrackerdb:BndFF12z2muUYvM83alenXICUMJL7j9fiO5xU1yK3DpM8bVsowMUKuRBWOvkHx5bIbxqny9Ij0S8ACDbTM5JNQ==@expensetrackerdb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@expensetrackerdb@
mongoose.connect("mongodb://expensetrackerdb:BndFF12z2muUYvM83alenXICUMJL7j9fiO5xU1yK3DpM8bVsowMUKuRBWOvkHx5bIbxqny9Ij0S8ACDbTM5JNQ==@expensetrackerdb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@expensetrackerdb@").then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
        console.log(`App is running on port:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});


app.use('/user',require('./routes/user.js'));
app.use('/expense',require('./routes/expense'));

