const _=require('lodash');
const {sequelize} = require('../../config/database');
const { Op } = require('sequelize');
const {events,responseCode,UUID} = require('../../config/constants');
const orderEvents= events.orderEvents;
const validateData =require('../../helpers/validate');
const {messages}=require('../../config/messages');
const Product = require('../../models/product');
const OrderDetails = require('../../models/orderDetails');
const Review = require('../../models/review');
const User = require('../../models/user');
const Cart = require('../../models/cart');
const OrderItem = require('../../models/orderItems');
const reviewEvents = events.reviewEvents;

module.exports={
    /**
     * @method getReviews
     * @route GET /api/admin/product/get-reviews
     * @description this api method used for add review
     */
    getReviews: async(req,res)=>{
        console.log("Inside ReviewController  API");
        try{
            // let tokenData = req.decodedToken;
            let productId = req.query.productId;
            //let validate
            let result = await validateData(
                {productId:productId},
                reviewEvents.getReviews
              );
              console.log(result);
              if (result.hasError) {
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:result.errors,
                    message:messages.INVALID_INPUTS
                });
              }
            //check productId
            let product= await Product.findOne({
                where:{id:productId,isDeleted:false}
            });
            if(!product){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.PRODUCT_NOTFOUND
                });  
            }
            //fetch all orders
            let reviews = await Review.findAll({
                where:{productId:productId,isDeleted:false},
                include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['id', 'firstName','lastName','email'], // Specify the fields you want to include
                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id','category',"productName","variation","quantity","price","ingrediants","warning","adminId","createdAt","updatedAt"], 
                      },
                  ],
            })
            // let getOrderHistory = await OrderDetails.findAll();
            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:reviews,
                error:{},
                message:messages.PRODUCT_REVIEW_ADDED
            });

        } catch(error){
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

     },
}