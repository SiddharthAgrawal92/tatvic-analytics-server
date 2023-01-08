require('dotenv').config();
const express = require('express'),
    helmet = require('helmet'),
    cors = require('cors'),
    routes = require('./api-routes'),
    mongoose = require("mongoose");
//create express app
const app = express();

//added security headers
app.use(helmet());
app.use(cors());
app.use(express.json());

//db connection
mongoose.connect(process.env.DB_STRING);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("MongoDB Connected Successfully");
});

//http routes handler
app.use(routes);

//start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running at: http://${process.env.HOST_NAME}:${process.env.PORT}`);
})