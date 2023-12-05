/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const OrderItem = sequelize.define('orderItem', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },

  productName: {
    type: DataTypes.STRING,
    required: true,
  },
  varient: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isOrderAccepted: {
    type: DataTypes.BOOLEAN,
    defaultsTo: true,
  },
  quantity: {
    type:DataTypes.INTEGER,
    defaultsTo:0
  },
  price:{
    type:DataTypes.FLOAT,
    defaultsTo:0
  },

  userId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  adminId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  cartId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  productId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  orderDetailId:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  orderStatus:{
    type: DataTypes.STRING,
    allowNull:false,
    isIn: {
        args: [['processing','shipped','delivered']],
        msg: "Must be processing,shipped,delivered"
      },
      defaultValue:'processing'
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
    tableName:'orderItem',
});

// (async () => {
//     await sequelize.sync({ force: false ,logging: false });
//     // Code here
//   })();

module.exports = OrderItem; 