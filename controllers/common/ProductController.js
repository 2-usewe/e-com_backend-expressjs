 
const {responseCode,events,role,paginateObj} = require('../../config/constants');
const {messages} = require('../../config/messages');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const UUID = uuidv4;
const validateData = require('../../helpers/validate');
const productEvents = events.productEvents;
const {sequelize}=require('../../config/database');
const Product = require('../../models/product');
const Admin = require('../../models/admin');
const { Op } = require('sequelize');


module.exports={
 /**
    * @method getProducts
    * @route POST /api/product/get-all
    * @description this api method used for get products 
    */
 getProducts: async (req,res)=>{
    console.log('Inside ProductController getproducts API');
    try{
        let {page,limit,search,categoryFilter,startRange,endRange}=req.query;
        // console.log(req.query);
        page = page ? page : paginateObj.page;
        limit = limit ? limit : paginateObj.limit;
        page = page * limit - limit;
        console.log(page,limit);
        // let category ='';
        let whereClause = {isDeleted:false};
        if(search){
           whereClause.productName = {
                [Op.like]: '%' + search + '%',
               };
        }
        //if category filter
        if(categoryFilter){
            whereClause.category=categoryFilter;
        }

        //price reange filter
        if(startRange && endRange){
            whereClause.price =  {
                [Op.between]: [parseInt(startRange),parseInt(endRange)],
               };
        }else if(startRange && !endRange){
            whereClause.price =  {
                [Op.gte]: parseInt(startRange),
               };
        }else if(!startRange && endRange){
            whereClause.price =  {
                [Op.lte]: parseInt(endRange),
               };
        }
        
       console.log(whereClause);
        //let find the products
        let findData=  await Product.findAll({
            where:whereClause,
            include: [
                {
                  model: Admin,
                  as: 'admin',
                  attributes: ['id', 'firstName','lastName','email'], // Specify the fields you want to include
                },
              ],
              offset:parseInt(page),
              limit:parseInt(limit),
          });
          let count = await Product.count({
            where:whereClause,
            include: [
                {
                  model: Admin,
                  as: 'admin',
                  attributes: ['id', 'firstName','lastName','email'], // Specify the fields you want to include
                },
              ],
          });

          let data ={
            data:findData,
            count:count
          }

        return res.status(responseCode.OK)
        .json({
            status:responseCode.OK,
            isError:false,
            data:data,
            error:{},
            message:messages.PRODUCT_FETCHED
        });
    }
    catch(error){
        console.log(error);
        return res.status(responseCode.INTERNAL_SERVERERROR)
        .json({
            status:responseCode.INTERNAL_SERVERERROR,
            isError:true,
            data:{},
            error:error,
            message:error.message
        });
    }
}
}