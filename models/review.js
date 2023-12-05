/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const Review = sequelize.define('review', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },
  productId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  orderId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  userId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  reviewPoint:{
    type: DataTypes.INTEGER,
    allowNull:false,
    defaultValue:0
  },
  description:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  createdAt:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },

  updatedAt:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
    timestamps:false,
    tableName:'review',
});



module.exports = Review; 