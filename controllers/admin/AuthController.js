const {messages} = require('../../config/messages');
const {responseCode,events,role} = require('../../config/constants');
const validateData = require('../../helpers/validate')
const {hashPassword,comparePassword} = require('../../helpers/password');
const _ = require('lodash');
const adminEvents = events.adminEvents;
const { v4: uuidv4 } = require('uuid');
const UUID = uuidv4;
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../middlewares/jwt');


module.exports = {
    /**
     * @method register
     * @route POST /api/admin/auth/register
     * @description this api method used for Admin registration
     */

    register: async (req,res) =>{
        console.log('Inside  AdminAuthController register API');
        try{
            //input data
            let inputData =_.pick(req.body,[
                'firstName',
                'lastName',
                'email',
                'password',
                'repeatPassword']);
            console.log(inputData);
            /**validate input data */
            let result = await validateData(
                inputData,
                adminEvents.registration
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

            // Validating if email already exists
            const emailUser = await Admin.findOne({ 
                where: { email: inputData.email,isDeleted:false }, 
                // rejectOnEmpty: false,
              });
            // console.log('emailUser',emailUser);
            if(emailUser){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.EMAIL_EXIST
                });
            }
            //check password and repeated password
            if (inputData.password !== inputData.repeatPassword) {
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.PASSWORD_NOT_MATCH
                });
              }
              
            //let encrypt password
            let hash = await hashPassword({newPassword:inputData.password});
            console.log(hash);
            inputData.password = hash;
            const timestamps = Math.floor(Date.now()/1000);
            const createData = {
                id:UUID(),
                ...inputData,
                role:role.Admin,
                createdAt:timestamps,
                updatedAt:timestamps
            }
            // console.log(createData);
            const createAdmin = await Admin.create(createData);
            let data = createData;
            delete data.password;
            delete data.repeatPassword;
            return res.status(responseCode.CREATED)
            .json({
                status:responseCode.CREATED,
                isError:false,
                data:data,
                error:{},
                message:messages.REGISTER
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
     * @method login
     * @route POST /api/admin/auth/login
     * @description this api method used for Admin registration
     */

    login: async (req,res) =>{
        console.log('Inside  AdminAuthController login API');
        try{
             //input data
             let inputData =_.pick(req.body,[
                'email',
                'password',
             ]);
            // console.log(inputData);
            /**validate input data */
            let result = await validateData(
                inputData,
                adminEvents.login
              );
            //   console.log(result);
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

               // Validating if email already exists
            const findUser = await Admin.findOne({ 
                where: { email: inputData.email,isDeleted:false }, 
                // rejectOnEmpty: false,
              });
            if(!findUser){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.USER_NOT_FOUND,
                });
            }
            /**compare password and check password math or not*/
            const isMatch = await comparePassword({newPassword:inputData.password,storePassword:findUser.password})
            // console.log('isMatch:',isMatch);
            if(!isMatch){
                return res.status(responseCode.BAD_REQUEST)
                .json({
                    status:responseCode.BAD_REQUEST,
                    isError:true,
                    data:{},
                    error:{},
                    message:messages.PASSWORD_INVALID,
                });
            }
            /**generate auth token */
            const token  = await generateToken({
                id: findUser.id,
                email: findUser.email,
                role: role.Admin,
            });
            // console.log('token:',token);
             await Admin.update({
                authToken:token
            },{
                where: { id:findUser.id,isDeleted:false },
            });
            const updateAdmin = await Admin.findOne({
                where: { id:findUser.id,isDeleted:false },
                attributes: { exclude: ['password'] }
            })

            return res.status(responseCode.OK)
            .json({
                status:responseCode.OK,
                isError:false,
                data:updateAdmin,
                error:{}, 
                message:messages.LOGIN
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
     * @method logout
     * @route POST /api/admin/auth/logout
     * @description this api method used for Admin logout
     */

    logout: async (req,res)=>{
        console.log('Inside AdminAuthController logout API');
        try{
            let tokenData = req.decodedToken;
            console.log(tokenData);

            let logout  = await Admin.update(
                {authToken:''},
                {
                    returning:true,
                    where:{id:tokenData.id}
                }
            );
            return res.status(responseCode.OK).json({
                status:responseCode.OK,
                data:logout,
                error:{},
                isError:false,
                message:messages.LOGOUT_SUCCESS,
            })

        }catch(error){
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