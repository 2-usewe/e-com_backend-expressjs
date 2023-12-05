
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
 * @method create
 * @route POST /api/product/create
 * @description this api method used for create product
 */
    create: async (req,res)=>{
        console.log('Inside Product controller create API ');
        try{
            let inputData = _.pick(req.body,[
                'category',
                'productName',
                'variation',
                'quantity',
                'price',
                'ingrediants',
                'warning']);
            const tokenData = req.decodedToken;

                 /**validate input data */
            let result = await validateData(
                inputData,
                productEvents.create
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
            //check duplication of product
            const findProduct = await Product.findOne({
                where:{productName:inputData.productName,
                       variation:inputData.variation,
                       adminId:tokenData.id,
                       isDeleted:false
                    }
                });
            console.log(findProduct);
            if(findProduct){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:findProduct,
                    error:{},
                    message:messages.PRODUCT_EXIST
                });
            }
            const timestamps = Math.floor(Date.now()/1000);
            const productData={
                id:UUID(),
                ...inputData,
                createdAt:timestamps,
                updatedAt:timestamps,
                adminId:tokenData.id
            }
            // console.log(productData);
            const createProduct = await Product.create(productData);
            console.log(createProduct);

            return res.status(responseCode.CREATED)
            .json({
                status:responseCode.CREATED,
                isError:false,
                data:createProduct,
                error:{},
                message:messages.PRODUCT_ADDED
            });
        }
        catch(error){
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
    * @method updateProducts
    * @route POST /api/product/update
    * @description this api method used for update products
    */
    updateProducts: async (req,res)=>{
        console.log('Inside ProductController getproducts API');
        try{
            let inputData = _.pick(req.body,['id','category','productName','variation','quantity','price','ingrediants','warning']);
            console.log(inputData);
            // let category ='';
            let tokenData = req.decodedToken;

            //validate input data
            let result = await validateData(
                inputData,
                productEvents.update
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
            let findData = await Product.findOne({
                where:{id:inputData.id,isDeleted:false}
            });
            console.log(findData);
            if(!findData){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.PRODUCT_NOTFOUND
                });
            }
            if(tokenData.id!==findData.adminId){
                return res.status(responseCode.FORBIDDEN)
                .json({
                    status:responseCode.FORBIDDEN,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.UNOTHERIZE_TO_UPDATE
                });
            }

            let timestamps = Math.floor(Date.now()/1000);

            delete inputData.id;
            let updateData = {
                ...inputData,
                updatedAt:timestamps
            }
            console.log(updateData);
            //update Product
            await Product.update(
                updateData,
                {where:{id:findData.id,isDeleted:false}}
            );
            //get updated data
            let getUpdateData = await Product.findOne(
                {where:{id:findData.id,isDeleted:false}}
            );

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:getUpdateData,
                error:{},
                message:messages.PRODUCT_UPDATED
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
    * @method deleteProduct
    * @route POST /api/product/delete
    * @description this api method used for delete products and here i soft delete product (not use destroy for data track)
    */
    deleteProduct: async (req,res)=>{
        console.log('Inside ProductController getproducts API');
        try{
            let productId = req.query.productId;
            let tokenData = req.decodedToken;

            //validate input data
            let result = await validateData(
                {productId:productId},
                productEvents.delete
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
            let findData = await Product.findOne({
                where:{id:productId,isDeleted:false}
            });
            console.log(findData);
            if(!findData){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.PRODUCT_NOTFOUND
                });
            }
            if(tokenData.id!==findData.adminId){
                return res.status(responseCode.FORBIDDEN)
                .json({
                    status:responseCode.FORBIDDEN,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.UNOTHERIZE_TO_DELETE
                });
            }

            let timestamps = Math.floor(Date.now()/1000);

            let updateData = {
                isDeleted:true,
                updatedAt:timestamps
            }
            console.log(updateData);
            //update Product
            //here i use soft delete process for better data track instead of destroy
            await Product.update(
                updateData,
                {where:{id:findData.id,isDeleted:false}}
            );
            //get updated data
            let getUpdateData = await Product.findOne(
                {where:{id:findData.id,isDeleted:true}}
            );

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:getUpdateData,
                error:{},
                message:messages.PRODUCT_DELETED
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
    * @method getProductById
    * @route POST /api/product/get
    * @description this api method used for delete products and here i soft delete product (not use destroy for data track)
    */
    getProductById: async (req,res)=>{
        console.log('Inside ProductController getproducts API');
        try{
            let productId = req.query.productId;
            let tokenData = req.decodedToken;

            //validate input data
            let result = await validateData(
                {productId:productId},
                productEvents.getById
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
                where:{id:productId,isDeleted:false},
                include: [
                    {
                      model: Admin,
                      as: 'admin',
                      attributes: ['id', 'firstName','lastName','email'], // Specify the fields you want to include
                    },
                  ],
            });
            // console.log(findProduct);
            //find product
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

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:findProduct,
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

    },

}