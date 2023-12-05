/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const OrderDetails = sequelize.define('orderDetails', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },
  totalPrice:{
    type:DataTypes.FLOAT,
    defaultsTo:0
  },

  paymentId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  billingaddress:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  shippingAddress:{
    type: DataTypes.STRING,
    allowNull:false,
  },
 
  userId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  adminId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  
  createdAt:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },

  updatedAt:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  deletedAt:{
    type: DataTypes.INTEGER,
    allowNull:true,
  },
  
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
    timestamps:false,
    tableName:'orderDetails',
});



module.exports = OrderDetails; 