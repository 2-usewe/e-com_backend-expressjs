const Cart = require('../../models/cart');
const _=require('lodash');
const {events,responseCode,UUID} = require('../../config/constants');
const cartEvents= events.cartEvents;
const validateData =require('../../helpers/validate');
const {messages}=require('../../config/messages');
const Product = require('../../models/product');

module.exports={
/**
 * @method cartCreate
 * @route POST /api/user/cart/create
 * @description this api method used for create cart
 */ 
cartCreate:async(req,res)=>{
   console.log('Inside CartController cartCreate API');
   try{
        const tokenData = req.decodedToken;
        let inputData = _.pick(req.body,['productId']);
        //validate input data
        let result = await validateData(
            inputData,
            cartEvents.add,
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
        let findProduct = await Product.findOne({
            where:{id:inputData.productId,isDeleted:false}
        });
        console.log(findProduct);
        if(!findProduct){
            return res.status(responseCode.BAD_REQUEST)
            .json({
                status:responseCode.BAD_REQUEST,
                isError:true,
                data:{},
                error:{},
                message:messages.PRODUCT_NOTFOUND
            });
        }
        //if quantity not available 
        if(findProduct?.quantity==0){
            return res.status(responseCode.BAD_REQUEST)
            .json({
                status:responseCode.BAD_REQUEST,
                isError:true,
                data:{},
                error:{},
                message:messages.PRODUCT_OUTOF_STOCK
            });
        }
        //check if the cart already exist then increase quantity
        let existCart = await Cart.findOne({
            where:{productId:inputData.productId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
        });
        const timestamps = Math.floor(Date.now()/1000);
        let cart = '';
        if(existCart){
            await Cart.update(
                {
                    quantity:parseInt(existCart.quantity)+1,
                    updatedAt:timestamps
                },
                {
                where:{productId:inputData.productId,userId:tokenData.id,isDeleted:false}
            });
            cart = await Cart.findOne({
                where:{productId:inputData.productId,userId:tokenData.id,isDeleted:false}
            });
        }
        else{
            let cartData ={
                id:UUID(),
                productId:findProduct.id,
                userId:tokenData.id,
                adminId:findProduct.adminId,
                createdAt:timestamps,
                updatedAt:timestamps,
            }
            cart = await Cart.create(cartData);

        }

        return res.status(responseCode.CREATED)
            .json({
                status:responseCode.CREATED,
                isError:false,
                data:cart,
                error:{},
                message:messages.CART_ADDED
            });

   }catch(error){
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
 * @method updateCart
 * @route POST /api/user/cart/update
 * @description this api method used for update cart quantity
 */ 
updateCart:async(req,res)=>{
    console.log('Inside CartController updateCart API'); 
    try{
        const tokenData = req.decodedToken;
        let inputData = _.pick(req.body,['cartId','action']);
        //validate input data
        let result = await validateData(
            inputData,
            cartEvents.update,
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

        let existCart = await Cart.findOne({
            where:{id:inputData.cartId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
        });

        const timestamps = Math.floor(Date.now()/1000);
        let cart='';
        if(existCart){
            if(existCart.quantity==1 && inputData.action==='M'){
                await Cart.update(
                    {
                        quantity:parseInt(existCart.quantity)-1,
                        isDeleted:true,
                        updatedAt:timestamps
                    },
                    {
                    where:{id:inputData.cartId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
                });
            }
            else{
                let updateQuantity = inputData.action==='P'?parseInt(existCart.quantity)+1:parseInt(existCart.quantity)-1
                await Cart.update(
                    {
                        quantity:updateQuantity,
                        updatedAt:timestamps
                    },
                    {
                    where:{id:inputData.cartId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
                });
            }
            
            cart = await Cart.findOne({
                where:{id:inputData.cartId,userId:tokenData.id,isDeleted:false}
            });
        }
        else{
            return res.status(responseCode.BAD_REQUEST)
            .json({
                status:responseCode.BAD_REQUEST,
                isError:true,
                data:{},
                error:{},
                message:messages.CART_NOTFOUND
            });
        }
        return res.status(responseCode.OK)
        .json({
            status:responseCode.OK,
            isError:false,
            data:cart,
            error:{},
            message:messages.CART_UPDATED
        });


    }catch(error){
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
 * @method removeCart
 * @route POST /api/user/cart/remove
 * @description this api method used for cart remove
 */ 
removeCart:async(req,res)=>{
    console.log('Inside CartController removeCart API'); 
    try{
        const tokenData = req.decodedToken;
        let inputData = _.pick(req.body,['cartId']);
        //validate input data
        let result = await validateData(
            inputData,
            cartEvents.remove,
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

        let existCart = await Cart.findOne({
            where:{id:inputData.cartId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
        });

        const timestamps = Math.floor(Date.now()/1000);
        let cart='';
        if(existCart){
                await Cart.update(
                    {
                        isDeleted:true,
                        updatedAt:timestamps
                    },
                    {
                    where:{id:inputData.cartId,userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
                });
            cart = await Cart.findOne({
                where:{id:inputData.cartId,userId:tokenData.id,isDeleted:false}
            });
        }
        else{
            return res.status(responseCode.BAD_REQUEST)
            .json({
                status:responseCode.BAD_REQUEST,
                isError:true,
                data:{},
                error:{},
                message:messages.CART_NOTFOUND
            });
        }
        return res.status(responseCode.OK)
        .json({
            status:responseCode.OK,
            isError:false,
            data:cart,
            error:{},
            message:messages.CART_REMOVED
        });


    }catch(error){
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
 * @method getCart
 * @route POST /api/user/cart/get
 * @description this api method used for get cart 
 */ 
getCart:async(req,res)=>{
    console.log('Inside CartController getCart API'); 
    try{
        const tokenData = req.decodedToken;

        let existCart = await Cart.findAll({
            where:{userId:tokenData.id,isOrderPlaced:false,isDeleted:false}
        });

        return res.status(responseCode.OK)
        .json({
            status:responseCode.OK,
            isError:false,
            data:existCart,
            error:{},
            message:messages.CART_FETCHED
        });


    }catch(error){
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