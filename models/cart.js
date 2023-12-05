/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const Cart = sequelize.define('cart', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },
  //ref-product 
  productId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  //ref-user
  userId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  adminId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  quantity:{
    type: DataTypes.INTEGER,
    // allowNull:false,
    defaultValue:1
  },
  isOrderPlaced:{
    type: DataTypes.BOOLEAN,
    // allowNull:false,
    defaultValue:false
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
    type:DataTypes.INTEGER,
    defaultValue: true,
  },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
    timestamps:false,
    tableName:'cart',
});



module.exports = Cart; 