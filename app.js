const express = require('express');
const app = express();
require('dotenv').config();
const {sequelize,connection} = require('./config/database');
const config = require('./config/express');


/**connect db */
connection();

/**to setup middlewares through the config file */
config(app);

const association=require('./models/associations');


const PORT = process.env.PORT||3030;

app.listen(PORT,()=>{
    console.log(`The server is running on http//localhost:${PORT}`);
})
