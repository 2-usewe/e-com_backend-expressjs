/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const Product = sequelize.define('product', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },
  category:{
    type: DataTypes.STRING,
    allowNull:false, 
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  variation: {
    type: DataTypes.STRING,
    allowNull:false,   
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull:false, 
  },

  price:{
    type: DataTypes.FLOAT,
    allowNull:false, 
    defaultValue:0,
  },
  ingrediants:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  warning:{
    type: DataTypes.STRING,
    allowNull:true,
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
    type:DataTypes.INTEGER,
    allowNull:true
  },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
    timestamps:false,
    tableName:'product',
});

// (async () => {
//     await sequelize.sync({ force: false ,logging: false });
//     // Code here
//   })();

module.exports = Product; 