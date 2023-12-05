const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const {responseCode} = require('./constants');
const {messages} = require('./messages');


module.exports = (app)=>{
    /**middilwares */
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cors());

    /**Routes */
    //Admin route
    const AdminRouter = require('../routes/AdminRoutes');
    
    app.use('/api/admin',AdminRouter);

    //User route
    const UserRouter = require('../routes/UserRoutes');


    app.use('/api/user',UserRouter);


    //Product routes
    const ProductRouter = require('../routes/ProductRoutes');
    
    app.use('/api/product',ProductRouter);

    //Common routes
    const CommonRouter = require('../routes/CommonRouter');

    app.use('/api/common',CommonRouter);



    /**middleware for error handling */
    app.use((err,req,res,next)=>{
        console.log(err);
        res.json(responseCode.INTERNAL_SERVERERROR)
        .json({
            status:responseCode.INTERNAL_SERVERERROR,
            isError:true,
            message:messages.SOMTHING_WENT_WRONG
        })
    })
}