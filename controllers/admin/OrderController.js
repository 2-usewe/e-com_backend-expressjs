const _=require('lodash');
const {sequelize} = require('../../config/database');
const { Op } = require('sequelize');
const {events,responseCode,UUID} = require('../../config/constants');
const orderEvents= events.orderEvents;
const validateData =require('../../helpers/validate');
const {messages}=require('../../config/messages');
const Product = require('../../models/product');
const OrderDetails = require('../../models/orderDetails');
const Admin = require('../../models/admin');
const User = require('../../models/user');
const Cart = require('../../models/cart');
const OrderItem = require('../../models/orderItems');

module.exports={

    /**
     * @method orderList
     * @route GET /api/admin/order/lists
     * @description this api method used for get order lists
     */
    orderList: async(req,res)=>{
        console.log("Inside OrderController Order lists API");
        try{
            let tokenData = req.decodedToken;
            //fetch all orders
            let getOrderHistory = await OrderDetails.findAll({
                where:{adminId:tokenData.id,isDeleted:false},
                include: [
                    {
                      model: Admin,
                      as: 'admin',
                      attributes: ['id', 'firstName','lastName','email'], 
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'firstName','lastName','email','phone'], 
                    },
                    {
                        model: OrderItem,
                        as: 'orderitem',
                        attributes: ['id',
                        'productName',
                        'varient',
                        'isOrderAccepted',
                        'quantity',
                        'price',
                        'orderStatus',
                        'createdAt',
                        'updatedAt'], 
                    },

                  ],
            });
            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:getOrderHistory,
                error:{},
                message:messages.ORDER_HISTORY_FETCHED
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
     * @method updateOrderstatus
     * @route post /api/admin/order/update/status
     * @description this api method used for get order lists
     */
      updateOrderstatus: async(req,res)=>{
        console.log("Inside OrderController updateOrderstatus API");
        try{
            let tokenData = req.decodedToken;
            let inputData =_.pick(req.body,['orderItemId','status']);
            //let validate
            let result = await validateData(
                inputData,
                orderEvents.changeStatus,
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
            //fetch all orders
            const orderitem = await OrderItem.findOne({
                where:{id:inputData.orderItemId,isDeleted:false},
            });
            if(tokenData.id!==orderitem.adminId){
                return res.status(responseCode.FORBIDDEN)
                .json({
                    status:responseCode.FORBIDDEN,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.UNOTHERIZE_TO_UPDATE_ORDER
                });
            }
            // console.log(orderitem);
            if(!orderitem){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.ORDER_ITEM_NOT_FOUND
                });
            }
            //let update the status processing,shipped and delivered
            let timestamps = Math.floor(Date.now()/1000);
            await OrderItem.update(
                {orderStatus:inputData.status, updatedAt:timestamps},
                {
                where:{id:inputData.orderItemId,isDeleted:false},
            });
            let updateOrder =  await OrderItem.findOne({
                where:{id:inputData.orderItemId,isDeleted:false},
            });

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:updateOrder,
                error:{},
                message:messages.ORDER_HISTORY_FETCHED
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