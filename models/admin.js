/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
// console.log('admin:',sequelize)
const Admin = sequelize.define('admin', {
  // Model attributes are defined here
  id:{
    type: DataTypes.STRING,
    allowNull:false, 
    unique: true,
    primaryKey:true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull:false,   
  },

  email: {
    type: DataTypes.STRING,
    allowNull:false, 
  },

  password:{
    type: DataTypes.STRING,
    allowNull:false,
  },
 
  role:{
    type: DataTypes.STRING,
    allowNull:false,
    isIn: {
        args: [['admin']],
        msg: "Must be admin"
      }
  },
  authToken:{
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
    tableName:'admin',
});



module.exports = Admin; 