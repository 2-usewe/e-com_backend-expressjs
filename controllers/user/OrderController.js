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

module.exports = {

    orderCreate: async(req,res)=>{
        console.log('Inside OrderController orderCreate API');
        try{
            let inputData = _.pick(req.body,['cartIds','paymentId','billingaddress','shippingAddress']);
            const tokenData = req.decodedToken;
            console.log(orderEvents.create);
            let result = await validateData(
                inputData,
                orderEvents.create,
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

              //let find the cart id 
              let cartList = await Cart.findAll({
                where: {
                  id: { [Op.in]: inputData.cartIds },
                  userId: tokenData.id,
                  isOrderPlaced:false,
                  isDeleted: false,
                },
              });
              if (cartList.length !== inputData.cartIds.length) {
                // if has any of the cartId are wrong the throw error
                return res.status(responseCode.BAD_REQUEST)
                .json({
                  status:responseCode.BAD_REQUEST,
                  isError:true,
                  data:{},
                  error:{},
                  message:messages.CART_NOTFOUND
              });
              }
            // console.log(cartList);
            let transaction;
           
            const timestamps = Math.floor(Date.now()/1000);
            try{
                transaction = await sequelize.transaction();
                
                let orderItemData=[];
                let cartIdsLists =[];
                let totalammount = 0;
                let orderDetailData =[];
                let produtIds =[]; 
                cartList.map((cart)=>{
                    if(produtIds.includes(cart.adminId)){
                        return;
                    }
                    else{
                        produtIds.push(cart.adminId);
                    }
                })
                console.log('produtIds:',produtIds);
                for (let p = 0;p<produtIds.length;p++){
                    // console.log(produtIds[p])
                    //filter the cart list following admin
                    let orderDetailId=UUID();

                    let filteredCart = await cartList.filter((cart)=>produtIds[p]===cart.adminId) ;
                    console.log('filteredCart:',filteredCart.length);

                    let amount=0; // paied for admin 
                    for(let i=0; i<filteredCart.length;i++){


                        let cart = filteredCart[i];
                        const product = await Product.findOne({
                            where:{id:cart.productId,isDeleted:false},
                            transaction
                        });
                        // console.log('clg',product);
                        //Data prepaire for orderitem
                        const itemData={
                            id:UUID(),
                            productName:product.productName,
                            varient:product.variation,
                            quantity:cart.quantity,
                            price:product.price*cart.quantity,
                            userId:tokenData.id,
                            adminId:product.adminId,
                            cartId:cart.id,
                            productId:product.id,
                            orderDetailId:orderDetailId,
                            createdAt:timestamps,
                            updatedAt:timestamps
                        };
                        console.log('itemData:',itemData);
                        orderItemData.push(itemData);
                        totalammount += itemData.price;
                        amount+=itemData.price;
                        //update product for decrease quantity
                        await Product.update(
                            {quantity:product.quantity-cart.quantity},
                            {where:{id:cart.productId,isDeleted:false},transaction}
                            );
                        cartIdsLists.push(cart.id);
                        
                    }
                    console.log(amount);
                    //data prepair for order detail
                    let detail ={
                        id:orderDetailId,
                        totalPrice:amount,
                        paymentId:inputData.paymentId,
                        billingaddress: JSON.stringify(inputData.billingaddress),
                        shippingAddress: JSON.stringify(inputData.shippingAddress),
                        userId:tokenData.id,
                        adminId:produtIds[p],
                        createdAt:timestamps,
                        updatedAt:timestamps
                    };
                    orderDetailData.push(detail);

                }
                //order items create
                await OrderItem.bulkCreate(orderItemData,{ transaction});
                //order details create
                await OrderDetails.bulkCreate(orderDetailData,{transaction});
                await Cart.update({isOrderPlaced:true},{
                    where:{id:{[Op.in]:cartIdsLists}},
                    transaction
                })

                console.log('success',orderDetailData);
                // console.log(cartIdsLists,totalammount)
                await transaction.commit(); 
            } catch (error) {
                console.log('error:',error);
                if(transaction) {
                   await transaction.rollback();
                }
                throw error;
            }
              return res.status(responseCode.CREATED)
              .json({
                  status:responseCode.CREATED,
                  isError:false,
                  data:{},
                  error:{},
                  message:messages.ORDER_CREATED
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
    },

     /**
     * @method orderHistory
     * @route GET /api/user/order/history
     * @description this api method used for get order history with order status
     */
     orderHistory: async(req,res)=>{
        console.log("Inside OrderController Order history API");
        try{
            let tokenData = req.decodedToken;
            //fetch all orders with order status
            let getOrderHistory = await OrderDetails.findAll({
                where:{userId:tokenData.id,isDeleted:false},
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

     }

}