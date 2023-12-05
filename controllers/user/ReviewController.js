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
     * @method reviewAdd
     * @route post /api/user/product/add-review
     * @description this api method used for add review
     */
    reviewAdd: async(req,res)=>{
        console.log("Inside ReviewController  API");
        try{
            let tokenData = req.decodedToken;
            let inputData = _.pick(req.body,['orderId','productId','reviewPoint','description']);
            //let validate
            let result = await validateData(
                inputData,
                reviewEvents.reviewAdd
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
            // check if already review added 
            let review = await Review.findOne({
                where:{productId:inputData.productId,userId:tokenData.id,isDeleted:false}
            });
            if(review){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.REVIEW_EXIST
                });
            }
            //fetch product and check product
            let getProduct = await Product.findOne({
                where:{id:inputData.productId,isDeleted:false}
            });

            if(!getProduct){
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
            let getOrder = await OrderItem.findOne({
                where:{id:inputData.orderId,isDeleted:false}
            });
            if(!getOrder){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.ORDER_ITEM_NOT_FOUND
                });
            }
            //prepare review data
            let timestamps =Math.floor(Date.now()/1000);
            let reviewData={
                id:UUID(),
                userId:tokenData.id,
                createdAt:timestamps,
                updatedAt:timestamps,
                ...inputData
            };
            console.log(reviewData);
            let createReview = await Review.create(reviewData);


            return res.status(responseCode.CREATED)
            .json({
                status:responseCode.CREATED,
                isError:false,
                data:createReview,
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

    /**
     * @method reviewUpdate
     * @route post /api/user/product/update-review
     * @description this api method used for update review
     */
    reviewUpdate: async(req,res)=>{
        console.log("Inside ReviewController reviwUpdate API");
        try{
            let tokenData = req.decodedToken;
            let inputData = _.pick(req.body,['reviewId','reviewPoint','description']);
            //let validate
            let result = await validateData(
                inputData,
                reviewEvents.reviewUpdate
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
            // check if already review added 
            let review = await Review.findOne({
                where:{id:inputData.reviewId,userId:tokenData.id,isDeleted:false}
            });
            if(!review){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.REVIEW_NOTFOUND
                });
            }
            
            //prepare review data
            let timestamps =Math.floor(Date.now()/1000);
            await Review.update(
                {description:inputData.description,reviewPoint:inputData.reviewPoint,updatedAt:timestamps},
                {
                    where:{id:inputData.reviewId,userId:tokenData.id,isDeleted:false}
            });
            let updatedReview = await Review.findOne({
                where:{id:inputData.reviewId,userId:tokenData.id,isDeleted:false}
            });

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:updatedReview,
                error:{},
                message:messages.PRODUCT_REVIEW_UPDATE
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