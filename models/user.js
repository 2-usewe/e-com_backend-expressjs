/**admin model */
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const User = sequelize.define('user', {
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
  phone:{
    type:DataTypes.STRING,
    allowNull:false
  },

  password:{
    type: DataTypes.STRING,
    allowNull:false,
  },
 
  role:{
    type: DataTypes.STRING,
    allowNull:false,
    isIn: {
        args: [['user']],
        msg: "Must be user"
      },
    defaultValue:'user'
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
  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
    timestamps:false,
    tableName:'user',
});


module.exports = User; 