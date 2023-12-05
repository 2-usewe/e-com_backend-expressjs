// associations.js
const sequelize = require('../config/database');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const OrderItem = require('../models/orderItems');
const OrderDetails = require('../models/orderDetails');
const Review = require('./review');
// Define the association
Admin.hasMany(Product, { as: 'products' });
Product.belongsTo(Admin, { foreignKey: 'adminId', as:'admin' });

Product.hasMany(Cart,{as:'cart'});
Cart.belongsTo(Product,{ foreignKey: 'productId', as:'product'});

User.hasMany(Cart,{as:'cart'});
Cart.belongsTo(User,{ foreignKey: 'userId', as:'user'});

User.hasMany(OrderItem,{as:'orderItem'});
OrderItem.belongsTo(User,{ foreignKey: 'userId', as:'users'});

Admin.hasMany(OrderItem,{as:'orderitem'});
OrderItem.belongsTo(Admin,{ foreignKey: 'adminId', as:'admin'});

Cart.hasMany(OrderItem,{as:'orderitem'});
OrderItem.belongsTo(Cart,{ foreignKey: 'cartId', as:'cart'});

Product.hasMany(OrderItem,{as:'orderitem'});
OrderItem.belongsTo(Product,{ foreignKey: 'productId', as:'product'});

OrderDetails.hasMany(OrderItem,{as:'orderitem'});
OrderItem.belongsTo(OrderDetails,{ foreignKey: 'orderDetailId', as:'orderDetails'});


Admin.hasMany(OrderDetails,{as:'orderdetails'});
OrderDetails.belongsTo(Admin,{ foreignKey: 'adminId', as:'admin'});

User.hasMany(OrderDetails,{as:'orderdetails'});
OrderDetails.belongsTo(User,{ foreignKey: 'userId', as:'user'});


Product.hasMany(Review,{as:'reviews'});
Review.belongsTo(Product,{ foreignKey: 'productId', as:'product'});

User.hasMany(Review,{as:'reviews'});
Review.belongsTo(User,{ foreignKey: 'userId', as:'user'});


// // Sync models with the database
// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log('Database synchronized');
//   } catch (error) {
//     console.error('Error synchronizing database:', error);
//   }
// })();
