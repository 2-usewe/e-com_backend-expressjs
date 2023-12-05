const jwt = require('jsonwebtoken');
const {responseCode,role} = require('../config/constants');
const {messages} = require('../config/messages');
const Admin = require('../models/admin');
const User = require('../models/user');
/**generate token */
function generateToken(payload) {
  // console.log('user:',payload);
  const options = {
    expiresIn: '1d', // Token expiration time
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
}

/**verify Admin authtoken middleware */
function verifyAdminAuthToken(req, res, next) {
  const headerToken = req.header('Authorization');

  // console.log('headerToken:',headerToken);
  if (!headerToken) {
    return res.status(responseCode.UNAUTERIZED).json({
        status:responseCode.UNAUTERIZED,
        error: messages.UNAUTHRIZED });
  }
  const token = headerToken.split(" ");
  if(token[0]==='Bearer' && token[1]){
  // console.log('headerToken:',token[1]);

    jwt.verify(token[1], process.env.SECRET_KEY, async (err, decoded) => {
      // console.log('decoded:',decoded);
      if (err) {
        return res.status(responseCode.UNAUTERIZED).json({
           status:responseCode.UNAUTERIZED,
           error:err,
           message: messages.TOKEN_INVALID
          });
      }
      try{
        if (decoded.role === role.Admin) {
        
          let user = await Admin.findOne({where:{ id: decoded.id}});
          if(user){
            if (user.isDeleted) {
              
              return res.status(responseCode.UNAUTERIZED).json({
                status:responseCode.UNAUTERIZED,
                error:messages.USER_NOT_FOUND
              });
            }
            if(!user.authToken){
              return res.status(responseCode.FORBIDDEN).json({
                status:responseCode.FORBIDDEN,
                error:messages.YOU_HAVE_LOGEDOUT
              });
            }
            const modifyData = {
              id:user.id,
              email:user.email,
              role:role.Admin,
              firstName:user.firstName,
              lastName : user.lastName
            }
            req.decodedToken = modifyData;
            
            next();
          }
          else {
            return res.status(responseCode.UNAUTERIZED).json({
              status:responseCode.UNAUTERIZED,
              error:messages.UNAUTHRIZED_USER
            });
          }
        }
        else{
          return res.status(responseCode.UNAUTERIZED).json({
            status:responseCode.UNAUTERIZED,
            error:messages.UNAUTHRIZED_USER
          });
        }

      }
      catch(error){
        console.log(error);
        return res.status(responseCode.INTERNAL_SERVERERROR).json({
          status:responseCode.INTERNAL_SERVERERROR,
          error:error,
          message:error.message,
        })
      }
    });
  }else{
    return res.status(responseCode.UNAUTERIZED).json({
      status:responseCode.UNAUTERIZED,
      error: messages.UNAUTHRIZED });
  }
}

/**verify user authToken middleware */

function verifyUserAuthToken(req, res, next) {
  const headerToken = req.header('Authorization');

  // console.log('headerToken:',headerToken);
  if (!headerToken) {
    return res.status(responseCode.UNAUTERIZED).json({
        status:responseCode.UNAUTERIZED,
        error: messages.UNAUTHRIZED });
  }
  const token = headerToken.split(" ");
  if(token[0]==='Bearer' && token[1]){
  // console.log('headerToken:',token[1]);

    jwt.verify(token[1], process.env.SECRET_KEY, async (err, decoded) => {
      // console.log('decoded:',decoded);
      if (err) {
        return res.status(responseCode.UNAUTERIZED).json({
           status:responseCode.UNAUTERIZED,
           error:err,
           message: messages.TOKEN_INVALID
          });
      }
      try{
       
        if (decoded.role === role.User) {
          console.log('role.User:',role.User)
          let user = await User.findOne({where:{ id: decoded.id} });
          // console.log('user:',user);
          if(user){
  
            if (user.isDeleted) {
              return res.status(responseCode.UNAUTERIZED).json({
                status:responseCode.UNAUTERIZED,
                error:messages.USER_NOT_FOUND
              });
            }
            if(!user.authToken){
              return res.status(responseCode.FORBIDDEN).json({
                status:responseCode.FORBIDDEN,
                error:messages.YOU_HAVE_LOGEDOUT
              });
            }
            const modifyData = {
              id:user.id,
              email:user.email,
              role:role.User,
              firstName:user.firstName,
              lastName : user.lastName
            }
            req.decodedToken = modifyData;
            next();
          }
          else {
            return res.status(responseCode.UNAUTERIZED).json({
              status:responseCode.UNAUTERIZED,
              error:messages.UNAUTHRIZED_USER
            });
          }
        }
        else{
          return res.status(responseCode.UNAUTERIZED).json({
            status:responseCode.UNAUTERIZED,
            error:messages.UNAUTHRIZED_USER
          });
        }

      }
      catch(error){
        console.log(error);
        return res.status(responseCode.INTERNAL_SERVERERROR).json({
          status:responseCode.INTERNAL_SERVERERROR,
          error:error,
          message:error.message,
        })
      }
    });
  }else{
    return res.status(responseCode.UNAUTERIZED).json({
      status:responseCode.UNAUTERIZED,
      error: messages.UNAUTHRIZED });
  }
}


/**verify user and admin auth for common APIs */

function verifyCommonAuthToken(req, res, next) {
  const headerToken = req.header('Authorization');

  // console.log('headerToken:',headerToken);
  if (!headerToken) {
    return res.status(responseCode.UNAUTERIZED).json({
        status:responseCode.UNAUTERIZED,
        error: messages.UNAUTHRIZED });
  }
  const token = headerToken.split(" ");
  if(token[0]==='Bearer' && token[1]){
  // console.log('headerToken:',token[1]);

    jwt.verify(token[1], process.env.SECRET_KEY, async (err, decoded) => {
      console.log('decoded:',decoded);
      if (err) {
        return res.status(responseCode.UNAUTERIZED).json({
           status:responseCode.UNAUTERIZED,
           error:err,
           message: messages.TOKEN_INVALID
          });
      }
      try{
        if (decoded.role === role.Admin) {// check rode for admin
        
          let user = await Admin.findOne({where:{ id: decoded.id}});
          if(user){
            if (user.isDeleted) {
              
              return res.status(responseCode.UNAUTERIZED).json({
                status:responseCode.UNAUTERIZED,
                error:messages.USER_NOT_FOUND
              });
            }
            if(!user.authToken){
              return res.status(responseCode.FORBIDDEN).json({
                status:responseCode.FORBIDDEN,
                error:messages.YOU_HAVE_LOGEDOUT
              });
            }
            const modifyData = {
              id:user.id,
              email:user.email,
              role:role.Admin,
              firstName:user.firstName,
              lastName : user.lastName
            }
            req.decodedToken = modifyData;
            
            next();
          }
          else {
            return res.status(responseCode.UNAUTERIZED).json({
              status:responseCode.UNAUTERIZED,
              error:messages.UNAUTHRIZED_USER
            });
          }
        }
       else if (decoded.role === role.User) {//check role for user
          console.log('role.User:',role.User)
          let user = await User.findOne({where:{ id: decoded.id} });
          // console.log('user:',user);
          if(user){
  
            if (user.isDeleted) {
              return res.status(responseCode.UNAUTERIZED).json({
                status:responseCode.UNAUTERIZED,
                error:messages.USER_NOT_FOUND
              });
            }
            if(!user.authToken){
              return res.status(responseCode.FORBIDDEN).json({
                status:responseCode.FORBIDDEN,
                error:messages.YOU_HAVE_LOGEDOUT
              });
            }
            const modifyData = {
              id:user.id,
              email:user.email,
              role:role.User,
              firstName:user.firstName,
              lastName : user.lastName
            }
            req.decodedToken = modifyData;
            next();
          }
          else {
            return res.status(responseCode.UNAUTERIZED).json({
              status:responseCode.UNAUTERIZED,
              error:messages.UNAUTHRIZED_USER
            });
          }
        }
        else{
          return res.status(responseCode.UNAUTERIZED).json({
            status:responseCode.UNAUTERIZED,
            error:messages.UNAUTHRIZED_USER
          });
        }

      }
      catch(error){
        console.log(error);
        return res.status(responseCode.INTERNAL_SERVERERROR).json({
          status:responseCode.INTERNAL_SERVERERROR,
          error:error,
          message:error.message,
        })
      }
    });
  }else{
    return res.status(responseCode.UNAUTERIZED).json({
      status:responseCode.UNAUTERIZED,
      error: messages.UNAUTHRIZED });
  }
}

module.exports = { generateToken, verifyAdminAuthToken, verifyUserAuthToken,verifyCommonAuthToken };
